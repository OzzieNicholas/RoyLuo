/*global angular,moment*/
'use strict';
angular.module('app').component('monitor', {
    templateUrl: 'app/modules/monitor/monitor.html',
    controller: function ($rootScope, $scope, $element, $q, $api, $timeout, SweetAlert,
        monitorBatchControl,
        monitorColumnGroupmode,
        monitorColumnTIMERMETER,
        monitorColumnMultifunction,
        monitorColumnTEMPHUMMETER,
        monitorColumnZTYPETEMPCONTROL,
        monitorColumnGASMETER,
        monitorColumnNBCOLDWATERMETER,
        monitorColumnNBFEECONTROLMETER
    ) {

        var self = this,
            projectId = $rootScope.Project.current && $rootScope.Project.current._id,
            multiIds = function (item, cmdKey, statusKey) {
                if (angular.isObject(item) && !angular.isArray(item)) {
                    var Ids = [],
                        status;
                    item.entity && (status = item.entity.status[statusKey]);
                    item.entity && (item.entity.status['prev_' + statusKey] = undefined);
                    angular.forEach(self.gridApi.grid.rows, function (row) {
                        if (!item.entity.id && row.isSelected && row.entity.command[cmdKey]) {
                            if (item.entity && row.entity.id !== item.entity.id) {
                                row.entity.status['prev_' + statusKey] = row.entity.status[statusKey];
                                row.entity.status[statusKey] = status;
                            }
                            Ids.push(row.entity.id);
                        }
                    });
                    if (Ids.length) {
                        if (item.entity.id && !item.isSelected) {
                            item.isSelected = true;
                            Ids.push(item.entity.id);
                        }
                        self.multiCheck();
                    } else {
                        item.entity.id && Ids.push(item.entity.id);
                    }
                    return Ids;
                } else {
                    angular.forEach(self.gridApi.grid.rows, function (row) {
                        if (~item.indexOf(row.entity.id)) {
                            row.entity.status[statusKey] = row.entity.status['prev_' + statusKey];
                            delete row.entity.status['prev_' + statusKey];
                        }
                    });
                }
            };

        self.isHide = true;
        self.date = moment().format('YYYY-MM');
        $rootScope.User.data.groupmode && $element.find('select.form-control.select').select2({
            dropdownCssClass: 'monitor-select2-dropdown-inverse'
        }).change(function () {
            self.level = this.value;
            // self.list();
        });

        self.isHide = true;
        self.itemSelected = false;

        // 多选/全选
        self.multiCheck = function (item) {
            if (item === 'all') {
                self.multiCheck.all && (self.itemSelected = true);
                !self.multiCheck.all && (self.itemSelected = false);
                angular.forEach(self.gridApi.grid.rows, function (item) {
                    item.isSelected = self.multiCheck.all;
                });
                self.selectedItemLength = self.gridOptions.data.length;
            } else {
                var select = [];
                self.multiCheck.all = true;
                self.itemSelected = false;
                angular.forEach(self.gridApi.grid.rows, function (item) {
                    if (!item.isSelected) {
                        delete self.multiCheck.all;
                    }
                    if (item.isSelected) {
                        select.push(item);
                        self.itemSelected = true;
                    }
                });
                self.selectedItemLength = select.length;
            }
            self.allItems = self.gridApi.grid.rows;
        };


        self.batchControl = monitorBatchControl;

        //显示状态切换
        self.showException = false;
        self.exceptionChange = function () {
            self.deviceType.select(self.deviceType.selected);
        };

        // self.filter = function () {
        //     self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        //     self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        // };

        self.export = function () {

            if ($rootScope.User.data.groupmode) {
                self.gridOptions.exporterCsvFilename = document.title + '_监控_' + self.date.replace(/\-/g, '') + '.csv';
            } else {
                self.gridOptions.exporterCsvFilename = document.title + '_监控_' + self.deviceType.selected.name + '_' + moment().format('YYYYMMDDHHmmss') + '.csv';
            }

            self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));

        };
        //ui-grid配置
        self.gridOptions = {
            onRegisterApi: function (gridApi) {
                gridApi.infiniteScroll.on.needLoadMoreData($scope, function () {
                    var defer = $q.defer(),
                        resolve = function () {
                            defer.resolve();
                        },
                        reject = function () {
                            gridApi.infiniteScroll.dataLoaded();
                            defer.reject();
                        };
                    (function (promise) {
                        if (promise) {
                            promise.then(function () {
                                gridApi.infiniteScroll.saveScrollPercentage();
                                gridApi.infiniteScroll.dataLoaded(false, true).then(resolve, reject);
                            }, reject);
                        } else {
                            reject();
                        }
                    }(self.list(true)));
                    return defer.promise;
                });
                self.gridApi = gridApi;
            },
            rowHeight: 34,
            infiniteScrollDown: true,
            enableColumnMenus: false,
            enableColumnResizing: true,
            exporterOlderExcelCompatibility: true,
            exporterFieldCallback: function (grid, row, col, value) {
                return {
                    name: true,
                    addr: true,
                    title: true,
                    // channel: true,
                    // energycategory: true,
                    time: true
                }[col.field] ? '="' + (value || '') + '"' : value;
            }
        };

        if ($rootScope.User.data.groupmode) {
            self.gridOptions.columnDefs = monitorColumnGroupmode;
        }
        self.columnDefsData = function () {
            if (self.deviceType.selected.id === 'ELECTRICITYMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
                    displayName: '',
                    name: 'multiCheck',
                    width: 45,
                    minWidth: 45,
                    pinnedLeft: true,
                    enableColumnMenu: false,
                    exporterSuppressExport: true,
                    headerCellClass: 'text-center',
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;"><checkbox checked="grid.appScope.$ctrl.multiCheck.all" on-check="grid.appScope.$ctrl.multiCheck(\'all\')"></checkbox></div>',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'11\'" ng-bind="COL_FIELD"></a></div>'
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
                    displayName: '控制',
                    name: 'status_switch1',
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
                }];
            } else if (self.deviceType.selected.id === 'HOTWATERMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    name: 'channels[\'03\'].channel',
                    width: '*',
                    minWidth: 80,
                    enableColumnMenu: false,
                    enableSorting: false
                }, {
                    displayName: '当前读数',
                    name: 'channels[\'03\'].realdata',
                    type: 'number',
                    width: '*',
                    minWidth: 120,
                    headerCellClass: 'text-right',
                    cellClass: 'text-right',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'03\'" ng-bind="COL_FIELD"></a></div>'
                }, {
                    displayName: '状态',
                    name: 'channels[\'03\'].status',
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
                    displayName: '控制',
                    name: 'status_switch2',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOn,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOff,\'EMC_SWITCH\',\'switch\',\'mode\')">关</button></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.switch" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_SWITCH" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
                }, {
                    displayName: '通讯时间',
                    name: 'channels[\'03\'].lastupdate',
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
                }];
            } else if (self.deviceType.selected.id === 'NBCOLDWATERMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnNBCOLDWATERMETER;
            } else if (self.deviceType.selected.id === 'NBFEECONTROLMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnNBFEECONTROLMETER;
            } else if (self.deviceType.selected.id === 'COLDWATERMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    name: 'channels[\'01\'].channel',
                    width: '*',
                    minWidth: 80,
                    enableColumnMenu: false,
                    enableSorting: false
                }, {
                    displayName: '当前读数',
                    name: 'channels[\'01\'].realdata',
                    type: 'number',
                    width: '*',
                    minWidth: 120,
                    headerCellClass: 'text-right',
                    cellClass: 'text-right',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'01\'" ng-bind="COL_FIELD"></a></div>'
                }, {
                    displayName: '状态',
                    name: 'channels[\'01\'].status',
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
                    displayName: '控制',
                    name: 'status_switch3',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOn,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOff,\'EMC_SWITCH\',\'switch\',\'mode\')">关</button></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.switch" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_SWITCH" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
                }, {
                    displayName: '通讯时间',
                    name: 'channels[\'01\'].lastupdate',
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
                }];
            } else if (self.deviceType.selected.id === 'ENERGYMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    displayName: '序号',
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
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected" ng-bind="col.displayName"></div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected">批量控制:已选<span class="text-danger">{{grid.appScope.$ctrl.selectedItemLength}}</span>个</div>',
                    enableColumnMenu: true,
                    enableSorting: true,
                    cellClass: 'pt5'
                }, {
                    displayName: '智能仪表ID',
                    type: 'string',
                    name: 'addrid',
                    minWidth: 120,
                    enableColumnMenu: true,
                    enableSorting: true,
                    cellClass: 'pt5'
                }, {
                    displayName: '供水温度℃',
                    type: 'number',
                    name: 'channels_040',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'05\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'05\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '回水温度℃',
                    type: 'number',
                    name: 'channels_041',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'06\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'06\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '温差℃',
                    type: 'number',
                    name: 'channels_042',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'05\']}"><span class="form-control text-right" ng-bind="(row.entity.channels[\'05\'].lasttotal>row.entity.channels[\'06\'].lasttotal?row.entity.channels[\'05\'].lasttotal-row.entity.channels[\'06\'].lasttotal:row.entity.channels[\'06\'].lasttotal-row.entity.channels[\'05\'].lasttotal).toFixed(2)"></span></div></div>'
                }, {
                    displayName: '流量m³',
                    type: 'number',
                    name: 'channels_043',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'04\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'04\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '流速m³/h',
                    type: 'number',
                    name: 'channels_044',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'09\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'09\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '总冷量KWh',
                    type: 'number',
                    name: 'channels_045',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'07\'" ng-class="{\'focus\':!row.entity.nocold}"><span class="form-control text-right" ng-bind="row.entity.channels[\'07\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '总热量KWh',
                    type: 'number',
                    name: 'channels_046',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'08\'" ng-class="{\'focus\':!row.entity.noheat}"><span class="form-control text-right" ng-bind="row.entity.channels[\'08\'].lasttotal"></span></div></div>'
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
                    displayName: '模式',
                    name: 'status_mode04',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">模式</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.cool,\'EMC_MODE\',\'mode\',\'mode\')">制冷</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.heat,\'EMC_MODE\',\'mode\',\'mode\')">制热</button></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.mode" state-on="EMC_COOLING" state-off="EMC_HEATING" disabled="!row.entity.command.EMC_MODE" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_MODE\',\'mode\',\'mode\')" data-on-text="制冷" data-off-text="制热" data-on-color="info" data-off-color="danger"></switch></div>'
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
                }];
            } else if (self.deviceType.selected.id === 'TEMPERATURECONTROL') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    minWidth: 130,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">风速</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><control-speed speed="grid.appScope.$ctrl.batchControl.windspeed.entity.status.windspeed" on-speed="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.windspeed,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><control-speed speed="row.entity.status.windspeed" disabled="!row.entity.command.EMC_WINDSPEED" on-speed="grid.appScope.$ctrl.multiControl(row,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>'
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
                    cellTemplate: '<div class="ui-grid-cell-contents pl10 pr10"><control-slider value="row.entity.status.temperature" disabled="!row.entity.command.EMC_TEMPERATURE" on-slider="grid.appScope.$ctrl.multiControl(row,\'EMC_TEMPERATURE\',\'temperature\',\'value\')"></control-slider></div>'
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
                }];
            } else if (self.deviceType.selected.id === 'TIMERMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnTIMERMETER;
            } else if (self.deviceType.selected.id === 'MELECTRICITYMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnMultifunction;
            } else if (self.deviceType.selected.id === 'ULTRACOLDWATERMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    displayName: '累计流量m³',
                    type: 'number',
                    name: 'channels_043',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-class="{\'focus\':row.entity.channels[\'04\']}" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'04\'"><span class="form-control text-right" ng-bind="row.entity.channels[\'04\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '流速m³/s',
                    type: 'number',
                    name: 'channels_044',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'09\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'09\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '供水温度℃',
                    type: 'number',
                    name: 'channels_040',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'05\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'05\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '状态',
                    name: 'channels[\'04\'].status',
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
                    displayName: '通讯时间',
                    name: 'channels[\'04\'].lastupdate',
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
                }];
            } else if (self.deviceType.selected.id === 'PRESSUREMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    displayName: '当前压力（MPa）',
                    name: 'channels[50].lasttotal',
                    width: '*',
                    minWidth: 140,
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'50\'" ng-bind="COL_FIELD"></a></div>'
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
                            // '<b style="color:#3498db;">正常</b>',
                            '<b ng-show="COL_FIELD===0" class="ng-hide" style="color:#16a085;">正常</b>',
                            '<b ng-show="COL_FIELD===1" class="ng-hide" style="color:#c0392b;">数据异常</b>',
                            '<b ng-show="COL_FIELD===2" class="ng-hide" style="color:#8e44ad;">通讯异常</b>',
                            '</div>'
                        ].join('');
                    }
                }, {
                    displayName: '通讯时间',
                    name: 'lastupdate',
                    width: '*',
                    minWidth: 180,
                    headerCellClass: 'text-center',
                    cellClass: 'text-center',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="COL_FIELD">{{COL_FIELD|date:\'yyyy年M月dd日 H:mm:ss\'}}</div>'
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
                }];
            } else if (self.deviceType.selected.id === 'TTYPETEMPCONTROL') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    minWidth: 150,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">模式</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><control-mode class="btn-group" ng-if="grid.appScope.$ctrl.itemSelected" hide="[\'EMC_DEHUMIDIFYING\',\'EMC_VERTILATING\']" mode="grid.appScope.$ctrl.batchControl.mode.entity.status.mode" on-mode="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.mode,\'EMC_MODE\',\'mode\',\'mode\')"></control-mode></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><control-mode class="btn-group" hide="[\'EMC_DEHUMIDIFYING\',\'EMC_VERTILATING\']" mode="row.entity.status.mode" disabled="!row.entity.command.EMC_MODE" on-mode="grid.appScope.$ctrl.multiControl(row,\'EMC_MODE\',\'mode\',\'mode\')"></control-mode></div>'
                }, {
                    displayName: '风速',
                    name: 'status_windspeed5',
                    minWidth: 130,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">风速</div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected"><control-speed speed="grid.appScope.$ctrl.batchControl.windspeed.entity.status.windspeed" on-speed="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.windspeed,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><control-speed speed="row.entity.status.windspeed" disabled="!row.entity.command.EMC_WINDSPEED" on-speed="grid.appScope.$ctrl.multiControl(row,\'EMC_WINDSPEED\',\'windspeed\',\'mode\')"></control-speed></div>'
                }, {
                    displayName: '设置温度',
                    name: 'channels_050',
                    minWidth: 220,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected">设置温度</div><div class="ui-grid-cell-contents pl10 pr10" ng-if="grid.appScope.$ctrl.itemSelected"><control-slider value="grid.appScope.$ctrl.batchControl.temperature.entity.status.temperature" on-slider="grid.appScope.$ctrl.multiControl(grid.appScope.$ctrl.batchControl.temperature,\'EMC_TEMPERATURE\',\'temperature\',\'value\')"></control-slider></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents pl10 pr10"><control-slider value="row.entity.status.temperature" disabled="!row.entity.command.EMC_TEMPERATURE" on-slider="grid.appScope.$ctrl.multiControl(row,\'EMC_TEMPERATURE\',\'temperature\',\'value\')"></control-slider></div>'
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
                }];
            } else if (self.deviceType.selected.id === 'HEATENERGYMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    displayName: '序号',
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
                    headerCellTemplate: '<div class="ui-grid-cell-contents" ng-if="!grid.appScope.$ctrl.itemSelected" ng-bind="col.displayName"></div><div class="ui-grid-cell-contents" ng-if="grid.appScope.$ctrl.itemSelected">批量控制:已选<span class="text-danger">{{grid.appScope.$ctrl.selectedItemLength}}</span>个</div>',
                    enableColumnMenu: true,
                    enableSorting: true,
                    cellClass: 'pt5'
                }, {
                    displayName: '智能仪表ID',
                    type: 'string',
                    name: 'addrid',
                    minWidth: 120,
                    enableColumnMenu: true,
                    enableSorting: true,
                    cellClass: 'pt5'
                }, {
                    displayName: '供水温度℃',
                    type: 'number',
                    name: 'channels_040',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'05\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'05\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '回水温度℃',
                    type: 'number',
                    name: 'channels_041',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'06\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'06\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '温差℃',
                    type: 'number',
                    name: 'channels_042',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'05\']}"><span class="form-control text-right" ng-bind="(row.entity.channels[\'05\'].lasttotal>row.entity.channels[\'06\'].lasttotal?row.entity.channels[\'05\'].lasttotal-row.entity.channels[\'06\'].lasttotal:row.entity.channels[\'06\'].lasttotal-row.entity.channels[\'05\'].lasttotal).toFixed(2)"></span></div></div>'
                }, {
                    displayName: '流量m³',
                    type: 'number',
                    name: 'channels_043',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback" ng-class="{\'focus\':row.entity.channels[\'04\']}"><span class="form-control text-right" ng-bind="row.entity.channels[\'04\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '总冷量KWh',
                    type: 'number',
                    name: 'channels_045',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'07\'" ng-class="{\'focus\':!row.entity.nocold}"><span class="form-control text-right" ng-bind="row.entity.channels[\'07\'].lasttotal"></span></div></div>'
                }, {
                    displayName: '总热量KWh',
                    type: 'number',
                    name: 'channels_046',
                    minWidth: 120,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="form-group form-group-sm has-feedback pointer" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'08\'" ng-class="{\'focus\':!row.entity.noheat}"><span class="form-control text-right" ng-bind="row.entity.channels[\'08\'].lasttotal"></span></div></div>'
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
                    displayName: '模式',
                    name: 'status_mode04',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">模式</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.cool,\'EMC_MODE\',\'mode\',\'mode\')">制冷</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.heat,\'EMC_MODE\',\'mode\',\'mode\')">制热</button></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.mode" state-on="EMC_COOLING" state-off="EMC_HEATING" disabled="!row.entity.command.EMC_MODE" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_MODE\',\'mode\',\'mode\')" data-on-text="制冷" data-off-text="制热" data-on-color="info" data-off-color="danger"></switch></div>'
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
                }];
            } else if (self.deviceType.selected.id === 'OXYGENMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = [{
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
                    name: 'channels[\'46\'].channel',
                    width: '*',
                    minWidth: 80,
                    enableColumnMenu: false,
                    enableSorting: false
                }, {
                    displayName: '当前读数',
                    name: 'channels[\'46\'].realdata',
                    type: 'number',
                    width: '*',
                    minWidth: 120,
                    headerCellClass: 'text-right',
                    cellClass: 'text-right',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.realData=row.entity;row.entity.currentchannelid=\'46\'" ng-bind="COL_FIELD"></a></div>'
                }, {
                    displayName: '状态',
                    name: 'channels[\'46\'].status',
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
                    displayName: '控制',
                    name: 'status_switch3',
                    minWidth: 100,
                    enableSorting: false,
                    enableColumnMenu: false,
                    headerCellTemplate: '<div class="ui-grid-cell-contents" style="height:40px;" ng-if="!grid.appScope.$ctrl.itemSelected">开关</div><div class="ui-grid-cell-contents" style="height:40px;" ng-if="grid.appScope.$ctrl.itemSelected"><button class="btn btn-xs btn-info ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOn,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关"">开</button><button class="btn btn-xs btn-danger ml5" ng-click="grid.appScope.$ctrl.confirmControl(grid.appScope.$ctrl.batchControl.turnOff,\'EMC_SWITCH\',\'switch\',\'mode\')">关</button></div>',
                    cellTemplate: '<div class="ui-grid-cell-contents"><switch class="bootstrap-switch-square mt3" state="row.entity.status.switch" state-on="EMC_ON" state-off="EMC_OFF" disabled="!row.entity.command.EMC_SWITCH" on-switch="grid.appScope.$ctrl.confirmControl(row,\'EMC_SWITCH\',\'switch\',\'mode\')" data-on-text="开" data-off-text="关" data-on-color="primary"></switch></div>'
                }, {
                    displayName: '通讯时间',
                    name: 'channels[\'46\'].lastupdate',
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
                }];
            } else if (self.deviceType.selected.id === 'TEMPHUMMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnTEMPHUMMETER;
            } else if (self.deviceType.selected.id === 'ZTYPETEMPCONTROL') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnZTYPETEMPCONTROL;
            } else if (self.deviceType.selected.id === 'GASMETER') {
                self.gridOptions.rowHeight = 45;
                self.gridOptions.columnDefs = monitorColumnGASMETER;
            }
        };
        //设备接口
        projectId && $api.device.type({
            project: projectId
        }, function (data) {
            // TODO:解决ui-grid headerCellTemplate bug
            self.deviceType = [];
            angular.forEach(data.result, function (type) {
                if (type.id === 'ENERGYMETER' || type.id === 'TEMPERATURECONTROL' || type.id === 'TIMERMETER') {
                    self.deviceType.push(type);
                }
            });
            angular.forEach(data.result, function (type) {
                if (type.id !== 'ENERGYMETER' && type.id !== 'TEMPERATURECONTROL' && type.id !== 'TIMERMETER') {
                    self.deviceType.push(type);
                }
            });
            self.deviceType.length && (self.deviceType.select = function (item) {
                delete self.multiCheck.all;
                self.deviceType.selected = item;
                self.list();
            })(self.deviceType[0]);
        });
        if (projectId) {

            $scope.$watch('$ctrl.customerSelected', function () {

                self.deviceType && self.list();
            });

        } else {
            $timeout(function () {
                self.list();
            });
        }

        //获取能耗列表信息
        self.list = function (loadMore) {

            !loadMore ? self.itemSelected = false : '';
            if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
                return;
            }
            if ($rootScope.User.data.groupmode) {
                !self.gridOptions.data.length && $api.business.projectdetail({
                    time: moment(self.date).format('YYYYMM'),
                    project: $rootScope.Project.ids,
                    level: self.level || undefined
                }, function (data) {
                    angular.forEach(data = data.result, function (item, id) {
                        item.id = id;
                        this.push(item);
                    }, data = []);
                    self.gridOptions.data = data;
                });
            } else {
                if (self.deviceType && self.deviceType.selected) {
                    if (self._listRequest && self._listRequest.$cancelRequest && !self._listRequest.$resolved) {
                        self._listRequest.$cancelRequest();
                    }
                    self._listRequest = $api.business.monitor({
                        devicetype: self.deviceType.selected.id,
                        project: projectId,
                        key: self.searchKey,
                        ext: {
                            enableMask: 1
                        },
                        mode: 'SENSOR',
                        usesocity: self.customerSelected ? 1 : undefined,
                        socitynode: self.customerSelected,
                        showexception: self.showException && 1 || undefined,
                        pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
                        pagesize: 50
                    }, function (data) {
                        data = data.result[projectId] || {};
                        data.detail.length && (self.itemLength = data.paging.count);
                        angular.forEach(data.detail, function (item) {
                            if (self.deviceType.selected.id === 'TEMPERATURECONTROL' || self.deviceType.selected.id === 'ZTYPETEMPCONTROL') {
                                item.status.temperature = item.status.temperature || item.channels['37'] && item.channels['37'].lasttotal;
                            }
                            angular.forEach(item.command, function (cmd) {
                                item.command[cmd] = cmd;
                            });
                            if (self.deviceType.selected.id === 'ENERGYMETER' || self.deviceType.selected.id === 'HEATENERGYMETER' || self.deviceType.selected.id === 'TIMERMETER') {
                                if (item.channels['07'] && item.channels['07'].status == 0) {
                                    item.reportStatus = 0;
                                    item.lastupdate = item.channels['07'].lastupdate;
                                    if (!item.channels['08']) {
                                        item.noheat = true;
                                    }
                                } else if (item.channels['08'] && item.channels['08'].status == 0) {
                                    item.reportStatus = 0;
                                    item.lastupdate = item.channels['08'].lastupdate;
                                    if (!item.channels['07']) {
                                        item.nocold = true;
                                    }
                                } else {
                                    if (item.channels['07'] && !item.channels['08']) {
                                        item.noheat = true;
                                        item.reportStatus = item.channels['07'].status;
                                        item.lastupdate = item.channels['07'].lastupdate;
                                    } else if (!item.channels['07'] && item.channels['08']) {
                                        item.nocold = true;
                                        item.reportStatus = item.channels['08'].status;
                                        item.lastupdate = item.channels['08'].lastupdate;
                                    } else if (item.channels['07'] && item.channels['08']) {
                                        if (item.channels['07'].lastupdate > item.channels['08'].lastupdate) {
                                            item.reportStatus = item.channels['07'].status;
                                            item.lastupdate = item.channels['07'].lastupdate;
                                        } else {
                                            item.reportStatus = item.channels['08'].status;
                                            item.lastupdate = item.channels['08'].lastupdate;
                                        }
                                    } else if (!item.channels['07'] && !item.channels['08']) {
                                        item.nocold = true;
                                        item.noheat = true;
                                    }

                                }
                            }
                            if (self.deviceType.selected.id === 'TEMPHUMMETER') {
                                if (item.channels['49'] && item.channels['49'].status == 0) {
                                    item.reportStatus = item.channels['49'].status;
                                    item.lastupdate = item.channels['49'].lastupdate;
                                } else if (item.channels['48'] && item.channels['48'].status == 0) {
                                    item.reportStatus = item.channels['48'].status;
                                    item.lastupdate = item.channels['48'].lastupdate;
                                } else {
                                    item.reportStatus = item.channels['48'].status;
                                }
                            }
                            if (self.deviceType.selected.id === 'PRESSUREMETER') {
                                if (item.channels['50']) {
                                    item.reportStatus = item.channels['50'].status;
                                    item.lastupdate = item.channels['50'].lastupdate;
                                } else {
                                    item.reportStatus = item.channels['10'].status;
                                    item.lastupdate = item.channels['10'].lastupdate;
                                }
                            }
                        });
                        if (loadMore) {
                            self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
                        } else {
                            self.gridOptions.data = data.detail || [];
                            self.columnDefsData();
                            self.gridOptions.data.length && $timeout(function () {
                                self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                            });
                        }
                        self.curveChannels = {};
                        angular.forEach(data.detail[0].channels, function (value, key) {
                            data.detail[0].channels[key].persist && (self.curveChannels[key] = value);
                        });
                        self.gridOptions.paging = data.paging;
                        self.multiCheck.all && $timeout(function () {
                            self.multiCheck('all');
                        });
                        self.columnDefsData();
                        return data;
                    });
                    return self._listRequest.$promise;
                }
            }
        };
        $scope.$watch('$ctrl.customerSelected', function () {
            self.list();
        });

        // 开关操作
        self.confirmControl = function (item, cmdKey, statusKey, paramKey) {

            var Ids = multiIds(item, cmdKey, statusKey),
                param = {};
            item.entity && (param[paramKey] = item.entity.status[statusKey]);
            SweetAlert.swal({
                title: '控制校验',
                input: 'password',
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                inputPlaceholder: '控制密码',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                preConfirm: function (value) {
                    var deferred = $q.defer();
                    value ? $api.control.send({
                        id: item.entity && item.entity.id && item.entity.id || Ids,
                        project: projectId,
                        command: cmdKey,
                        param: param,
                        ctrlcode: (new Hashes.SHA1).hex(value).toUpperCase()
                    }, function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data.message);
                    }) : deferred.reject('请输入控制密码');
                    return deferred.promise;
                }
            }).then(function () {
                SweetAlert.close();
            }, function () {
                multiIds(Ids, cmdKey, statusKey);
            });
        };

        // 温度控制，风速控制，模式控制
        self.multiControl = function (item, cmdKey, statusKey, paramKey) {
            var Ids = multiIds(item, cmdKey, statusKey),
                param = {};
            param[paramKey] = item.entity.status[statusKey];
            $api.control.send({
                id: Ids,
                project: projectId,
                command: cmdKey,
                param: param
            }, function () {}, function (data) {
                multiIds(Ids, cmdKey, statusKey);
                SweetAlert.error('操作失败', data.message);
            });
        };
        //发送命令
        self.commandSend = function (item) {
            self.selectedItem = [];
            !item && angular.forEach(self.gridApi.grid.rows, function (row) {
                if (row.isSelected && row.entity.command !== []) {
                    self.selectedItem.push(row.entity.id);
                }
            });
            if (item && item.entity.command !== []) {
                self.selectedItem = item.entity.id;
            }
        };
    }
});

angular.module('app').component('controlSlider', {
    templateUrl: 'app/modules/monitor/slider.html',
    bindings: {
        value: '=',
        disabled: '<',
        onSlider: '&'
    },
    controller: function ($scope, $element) {
        var self = this,
            uiSlider = $element.children('.ui-slider'),
            options = angular.extend({
                min: 15,
                max: 30,
                // value: 16,
                orientation: 'horizontal',
                range: 'min'
            }, $element.data()),
            toggle,
            valueChange = false,
            slidechange = function (event, ui) {
                if (self.value !== ui.value) {
                    valueChange = true;
                    toggle = self.value;
                    self.value = ui.value;
                }
            },
            slide = function (event, ui) {
                self.uivalue = ui.value;
                $scope.$apply();
            };

        uiSlider.slider(options);
        angular.isDefined(options.disabled) && uiSlider.slider('option', 'disabled', !!options.disabled);

        $scope.$watch('$ctrl.value', function (value) {
            if (valueChange) {
                valueChange = false;
                self.onSlider();
            } else if (angular.isUndefined(value) && angular.isDefined(toggle)) {
                self.value = toggle;
                self.uivalue = toggle;
                toggle = undefined;
            } else {
                if (angular.isDefined(value) && (value > options.max)) {
                    value = Math.ceil(value % options.max);
                }
                self.uivalue = value || 20;
                var disabled = uiSlider.slider('option', 'disabled');
                disabled && uiSlider.slider('option', 'disabled', false);
                uiSlider.off('slide');
                uiSlider.off('slidechange');
                uiSlider.slider('option', 'value', self.uivalue);
                uiSlider.on('slide', slide);
                uiSlider.on('slidechange', slidechange);
                disabled && uiSlider.slider('option', 'disabled', true);
            }
        });
        self.$onChanges = function (change) {
            angular.isUndefined(options.disabled) && uiSlider.slider('option', 'disabled', !!change.disabled.currentValue);
        };

    }
});
angular.module('app').component('controlsliderZ', {
    templateUrl: 'app/modules/monitor/slider-z.html',
    bindings: {
        value: '=',
        disabled: '<',
        onSlider: '&'
    },
    controller: function ($scope, $element) {
        var self = this,
            uiSlider = $element.children('.ui-slider'),
            options = angular.extend({
                min: 15,
                max: 40,
                // value: 16,
                orientation: 'horizontal',
                range: 'min'
            }, $element.data()),
            toggle,
            valueChange = false,
            slidechange = function (event, ui) {
                if (self.value !== ui.value) {
                    valueChange = true;
                    toggle = self.value;
                    self.value = ui.value;
                }
            },
            slide = function (event, ui) {
                self.uivalue = ui.value;
                $scope.$apply();
            };

        uiSlider.slider(options);
        angular.isDefined(options.disabled) && uiSlider.slider('option', 'disabled', !!options.disabled);

        $scope.$watch('$ctrl.value', function (value) {
            if (valueChange) {
                valueChange = false;
                self.onSlider();
            } else if (angular.isUndefined(value) && angular.isDefined(toggle)) {
                self.value = toggle;
                self.uivalue = toggle;
                toggle = undefined;
            } else {
                if (angular.isDefined(value) && (value > options.max)) {
                    value = Math.ceil(value % options.max);
                }
                self.uivalue = value || 20;
                var disabled = uiSlider.slider('option', 'disabled');
                disabled && uiSlider.slider('option', 'disabled', false);
                uiSlider.off('slide');
                uiSlider.off('slidechange');
                uiSlider.slider('option', 'value', self.uivalue);
                uiSlider.on('slide', slide);
                uiSlider.on('slidechange', slidechange);
                disabled && uiSlider.slider('option', 'disabled', true);
            }
        });
        self.$onChanges = function (change) {
            angular.isUndefined(options.disabled) && uiSlider.slider('option', 'disabled', !!change.disabled.currentValue);
        };

    }
});

angular.module('app').component('controlSpeed', {
    template: '<i class="emweb" ng-repeat="(key,val) in $ctrl.items" ng-class="[val,{active:$ctrl.speed===key}]" ng-click="$ctrl.click(key)"></i>',
    bindings: {
        speed: '=',
        disabled: '<',
        onSpeed: '&'
    },
    controller: function ($scope) {

        var self = this,
            speedChange = false,
            toggle;

        // web-speed-auto
        self.items = {
            EMC_LOW: 'web-speed-three',
            EMC_MEDIUM: 'web-speed-four',
            EMC_HIGH: 'web-speed-five'
        };

        self.click = function (key) {
            if (!self.disabled) {
                speedChange = true;
                toggle = self.speed;
                self.speed = key;
            }
        };
        $scope.$watch('$ctrl.speed', function (speed) {
            if (!self.disabled) {
                if (speedChange === true) {
                    speedChange = false;
                    self.onSpeed();
                } else if (angular.isUndefined(speed) && angular.isDefined(toggle)) {
                    self.speed = toggle;
                    toggle = undefined;
                } else {
                    self.speed = speed;
                }
            }
        });

    }
});
angular.module('app').component('controlspeedZ', {
    template: '<i class="emweb" ng-repeat="(key,val) in $ctrl.items" ng-class="[val,{active:$ctrl.speed===key}]" ng-click="$ctrl.click(key)"></i>',
    bindings: {
        speed: '=',
        disabled: '<',
        onSpeed: '&'
    },
    controller: function ($scope) {

        var self = this,
            speedChange = false,
            toggle;

        // web-speed-auto
        self.items = {
            EMC_LOW: 'web-speed-three',
            EMC_MEDIUM: 'web-speed-four',
            EMC_HIGH: 'web-speed-five',
            EMC_AUTO: 'web-speed-auto'
        };

        self.click = function (key) {
            if (!self.disabled) {
                speedChange = true;
                toggle = self.speed;
                self.speed = key;
            }
        };
        $scope.$watch('$ctrl.speed', function (speed) {
            if (!self.disabled) {
                if (speedChange === true) {
                    speedChange = false;
                    self.onSpeed();
                } else if (angular.isUndefined(speed) && angular.isDefined(toggle)) {
                    self.speed = toggle;
                    toggle = undefined;
                } else {
                    self.speed = speed;
                }
            }
        });

    }
});

angular.module('app').component('controlMode', {
    template: '<a href="javascript:void(0)" ng-if="!item.hide" class="btn btn-sm btn-primary" ng-repeat="(key,item) in $ctrl.items" ng-class="{active:$ctrl.mode===key}" ng-click="$ctrl.click(key)"><i class="emweb" ng-class="item.icon"></i>{{item.name}}</a>',
    bindings: {
        mode: '=',
        disabled: '<',
        hide: '<',
        onMode: '&'
    },
    controller: function ($scope) {

        var self = this,
            modeChange = false,
            toggle;

        self.items = {
            EMC_COOLING: {
                icon: 'web-snow',
                name: '制冷',
                hide: false
            },
            EMC_HEATING: {
                icon: 'web-sun',
                name: '制热',
                hide: false
            },
            EMC_DEHUMIDIFYING: {
                icon: 'web-clear-wet',
                name: '除湿',
                hide: false
            },
            EMC_VERTILATING: {
                icon: 'web-ventilation',
                name: '通风',
                hide: false
            }
        };
        self.$onInit = function () {
            if (self.hide && self.hide.length) {
                angular.forEach(self.hide, function (hide) {
                    self.items[hide].hide = true;
                });
            }
        };

        self.click = function (key) {
            if (!self.disabled) {
                modeChange = true;
                toggle = self.mode;
                self.mode = key;
            }
        };
        $scope.$watch('$ctrl.mode', function (mode) {
            if (!self.disabled) {
                if (modeChange === true) {
                    modeChange = false;
                    self.onMode();
                } else if (angular.isUndefined(mode) && angular.isDefined(toggle)) {
                    self.mode = toggle;
                    toggle = undefined;
                } else {
                    self.mode = mode;
                }
            }
        });

    }
});

angular.module('app').component('controlCommand', {
    templateUrl: 'app/modules/monitor/command.html',
    bindings: {
        selected: '='
    },
    controller: function ($scope, $element, $api, SweetAlert, $timeout) {

        var self = this,
            $modal = $element.children('.modal'),
            $form;

        $scope.$watch('$ctrl.selected', function (selected) {
            if (selected) {
                self.formData = {
                    sensorid: selected
                };
                $modal.modal('show');
                $form = $scope.form;
            }
        });
        // self.meterData = [{
        //     title: '中央空调热量表 ACM',
        //     id: '20H'
        // }, {
        //     title: '超声波热量表 UHM',
        //     id: '28H'
        // }, {
        //     title: '阀控超声波表',
        //     id: '29H'
        // }, {
        //     title: 'SRT 系列冷量分配表',
        //     id: '86H'
        // }];
        self.submit = function () {
            // if (!self.meterData.selected) {
            //     SweetAlert.warning('请选择控制码');
            // } else {
            // self.formData.command = self.meterData.selected.id;

            if (self.sendRequest && self.sendRequest.$cancelRequest && !self.sendRequest.$resolved) {
                self.sendRequest.$cancelRequest();
            }
            self.sendRequest = $api.control.through(self.formData, function () {
                SweetAlert.success('发送成功');
            }, function (data) {
                //错误代码提示
                data.message = {
                    60000001: '请配置驱动',
                    60000002: '仪表对应的串口参数未配置',
                    60000003: '仪表返回超时'
                }[data.code] || data.message;
                data.message && SweetAlert.warning.apply(SweetAlert, angular.isArray(data.message) ? data.message : [data.message]);
                delete self.sendRequest;
            });
            $timeout(self.sendRequest && self.sendRequest.$cancelRequest, 31000);
            // }
        };


        self.$onDestroy = function () {
            if (self.sendRequest && self.sendRequest.$cancelRequest && !self.sendRequest.$resolved) {
                self.sendRequest.$cancelRequest();
            }
        };

        self.reset = function () {
            delete self.formData.command;
            delete self.formData.data;
        };

        $modal.on('hidden.bs.modal', function () {
            delete self.selected;
            delete self.formData;
            $form.$setPristine();
            $scope.$apply();
            return false;
        });
        $modal.find('input[name=command]').on('invalid', function () {
            $form.command.$setDirty();
            $scope.$apply();
            return false;
        });
        $modal.find('input[name=data]').on('invalid', function () {
            $form.data.$setDirty();
            $scope.$apply();
            return false;
        });

    }
});

angular.module('app').component('channeldetail', {
    templateUrl: 'app/modules/monitor/channedetail.html',
    bindings: {
        curve: '=',
        channels: '<'
    },
    controller: function ($scope, $element, $api, $timeout) {

        var self = this,
            modalCurve = $element.find('.modal-curve');

        //modal事件操作
        modalCurve.on('shown.bs.modal', function () {
            $timeout(self.buildLine);
        }).on('hidden.bs.modal', function () {
            delete self.curve;
            delete self.timeline;
        });

        $scope.$watch('$ctrl.curve', function (curve) {
            curve && self.channeldetail(curve);
        });

        //日期初始值
        self.date = moment().format('YYYY-MM-DD');

        //年月日切换
        self.timetype = {
            DAY: '日',
            WEEK: '周',
            MONTH: '月',
            YEAR: '年'
        };
        self.timetype_current = 'DAY';
        self.timetypeChange = function (key) {
            self.timetype_current = key;
            $element.find('.modal-curve input[datetimepicker]').data('DateTimePicker').format({
                DAY: 'YYYY-MM-DD',
                WEEK: 'YYYY-MM-DD',
                MONTH: 'YYYY-MM',
                YEAR: 'YYYY'
            }[key]).viewMode({
                DAY: 'days',
                WEEK: 'days',
                MONTH: 'months',
                YEAR: 'years'
            }[key]).defaultDate(self.date);
            self.channeldetail();
        };

        //获取曲线图信息
        self.channeldetail = function (item) {
            item && (self.currentchannelid = item.currentchannelid);
            self.curve = item || self.curve || {};
            self.curve.type = self.curve.type || 'diff';
            self.curve.categories = [];
            self.curve.diff = [];
            self.curve.scale = [];
            self.curve.enable = false;
            self.channelID = [];
            self.charttype = 'spline';
            for (var x in self.curve.channels) {
                self.channelID.push(x);
            }
            self.curve.channels[self.currentchannelid] && $api.business.channeldetail({
                id: self.curve.channels[self.currentchannelid].id,
                timeformat: self.timetype_current,
                from: self.date.replace(/-/g, ''),
                to: self.date.replace(/-/g, '')
            }, function (data) {
                if (data.result) {
                    angular.forEach(data.result.detail, function (item) {
                        self.curve.categories.push(item.timepoint);
                        self.curve.diff.push(item.value);
                        self.curve.scale.push(item.total);
                    });

                    self.curve.enable = true;
                    self.curve.start = data.result.start;
                    self.curve.unit = data.result.unit;

                    modalCurve.hasClass('in') ? self.buildLine() : modalCurve.modal('show');
                }
            });

        };

        //差值与刻度切换
        self.lineType = function (val) {
            self.curve.type = val;
            self.buildLine();
        };
        self.typeChange = function (type) {
            self.charttype = type;
            self.buildLine();
        };
        //构建图表
        self.buildLine = function () {
            if (self.curve.enable) {
                self.timeline = {
                    chart: {
                        type: self.charttype
                    },
                    title: false,
                    xAxis: {
                        type: 'datetime',
                        categories: self.curve.categories,
                        labels: {
                            formatter: function () {
                                return moment(this.value).format({
                                    DAY: 'H',
                                    WEEK: 'M-DD',
                                    MONTH: 'M-DD',
                                    YEAR: 'YYYY-MM'
                                }[self.timetype_current]);
                            }
                        }
                    },
                    yAxis: {
                        title: false
                    },
                    tooltip: {
                        xDateFormat: '%m月%d日',
                        pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y:.2f} ' + self.curve.unit + '</span>'
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.2f}' + self.curve.unit
                            }
                        }
                    },
                    series: [{
                        name: self.curve.title,
                        data: self.curve[self.curve.type]
                    }]
                };

            }
        };

    }
});