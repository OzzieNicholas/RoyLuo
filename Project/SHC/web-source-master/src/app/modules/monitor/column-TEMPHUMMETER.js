/*global angular*/
'use strict';
angular.module('app').constant('monitorColumnTEMPHUMMETER', [{
    displayName: '',
    name: 'multiCheck',
    width: 36,
    minWidth: 36,
    pinnedLeft: true,
    enableColumnMenu: false,
    exporterSuppressExport: true,
    headerCellClass: 'text-center',
    headerCellTemplate: '<div class="ui-grid-cell-contents"><checkbox checked="grid.appScope.$ctrl.multiCheck.all" on-check="grid.appScope.$ctrl.multiCheck(\'all\')"></checkbox></div>',
    cellClass: 'text-center pt5',
    cellTemplate: '<div class="ui-grid-cell-contents"><checkbox checked="row.isSelected" on-check="grid.appScope.$ctrl.multiCheck()"></checkbox></div>'
}, {
    displayName: '',
    name: '$index',
    type: 'number',
    width: 50,
    minWidth: 50,
    pinnedLeft: true,
    enableColumnMenu: false,
    exporterSuppressExport: true,
    headerCellClass: 'text-center',
    headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
    cellClass: 'text-center pt5',
    cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
}, {
    displayName: '智能仪表名称',
    name: 'title',
    minWidth: 150,
    pinnedLeft: true,
    enableColumnMenu: true,
    headerCellTemplate: '<div class="ui-grid-cell-contents"><span ng-show="!grid.appScope.$ctrl.itemSelected" ng-bind="col.displayName"></span>' +
        '<div ng-show="grid.appScope.$ctrl.itemSelected">批量控制:已选<span class="text-danger">{{grid.appScope.$ctrl.selectedItemLength}}</span>个</div></div>',
    enableSorting: true,
    cellClass: 'pt5'
}, {
    displayName: '智能仪表ID',
    name: 'addrid',
    type: 'string',
    minWidth: 120,
    enableColumnMenu: true,
    enableSorting: true,
    cellClass: 'pt5'
}, {
    displayName: '环境温度',
    type: 'number',
    name: 'channels_045',
    minWidth: 120,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'48\'" ng-class="{\'focus\':row.entity.channels[\'48\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'48\'].lasttotal"></span><span class="form-control-feedback"></span></div></div>'
}, {
    displayName: '环境湿度',
    type: 'number',
    name: 'channels_046',
    minWidth: 120,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'49\'" ng-class="{\'focus\':row.entity.channels[\'49\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'49\'].lasttotal"></span><span class="form-control-feedback"></span></div></div>'
}, {
    displayName: '状态',
    name: 'channels[\'49\'].status',
    width: '*',
    minWidth: 70,
    enableColumnMenu: false,
    enableSorting: false,
    headerCellClass: 'text-center',
    cellClass: 'text-center',
    cellTemplate: function () {
        return [
            '<div class="ui-grid-cell-contents">',
            // '<b style="color:#3498db;">正常</b>',
            '<b ng-show="COL_FIELD===0" class="ng-hide" style="color:#16a085;">正常</b>',
            '<b ng-show="COL_FIELD===1" class="ng-hide" style="color:#c0392b;">数据异常</b>',
            '<b ng-show="COL_FIELD===2" class="ng-hide" style="color:#8e44ad;">通讯异常</b>',
            '</div>'
        ].join('');
    }
}, {
    displayName: '通讯时间',
    name: 'channels[\'49\'].lastupdate',
    width: '*',
    minWidth: 180,
    headerCellClass: 'text-center',
    cellClass: 'text-center',
    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="COL_FIELD">{{COL_FIELD|date:\'yyyy年M月dd日 H:mm:ss\'}}</div>'
}, {
    displayName: '发送',
    name: 'send',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">发送</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><a href="javascript:void(0)" class="btn btn-sm btn-info" ng-click="grid.appScope.$ctrl.commandSend()">发送 <i class="glyphicon glyphicon-send"></i></a></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" class="btn btn-sm btn-info" ng-click="grid.appScope.$ctrl.commandSend(row)">发送 <i class="glyphicon glyphicon-send"></i></a></div>'
}, {
    displayName: '位置编码',
    name: 'tag',
    width: '*',
    minWidth: 140
}, {
    displayName: '采集器编号',
    type: 'number',
    name: 'gatewayid',
    width: '*',
    minWidth: 90
}]);