/*global angular*/
'use strict';
angular.module('app').service('User', function ($rootScope, $q, $api, $storage, SweetAlert, MENUCONFIG) {
    var UserData = {};
    angular.extend($rootScope.User = this, {
        // 服务参数
        data: undefined,
        // 服务方法
        $account: function (data) {
            var deferred = $q.defer();
            $api.account.info(data || {
                id: $storage.get('uid')
            }, function (data) {
                if (data.result && Object.keys(data.result).length) {
                    // account/info返回结果中没有uid，应使用_id，切记！🤔
                    $rootScope.Account = data.result;

                    (function eachRule(list, Rule, keys) {
                        angular.forEach(list, function (item, key) {
                            if (key !== 'leaf') {
                                if (item.leaf) {
                                    Rule[key] = true;
                                    $rootScope.Rule.$state[keys.concat([key]).join('.')] = true;
                                } else {
                                    if (keys.length > 1) {
                                        $rootScope.Rule.$state[keys.concat([key]).join('.')] = true;
                                    }
                                    eachRule(item, Rule[key] = Rule[key] || {}, keys.concat([key]));
                                }
                            }
                        });
                    }($rootScope.Account.character.rule['/'], $rootScope.Rule = {
                        $state: {}
                    }, []));

                    angular.forEach(MENUCONFIG, function (item) {
                        (item.ignore || $rootScope.Rule.$state[item.state]) && this.push(item);
                    }, $rootScope.Menu = []);

                    deferred.resolve($rootScope.Account);
                } else {
                    deferred.reject(data);
                }
            }, deferred.reject);
            return deferred.promise;
        },
        $project: function (data) {
            // var deferred = $q.defer();
            return $api.project.info(angular.extend({
                id: sessionStorage.projectid || undefined
            }, data || {}), function (data) {
                // if (data.result && Object.keys(data.result).length) {
                $rootScope.Project = angular.isArray(data.result) && data.result || data.result && [data.result] || [];
                angular.forEach($rootScope.Project, function (item) {
                    this.push(item._id);
                    $rootScope.Project[item._id] = item;
                }, $rootScope.Project.ids = []);
                
                $rootScope.Project.current = _.find($rootScope.Project, function (x) { return x._id === '577499e785ae16405764025f';})  || $rootScope.Project[0];
                document.title = $rootScope.Project.current.title;
                $rootScope.siteTitle = $rootScope.Project.current.title;
            }, function () {
                SweetAlert.warning('没有可用项目');
                // deferred.reject(data);
            }).$promise;
            // return deferred.promise;
        },
        $userinfo: function (data) {
            var deferred = $q.defer();
            $api.business.userinfo(data || {}, function (data) {
                angular.extend(UserData, data.result);
                // UserData.groupmode = UserData.isGroupUser && !sessionStorage.projectid;
                UserData.groupmode = false;

                $q.all([
                    $rootScope.User.$account(),
                    $rootScope.User.$project()
                ]).then(function () {
                    $rootScope.User.data = UserData;

                    angular.forEach(MENUCONFIG, function (item) {
                        if (UserData.groupmode) {
                            if (item.groupmode) {
                                this[item.state] = true;
                                this.push(item);
                            }
                        } else {
                            this[item.state] = true;
                            this.push(item);
                        }
                    }, $rootScope.menuData = []);

                    deferred.resolve(UserData);
                }, deferred.reject);
            }, deferred.reject);
            return deferred.promise;
        },
        $login: function (data) {
            data = data || {};
            var deferred = $q.defer(),
                fromLogin = Object.keys(data).length,
                remember = data.remember;
            delete data.remember;
            $api.auth.login(data, function (data) {

                UserData = data.result;

                fromLogin && $storage.set(UserData, remember);

                $rootScope.User.$userinfo().then(function () {
                    deferred.resolve(UserData);
                }, function (data) {
                    $storage.set(null);
                    deferred.reject(data);
                });

            }, deferred.reject);
            return deferred.promise;
        },
        $logout: function (data) {
            return $api.auth.logout(data || {}, function () {
                delete $rootScope.User.data;
                delete sessionStorage.projectid;
                $storage.set(null);
            }).$promise;
        }
    });
});