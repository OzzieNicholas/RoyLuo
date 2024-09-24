angular.module('app').constant('monitorColumnZTYPETEMPCONTROL', [{
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
    displayName: '能量系数',
    type: 'number',
    name: 'channels_052',
    minWidth: 140,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="input-group input-group-sm focus pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'33\'"><span class="input-group-addon"><i class="emweb web-charging"></i></span><span class="form-control" ng-bind="row.entity.channels[\'33\'].lasttotal"></span></div></div>'
}, {
    displayName: '状态',
    name: 'channels[\'33\'].status',
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
    displayName: '面板开关',
    name: 'status_switch5',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">面板开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOn,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOff,\'EMC_SWITCH\',\'switch\',\'mode\')">关</button></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.switch" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_SWITCH" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
}, {
    displayName: '阀控开关',
    name: 'status_valve5',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">阀控开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.on,\'EMC_VALVE\',\'valve\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.off,\'EMC_VALVE\',\'valve\',\'mode\')">关</button></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.valve" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_VALVE" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_VALVE\',\'valve\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
}, {
    displayName: '模式',
    name: 'status_mode5',
    minWidth: 210,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">模式</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><control-mode class="btn-group" ng-if="grid.appScope.$ctrl.itemSelected" mode="grid.appScope.$ctrl.batchControl.mode.entity.status.mode" on-mode="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.mode,\'EMC_MODE\',\'mode\',\'mode\')"></control-mode></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><control-mode hide="[\'EMC_DEHUMIDIFYING\']" class="btn-group" mode="row.entity.status.mode" disabled="!row.entity.command.EMC_MODE" on-mode="grid.appScope.$ctrl.multiControl(row,\'EMC_MODE\',\'mode\',\'mode\')"></control-mode></div>'
}, {
    displayName: '风速',
    name: 'status_windspeed5',
    minWidth: 155,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">风速</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><control-speed speed="grid.appScope.$ctrl.batchControl.windspeed.entity.status.windspeed" on-speed="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.windspeed,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>',
    cellTemplate: '<div class="ui-grid-cell-contents"><controlspeed-z speed="row.entity.status.windspeed" disabled="!row.entity.command.EMC_WINDSPEED" on-speed="grid.appScope.$ctrl.multiControl(row,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></controlspeed-z></div>'
}, {
    displayName: '室内温度℃',
    type: 'number',
    name: 'channels_051',
    minWidth: 100,
    enableSorting: false,
    enableColumnMenu: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback focus"><span class="form-control text-right" ng-bind="row.entity.status.inroomtemperature||row.entity.channels[\'40\'].lasttotal"></span></div></div>'
}, {
    displayName: '设置温度',
    name: 'channels_050',
    minWidth: 220,
    enableSorting: false,
    enableColumnMenu: false,
    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">设置温度</div><div class="ui-grid-cell-contents pl10 pr10" ng-if="grid.appScope.$ctrl.itemSelected"><control-slider value="grid.appScope.$ctrl.batchControl.temperature.entity.status.temperature" on-slider="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.temperature,\'EMC_TEMPERATURE\',\'temperature\',\'value\')"></control-slider></div>',
    cellTemplate: '<div class="ui-grid-cell-contents pl10 pr10"><controlslider-z value="row.entity.status.temperature" disabled="!row.entity.command.EMC_TEMPERATURE" on-slider="grid.appScope.$ctrl.multiControl(row,\'EMC_TEMPERATURE\',\'temperature\',\'value\')"></controlslider-z></div>'
}, {
    displayName: '通讯时间',
    name: 'channels[\'33\'].lastupdate',
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