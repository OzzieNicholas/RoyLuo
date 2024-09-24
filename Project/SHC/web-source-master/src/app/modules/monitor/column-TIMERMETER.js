/*global angular*/
'use strict';
angular.module('app').constant('monitorColumnTIMERMETER', [{
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
    displayName: '冷量系数',
    type: 'number',
    name: 'channels_045',
    minWidth: 120,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'07\'" ng-class="{\'focus\':!row.entity.nocold}"><span class="form-control text-right" ng-bind="row.entity.channels[\'07\'].lasttotal"></span><span class="form-control-feedback"></span></div></div>'
}, {
    displayName: '热量系数',
    type: 'number',
    name: 'channels_046',
    minWidth: 120,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'08\'" ng-class="{\'focus\':!row.entity.noheat}"><span class="form-control text-right" ng-bind="row.entity.channels[\'08\'].lasttotal"></span><span class="form-control-feedback"></span></div></div>'
}, {
    displayName: '状态',
    name: 'reportStatus',
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
    displayName: '阀门开关',
    name: 'valve_control',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">阀门开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.on,\'EMC_VALVE\',\'valve\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.off,\'EMC_VALVE\',\'valve\',\'mode\')">关</button></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.valve" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_VALVE" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_VALVE\',\'valve\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
}, {
    displayName: '模式',
    name: 'status_mode04',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">模式</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.cool,\'EMC_MODE\',\'mode\',\'mode\')">制冷</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.heat,\'EMC_MODE\',\'mode\',\'mode\')">制热</button></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.mode" state-on="EMC_COOLING" state-off="EMC_HEATING" disabled="!row.entity.command.EMC_MODE" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_MODE\',\'mode\',\'mode\')" data-on-text="制冷" data-off-text="制热" data-on-color="info" data-off-color="danger"></switch></div>'
}, {
    displayName: '档位',
    name: 'gears',
    minWidth: 130,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><control-speed speed="row.entity.status.windspeed" disabled="!row.entity.command.EMC_WINDSPEED" on-speed="grid.appScope.$ctrl.multiControl(row,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>'
}, {
    displayName: '通讯时间',
    name: 'lastupdate',
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