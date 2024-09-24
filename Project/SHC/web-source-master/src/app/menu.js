/*global angular*/
'use strict';
angular.module('app').constant('MENUCONFIG', [{
    state: 'dashboard.main',
    name: '首页',
    icon: 'emweb web-home',
    groupmode: true
}, {
    state: 'dashboard.monitor',
    name: '监控',
    icon: 'emweb web-camera',
    groupmode: true
}, {
    state: 'dashboard.collector.info',
    name: '设备',
    icon: 'emweb web-equipment',
    groupmode: true
}, {
    state: 'dashboard.analyze',
    name: '分析',
    icon: 'emweb web-analyze',
    groupmode: true
}, {
    state: 'dashboard.statistic',
    name: '统计',
    icon: 'emweb web-pie-chart',
    groupmode: true
}, {
    state: 'dashboard.financial',
    name: '财务',
    icon: 'emweb web-financial'
}]);