/*global angular*/
'use strict';
window.APIORIGIN = location.origin.replace(/\/\/(pre)?(\w*)\./, '//$1api.');
angular.module('app').constant('APICONFIG', {
    auth: ['auth', , {
        login: {},
        logout: {}
    }],
    account: ['account', , {
        info: {}
    }],
    project: ['project', , {
        info: {}
    }],
    billingservice: ['billingservice', , {
        info: {}
    }],
    business: ['business', , {

        userinfo: {},

        //////首页//////
        //日历
        calendar: {
            cache: true
        },
        //今日费用
        dailycost: {},
        //总能耗
        monthlykgce: {},
        //水电气构成
        energyconstitute: {},
        //能耗细分
        dailysensordetail: {},
        //能效比曲线
        energyeffectiverate: {},
        //节能星级
        projectdetail: {},

        //////监控，控制//////
        //监控数据
        monitor: {},
        //曲线数据
        channeldetail: {},

        //////分析//////
        //建筑=>建筑能耗收入
        buildingstatistic: {},
        //建筑=>能耗收入比
        energyincomerate: {},
        //建筑=>能耗实时曲线图
        energytimeline: {},
        //社会属性=>社会属性能耗收入
        socitystatistic: {},
        //社会属性=>能耗收入比
        socitydetail: {},
        //社会属性=>能耗实时曲线图
        socitytimeline: {},
        //集团分析
        groupanalysis: {},

        //////统计//////
        //结算报表
        settlereport: {},
        //月能耗报表
        monthlyreport: {},
        //日能耗报表
        dailyreport: {},
        //集团统计报表
        projectreport: {},

        //////财务//////
        //最近充值
        recentchargelog: {},
        //商户信息
        departments: {},
        //消费清单
        departmentusage: {},

        //统计页面=>商户报表
        departmentreport: {}

    }],
    //能耗分类
    energy: ['energy', , {
        info: {
            cache: true
        }
    }],
    //数据管理器
    collector: ['collector', , {
        add: {},
        delete: {},
        info: {},
        update: {},
        status: {}
    }],
    //智能仪表
    control: ['control', , {
        // 发送命令
        send: {},
        // 命令透传
        through: {}
    }],
    //设备接口
    device: ['device', , {
        type: {
            cache: true
        }
    }],
    //消息推送
    message: ['message', , {
        //催缴欠费
        remindrecharge: {}
    }],
    //社会属性
    customer: ['customer', , {
        //查询
        info: {}
    }]
}).config(function ($qProvider, $httpProvider) {
    $qProvider.errorOnUnhandledRejections(false); //use in angular#1.6.x
    /*  register the interceptor via an anonymous factory  */
    $httpProvider.interceptors.push(function ($rootScope, $q, $location, $timeout) {
        $rootScope.HttpInProgress = 0;

        function HttpInProgress(config, isRequest) {
            if (isRequest) {
                if (angular.isObject(config.params)) {
                    config._inprogress = config.params._inprogress;
                    delete config.params._inprogress;
                }
                if (angular.isObject(config.data) && angular.isUndefined(config._inprogress)) {
                    config._inprogress = config.data._inprogress;
                    delete config.data._inprogress;
                }
                if (config._inprogress !== false) {
                    config._inprogress = $timeout(function () {
                        $rootScope.HttpInProgress++;
                        config._inprogress = $rootScope.HttpInProgress;
                    }, 60);
                }
            } else {
                if (config._inprogress !== false) {
                    if (angular.isNumber(config._inprogress)) {
                        $timeout(function () {
                            $rootScope.HttpInProgress--;
                        }, 60);
                    } else if (angular.isObject(config._inprogress)) {
                        $timeout.cancel(config._inprogress);
                    }
                }
                delete config._inprogress;
            }
        }
        return {
            request: function (request) {
                HttpInProgress(request, true);
                return request;
            },
            requestError: function (request) {
                return $q.reject(request);
            },
            response: function (result) {
                HttpInProgress(result.config, false);
                if (angular.isObject(result.data) && (result.data.code || (result.data.result && angular.isObject(result.data.result) && !Object.keys(result.data.result).length))) {
                    /90000005|90000007/.test(result.data.code) && $location.url('/dashboard/login').replace();
                    return $q.reject(result.data);
                }
                return result;
            },
            responseError: function (result) {
                HttpInProgress(result.config, false);
                return $q.reject(result.data || {
                    code: result.status
                });
            }
        };
    });
}).service('$api', function ($rootScope, $resource, APICONFIG) {

    /* api service
     * $resource(url, [paramDefaults], [actions], options);
     * usage:
     *      $api.name1.action([parameters], [success], [error])
     *      $api.name2.action([parameters], postData, [success], [error])
     */
    // 自动补全URL
    var fullUrl = function (url, bool) {
            return /(^http:\/\/)|(^https:\/\/)/.test(url) && url || [
                window.APIORIGIN + '/api/' + url,
                bool && '/:_api_action' || ''
            ].join('');
        },
        // 请求队列
        stateRequests = [];

    // 监听路由变动，即时取消上一次路由中的API请求
    $rootScope.$on('$stateChangeStart', function () {
        angular.forEach(stateRequests, function (request) {
            !request.$resolved && request.$cancelRequest();
        });
        stateRequests = [];
    });
    angular.forEach(APICONFIG, function (config, name) {
        if (angular.isArray(config) && config[0]) {
            config[0] = fullUrl(config[0], !!config[2]);
            config[3] = angular.extend({
                // 默认可取消
                cancellable: true
            }, config[3]);
            angular.forEach(config[2], function (action, name) {
                angular.extend(action, {
                    url: action.url && fullUrl(action.url) || undefined,
                    method: action.method || 'POST',
                    withCredentials: true,
                    params: angular.extend(action.url && {} || {
                        _api_action: name
                    }, action.params)
                });
            });
            angular.forEach(this[name] = $resource.apply($resource, config), function (fn, action) {
                this[action] = function () {
                    var request, cancellable;

                    if (angular.isObject(arguments[0]) && angular.isDefined(arguments[0]._cancellable)) {
                        cancellable = arguments[0]._cancellable;
                        delete arguments[0]._cancellable;
                    }
                    if (angular.isObject(arguments[1]) && angular.isDefined(arguments[1]._cancellable)) {
                        cancellable = arguments[1]._cancellable;
                        delete arguments[1]._cancellable;
                    }

                    request = fn.apply(this, arguments);

                    if (cancellable === false) {
                        delete request.$cancelRequest;
                    }

                    // 将该请求添加到队列中，切换路由时取消未完成的请求
                    request.$cancelRequest && stateRequests.push(request);

                    return request;
                };
            }, this[name]);
        }
    }, this);

});