/*global angular*/
'use strict';
angular.module('app').constant('monitorColumnNBFEECONTROLMETER', [{
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
    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">智能仪表名称</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected">批量控制:已选<span class="text-danger">{{grid.appScope.$ctrl.selectedItemLength}}</span>个</div>',
    enableColumnMenu: true,
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
    displayName: '通道名称',
    name: 'channels[\'11\'].channel',
    width: '*',
    minWidth: 80,
    enableColumnMenu: false,
    enableSorting: false
}, {
    displayName: '当前读数',
    name: 'channels[\'11\'].realdata',
    type: 'number',
    width: '*',
    minWidth: 120,
    headerCellClass: 'text-right',
    cellClass: 'text-right',
    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'01\'" ng-bind="COL_FIELD"></a></div>'
}, {
    displayName: '状态',
    name: 'channels[\'11\'].status',
    width: '*',
    minWidth: 70,
    enableColumnMenu: false,
    enableSorting: false,
    headerCellClass: 'text-center',
    cellClass: 'text-center',
    cellTemplate: function () {
        return [
            '<div class="ui-grid-cell-contents">',
            '<b ng-show="COL_FIELD===0" class="ng-hide" style="color:#16a085;">正常</b>',
            '<b ng-show="COL_FIELD===1" class="ng-hide" style="color:#c0392b;">数据异常</b>',
            '<b ng-show="COL_FIELD===2" class="ng-hide" style="color:#8e44ad;">通讯异常</b>',
            '</div>'
        ].join('');
    }
}, {
    displayName: '开关',
    name: 'status_switch3',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOn,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOff,\'EMC_SWITCH\',\'switch\',\'mode\')">关</button></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.switch" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_SWITCH" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
}, {
    displayName: '通讯时间',
    name: 'channels[\'11\'].lastupdate',
    width: '*',
    minWidth: 180,
    headerCellClass: 'text-center',
    cellClass: 'text-center',
    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="COL_FIELD">{{COL_FIELD|date:\'yyyy年M月dd日 H:mm:ss\'}}</div>'
}, {
    displayName: '关联商户',
    type: 'number',
    name: 'department[0].title',
    width: '*',
    minWidth: 150
}, {
    displayName: '商户账号',
    type: 'number',
    name: 'department[0].account',
    width: '*',
    minWidth: 150
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