/*global angular*/
'use strict';
angular.module('app').config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
    // HTML5 mode
    $locationProvider.html5Mode(true);
    // invalid router
    $urlRouterProvider.otherwise('/');
    // setup router
    $stateProvider.state('otherwise', {
        url: '/',
        resolve: {
            rewrite: function ($state) {
                $state.go('dashboard.main', {}, {
                    location: 'replace'
                });
            }
        }
    }).state('login', {
        url: '/dashboard/login',
        template: '<login></login>',
        resolve: {
            deps: function ($ocLazyLoad) {
                document.title = '古鸽智慧云能源';
                return $ocLazyLoad.load([
                    'app/modules/login/login.min.css',
                    'app/modules/login/login.min.js'
                ]);
            }
        }
    }).state('dashboard', {
        abstract: true,
        url: '/dashboard{projectid}',
        template: '<dashboard></dashboard>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/modules/dashboard/dashboard.min.css',
                    'app/modules/dashboard/dashboard.min.js',
                    'app/components/autoHeight.min.js',
                    'app/directives/datetimepicker.min.js',
                    'app/directives/perfect-scrollbar.min.js'
                ]);
            }
        }
    }).state('dashboard.main', {
        url: '/main',
        template: '<main></main>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/modules/main/main.min.css',
                    'app/modules/main/main.min.js',
                    'app/components/highcharts.min.js'
                ]);
            }
        }
    }).state('dashboard.monitor', {
        url: '/monitor',
        template: '<monitor></monitor>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.css'
                    ]
                }, {
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.js',
                        'https://cdn.bootcss.com/jshashes/1.0.5/hashes.min.js',
                        'app/modules/monitor/monitor.min.css',
                        'app/modules/monitor/monitor.min.js',
                        'app/components/highcharts.min.js',
                        'app/components/checkbox.min.js',
                        'app/components/switch.min.js',
                        'app/components/jstree.min.js',
                        'app/components/customer/customer.min.js',
                        'app/modules/monitor/batch-control.min.js',
                        'app/modules/monitor/column-groupmode.min.js',
                        'app/modules/monitor/column-TIMERMETER.min.js',
                        'app/modules/monitor/column-multifunction.min.js',
                        'app/modules/monitor/column-ZTYPETEMPCONTROL.min.js',
                        'app/modules/monitor/column-GASMETER.min.js',
                        'app/modules/monitor/column-TEMPHUMMETER.min.js',
                        'app/modules/monitor/column-NBCOLDWATERMETER.min.js',
                        'app/modules/monitor/column-NBFEECONTROLMETER.min.js'
                    ]
                }]);
            }
        }
    }).state('dashboard.collector', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/collector',
        data: {
            redirect: 'dashboard.collector.info'
        },
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    files: [
                        'https://cdn.bootcss.com/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js'
                    ]
                }]);
            }
        }
    }).state('dashboard.collector.info', {
        url: '/info',
        templateUrl: 'app/modules/collector/info.html',
        controller: 'CollectorIndex',
        data: {
            title: '数据管理器'
        },
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/modules/collector/info.min.js',
                    'app/components/checkbox.min.js'
                ]);
            }
        }
    }).state('dashboard.analyze', {
        url: '/analyze',
        template: '<analyze></analyze>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/modules/analyze/analyze.min.css',
                    'app/modules/analyze/analyze.min.js',
                    'app/components/highcharts.min.js'
                ]);
            }
        }
    }).state('dashboard.statistic', {
        url: '/statistic/:tab',
        template: '<statistic></statistic>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.css'
                    ]
                }, {
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.js',
                        'app/modules/statistic/statistic.min.css',
                        'app/modules/statistic/statistic.min.js'
                    ]
                }]);
            }
        }
    }).state('dashboard.financial', {
        url: '/financial/:tab',
        template: '<financial></financial>',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.css'
                    ]
                }, {
                    files: [
                        'https://cdn.bootcss.com/angular-ui-grid/4.0.4/ui-grid.min.js',
                        'app/modules/statistic/statistic.min.css',
                        'app/modules/financial/financial.min.js'
                    ]
                }]);
            }
        }
    });
}).run(function ($rootScope, $state, User) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (toParams.projectid) {
            sessionStorage.projectid = toParams.projectid;
            delete toParams.projectid;
        }
        if (!/^(otherwise|login)$/.test(toState.name)) {
            console.log(toState.name, toParams, $rootScope.menuData, User.data);
            if (angular.isUndefined(User.data)) {
                event.preventDefault();
                User.$userinfo().then(function () {
                    $state.go(toState.name, toParams, {
                        location: 'replace'
                    });
                }, function () {
                    $state.go('login');
                });
            } else if (!$rootScope.menuData[toState.name]) {
                event.preventDefault();
                $state.go('dashboard.main');
            }
        }
    });
    // }).run(function ($rootScope, $transitions, $state, User) {
    //     $transitions.onBefore({}, function (trans) {
    //         var params = trans.params();
    //         if (params.projectid) {
    //             sessionStorage.projectid = params.projectid;
    //             delete params.projectid;
    //             return $state.target(trans.to(), params, trans.options());
    //         }
    //     });
    //     $transitions.onStart({
    //         to: 'dashboard.**'
    //     }, function (trans) {
    //         var state = trans.$to(),
    //             toRule = function () {
    //                 if (state.name !== 'dashboard.main' && !$rootScope.menuData[state.name]) {
    //                     return trans.router.stateService.target('dashboard.main', {}, {
    //                         location: 'replace'
    //                     });
    //                 }
    //             };
    //         if (angular.isUndefined(User.data)) {
    //             return User.$userinfo().then(toRule);
    //         }
    //         return toRule();
    //     });
});