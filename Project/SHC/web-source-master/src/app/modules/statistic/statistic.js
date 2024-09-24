/*global angular*/
'use strict';
angular.module('app').component('statistic', {
    templateUrl: 'app/modules/statistic/statistic.html',
    controller: function ($rootScope, $window, $templateCache, $q, $api, $filter, $timeout, $stateParams, uiGridConstants, i18nService, $scope) {

        var self = this,
            projectId = $rootScope.Project.current && $rootScope.Project.current._id,
            KEY = 'departmenttitle_' + $rootScope.User.data.uid + projectId,
            data = {
                project: []
            };

        angular.forEach($rootScope.Project, function (item) {
            data.project.push({
                id: item._id
            });
        });

        i18nService.add('zh-cn', {
            aggregation: {
                sum: '合计：'
            }
        });

        self.gridOptions = {
            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                self.departmentreport && $timeout(function () {
                    gridApi.grouping && gridApi.grouping.clearGrouping();
                    gridApi.grouping && gridApi.grouping.groupColumn('title');
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                });
            },
            enableColumnMenus: false,
            enableRowSelection: false,
            enableGroupHeaderSelection: false,
            enableRowHeaderSelection: false,
            enableSorting: true,
            rowHeight: 34,
            enableColumnResizing: true,
            exporterOlderExcelCompatibility: true,
            // exporterHeaderFilter: function (displayName) {
            //     if (displayName === '能耗总值') {
            //         return displayName + '(合计：' + Math.round(self.gridApi.grid.columns[4].getAggregationValue() * 100) / 100 + ')';
            //     }
            //     if (displayName === '费用') {
            //         return displayName + '(合计：' + Math.round(self.gridApi.grid.columns[7].getAggregationValue() * 100) / 100 + ')';
            //     }
            //     return displayName;
            // },
            exporterFieldCallback: function (grid, row, col, value) {
                return {
                    name: true,
                    'id.substr(12,12)': true,
                    'channeldid.substr(12,12)': true
                }[col.field] ? '="' + (value || '') + '"' : value;
            },
            showColumnFooter: true,
            treeRowHeaderAlwaysVisible: true
        };

        self.tabClick = function (tabKey) { //获取tabKey也就是对应的接口参数
            self.startDate = function () {
                if (tabKey === 'dailyreport') {
                    return moment().format('YYYY-MM-DD');
                } else {
                    return moment().subtract(30, 'days').format('YYYY-MM-DD');
                }
            }();
            self.endDate = moment().format('YYYY-MM-DD');
            self.rangeDay = {
                settlereport: 183,
                monthlyreport: 31
            }[tabKey] || 0;
            self.tabActive = tabKey;
            self.report(tabKey);
        };


        self.report = function (tabKey) {
            var billingservice = self.billingserviceData && self.billingserviceData.selected && self.billingserviceData.selected.id;
            // headerCellTemplate = $templateCache.get('ui-grid/uiGridHeaderCell');
            data.project && (data.project = []);
            angular.forEach($rootScope.Project, function (item) {
                data.project.push({
                    id: item._id,
                    devicetype: billingservice || undefined
                });
            });
            // $api.business.departmentreport(data, function () {
            //     self.departmenttitle = true;
            // }, function () {
            //     self.departmenttitle = false;
            // }).$promise.then(function () {
            //     self.tabs = $rootScope.User.data.groupmode ? {
            //         projectreport: '项目总用能'
            //     } : self.departmenttitle ? {
            //         settlereport: '结算报表',
            //         monthlyreport: '月报表',
            //         dailyreport: '日报表',
            //         departmentreport: '商户报表'
            //     } : {
            //         settlereport: '结算报表',
            //         monthlyreport: '月报表',
            //         dailyreport: '日报表'
            //     };
            // }, function () {
            //     self.tabs = $rootScope.User.data.groupmode ? {
            //         projectreport: '项目总用能'
            //     } : self.departmenttitle ? {
            //         settlereport: '结算报表',
            //         monthlyreport: '月报表',
            //         dailyreport: '日报表',
            //         departmentreport: '商户报表'
            //     } : {
            //         settlereport: '结算报表',
            //         monthlyreport: '月报表',
            //         dailyreport: '日报表'
            //     };
            // });
            switch (tabKey) {
                case 'settlereport':
                case 'monthlyreport':
                case 'projectreport':
                    data.from = self.startDate.replace(/\-/g, '');
                    data.to = self.endDate.replace(/\-/g, '');
                    break;
                case 'dailyreport':
                    data.time = self.startDate.replace(/\-/g, '');
                    break;
                case 'departmentreport':
                    data.from = self.startDate.replace(/\-/g, '');
                    data.to = self.endDate.replace(/\-/g, '');
                    break;

            }

            switch (tabKey) {
                case 'settlereport':
                    self.gridOptions.columnDefs = [{
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
                        cellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                    }, {
                        displayName: '智能仪表名称',
                        name: 'name',
                        width: '*',
                        pinnedLeft: true,
                        minWidth: 200
                    }, {
                        displayName: '仪表类型',
                        name: 'devicetype',
                        width: '*',
                        minWidth: 80
                    }, {
                        displayName: '通道名称',
                        name: 'channelname',
                        width: '*',
                        minWidth: 80
                    },
                    {
                        displayName: moment(self.startDate).format('YYYY年M月D日'),
                        name: 'min',
                        type: 'number',
                        width: '*',
                        minWidth: 140,
                        cellClass: 'text-right',
                        headerCellClass: 'text-right'
                    }, {
                        displayName: moment(self.endDate).format('YYYY年M月D日'),
                        name: 'max',
                        type: 'number',
                        width: '*',
                        minWidth: 140,
                        cellClass: 'text-right',
                        headerCellClass: 'text-right'
                    }, {
                        displayName: '能耗总值',
                        name: 'sum',
                        type: 'number',
                        width: '*',
                        minWidth: 130,
                        cellClass: 'text-right',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        filters: [{
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: '大于'
                        }, {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: '小于'
                        }],
                        headerCellClass: 'text-right grid-cell-50',
                        footerCellFilter: 'number:2'
                    }, {
                        displayName: '单价',
                        name: 'price',
                        type: 'number',
                        width: '*',
                        minWidth: 100,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '倍率系数',
                        name: 'comi',
                        type: 'number',
                        width: '*',
                        minWidth: 100,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '费用',
                        name: 'cost',
                        type: 'number',
                        width: '*',
                        minWidth: 130,
                        cellClass: 'text-right',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        filters: [{
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: '大于'
                        }, {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: '小于'
                        }],
                        headerCellClass: 'text-right grid-cell-50',
                        footerCellFilter: 'number:2'
                    }
                    ];
                    break;
                case 'monthlyreport':
                    self.gridOptions.columnDefs = [{
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
                        cellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                    }, {
                        displayName: '智能仪表名称',
                        name: 'name',
                        width: '*',
                        pinnedLeft: true,
                        minWidth: 180
                    }, {
                        displayName: '仪表类型',
                        name: 'devicetype',
                        width: '*',
                        minWidth: 80
                    }, {
                        displayName: '通道名称',
                        name: 'channelname',
                        width: '*',
                        minWidth: 80
                    }, {
                        displayName: '月能耗',
                        type: 'number',
                        name: 'monthlySum',
                        width: '*',
                        minWidth: 70,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '日平均',
                        type: 'number',
                        name: 'dailyAvg',
                        width: '*',
                        minWidth: 70,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }];
                    break;
                case 'dailyreport':
                    self.gridOptions.columnDefs = [{
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
                        cellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                    }, {
                        displayName: '智能仪表名称',
                        name: 'name',
                        width: '*',
                        pinnedLeft: true,
                        minWidth: 200
                    }, {
                        displayName: '仪表类型',
                        name: 'devicetype',
                        width: '*',
                        minWidth: 80
                    }, {
                        displayName: '通道名称',
                        name: 'channelname',
                        width: '*',
                        minWidth: 80
                    }, {
                        displayName: '日能耗',
                        type: 'number',
                        name: 'dailysum',
                        width: '*',
                        minWidth: 70,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }];
                    break;

                case 'projectreport':
                    self.gridOptions.columnDefs = [{
                        displayName: '',
                        name: '$index',
                        type: 'number',
                        width: 50,
                        minWidth: 50,
                        enableColumnMenu: false,
                        exporterSuppressExport: true,
                        headerCellClass: 'text-center',
                        headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                        cellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                    }, {
                        displayName: '项目名称',
                        name: 'name',
                        width: '*',
                        minWidth: 260
                    }, {
                        displayName: '总用能',
                        type: 'number',
                        name: 'consumption',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '总费用',
                        type: 'number',
                        name: 'cost',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '单位用能',
                        type: 'number',
                        name: 'uaec',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '单位电能',
                        type: 'number',
                        name: 'uaeec',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }];
                    break;
                case 'departmentreport':
                    self.gridOptions.columnDefs = [{
                        //     displayName: '',
                        //     name: '$index',
                        //     type: 'number',
                        //     width: 50,
                        //     minWidth: 50,
                        //     enableColumnMenu: false,
                        //     exporterSuppressExport: true,
                        //     headerCellClass: 'text-center',
                        //     headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                        //     cellClass: 'text-center',
                        //     cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                        // }, {
                        displayName: '商户名称',
                        name: 'title',
                        width: '*',
                        minWidth: 260,
                        grouping: {
                            groupPriority: 0
                        },
                        sort: {
                            priority: 0
                        }
                    }, {
                        displayName: '智能仪表名称',
                        type: 'number',
                        name: 'sensor.title',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '期初读数',
                        type: 'number',
                        name: 'sensor.from',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: ' 期末读数',
                        type: 'number',
                        name: 'sensor.to',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '用量',
                        type: 'number',
                        name: 'sensor.usage',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '单价',
                        type: 'number',
                        name: 'sensor.price',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                    }, {
                        displayName: '费用',
                        type: 'number',
                        name: 'sensor.cost',
                        width: '*',
                        minWidth: 160,
                        headerCellClass: 'text-right',
                        cellClass: 'text-right'
                        // treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
                        // customTreeAggregationFinalizerFn: function (aggregation) {
                        //     aggregation.rendered = Math.floor(aggregation.sum * 10000) / 10000 || '-';
                        // }
                    }];
                    break;
            }
            $api.business[tabKey](data, function (data) {
                sessionStorage[KEY] && self.gridOptions.columnDefs.push({
                    displayName: '商户名称',
                    name: 'departmenttitle',
                    width: '*',
                    minWidth: 200
                });
                switch (tabKey) {
                    case 'departmentreport':
                        data = data.result[projectId] || {};
                        self.statistic = data.statistic || {};
                        data = data.detail || [];
                        self.group = [];
                        angular.forEach(data, function (sensor) {
                            if (!sensor.sensors.length) {
                                self.group.push(sensor);
                            } else {
                                angular.forEach(sensor.sensors, function (s, index) {
                                    var sensorCopy = {};
                                    angular.copy(sensor, sensorCopy);
                                    sensorCopy.sensor = s;
                                    self.group.push(sensorCopy);
                                });
                            }
                        });
                        data = self.group;
                        $timeout(function () {
                            self.gridApi.treeBase.expandAllRows();
                        }, 1000);
                        break;

                    case 'settlereport':
                        data = data.result[projectId] || {};
                        self.statistic = data.statistic || {};
                        data = data.detail || [];
                        self.gridOptions.columnDefs.unshift({
                            displayName: '设备ID',
                            name: 'id.substr(12,12)',
                            type: 'number',
                            width: '*',
                            minWidth: 120
                        });
                        self.gridOptions.columnDefs.push({
                            //     displayName: '设备编号',
                            //     name: 'gatewayid',
                            //     width: '*',
                            //     minWidth: 100
                            // }, {
                            displayName: '设备编码',
                            name: 'tag',
                            width: '*',
                            minWidth: 160,
                            enableColumnMenu: false
                        }, {
                            displayName: '能耗分类',
                            name: 'energy',
                            width: '*',
                            minWidth: 100
                        });
                        break;
                    case 'monthlyreport':

                        data = data.result[projectId] || [];
                        if (data.length) {
                            angular.forEach(data[0].usage, function (val, key) {
                                this.push({
                                    displayName: $filter('date')(key, 'M-d'),
                                    name: 'day' + $filter('date')(key, 'yyyyMMdd'),
                                    width: '*',
                                    minWidth: 60,
                                    headerCellClass: 'text-right',
                                    cellClass: 'text-right'
                                });
                            }, self.gridOptions.columnDefs);
                            self.gridOptions.columnDefs.unshift({
                                displayName: '设备ID',
                                type: 'number',
                                name: 'channeldid.substr(12,12)',
                                width: '*',
                                minWidth: 120
                            });
                            self.gridOptions.columnDefs.push({
                                //     displayName: '设备编号',
                                //     name: 'gatewayid',
                                //     width: '*',
                                //     minWidth: 100
                                // }, {
                                displayName: '设备编码',
                                name: 'tag',
                                width: '*',
                                minWidth: 160,
                                enableColumnMenu: false
                            }, {
                                displayName: '能耗分类',
                                name: 'energy',
                                width: '*',
                                minWidth: 100
                            });
                        }
                        break;
                    case 'dailyreport':
                        data = data.result[projectId] || [];
                        if (data.length) {
                            angular.forEach(data[0].usage, function (val, key) {
                                key = $filter('date')(key, 'H');
                                this.push({
                                    displayName: key + '时',
                                    name: 'hour' + key,
                                    width: '*',
                                    minWidth: 50,
                                    headerCellClass: 'text-right',
                                    cellClass: 'text-right'
                                });
                            }, self.gridOptions.columnDefs);
                        }
                        self.gridOptions.columnDefs.unshift({
                            displayName: '设备ID',
                            type: 'number',
                            name: 'channeldid.substr(12,12)',
                            width: '*',
                            minWidth: 120
                        });
                        self.gridOptions.columnDefs.push({
                            //     displayName: '设备编号',
                            //     name: 'gatewayid',
                            //     width: '*',
                            //     minWidth: 100
                            // }, {
                            displayName: '设备编码',
                            name: 'tag',
                            width: '*',
                            minWidth: 160,
                            enableColumnMenu: false
                        }, {
                            displayName: '能耗分类',
                            name: 'energy',
                            width: '*',
                            minWidth: 100
                        });
                        break;
                    case 'projectreport':
                        angular.forEach(data.result, function (items) {
                            angular.forEach(items, function (val, key) {
                                items[key] = key === 'name' ? val : (Math.round(val * 100) / 100);
                            });
                            this.push(items);
                        }, data = []);
                        break;
                }
                self.rebuildData(data);
            });

        };

        if (!$rootScope.User.data.groupmode) {
            // $api.energy.info({
            //     project: $rootScope.Project.ids
            // }, function (data) {
            //     // angular.forEach(data.result.energy || {}, function (item) {
            //     //     this.push(item);
            //     // }, self.energyData = []);
            // });
            $api.device.type({
                project: $rootScope.Project.ids
            }, function (data) {
                angular.forEach(data.result || {}, function (item) {
                    this.push(item);
                }, self.billingserviceData = []);
            });

            var promise = $q.defer();

            if (sessionStorage[KEY]) {
                promise.resolve();
                promise = promise.promise;
            } else {
                promise = $api.business.departmentreport({
                    project: [{
                        check: true,
                        id: projectId
                    }]
                }, function (data) {
                    data = data.result[projectId];
                    if (data > 0) {
                        sessionStorage[KEY] = true;
                    } else {
                        sessionStorage[KEY] = false;
                    }
                    angular.element($window).on('beforeunload', function () {
                        delete sessionStorage[KEY];
                    });
                }).$promise;
            }

            promise.then(function () {}).finally(function () {
                self.tabs = sessionStorage[KEY] == 'true' ? {
                    settlereport: '结算报表',
                    monthlyreport: '月报表',
                    dailyreport: '日报表',
                    departmentreport: '商户报表'
                } : {
                    settlereport: '结算报表',
                    monthlyreport: '月报表',
                    dailyreport: '日报表'
                };
                self.tabClick($stateParams.tab || 'settlereport');
            });
        } else {
            self.tabs = {
                projectreport: '项目总用能'
            };
            self.tabClick('projectreport');
        }

        self.filter = function () {
            self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
            self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        self.export = function () {
            switch (self.tabActive) {
                case 'settlereport':
                case 'monthlyreport':
                case 'projectreport':
                    self.gridOptions.exporterCsvFilename = document.title + '_统计_' + self.tabs[self.tabActive] + '_' + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '') + '.csv';
                    break;
                case 'dailyreport':
                    self.gridOptions.exporterCsvFilename = document.title + '_统计_' + self.tabs[self.tabActive] + '_' + self.startDate.replace(/\-/g, '') + '.csv';
                    break;
                case 'departmentreport':
                    self.gridOptions.exporterCsvFilename = document.title + '_统计_' + self.tabs[self.tabActive] + '_' + self.startDate.replace(/\-/g, '') + '.csv';
                    break;
            }

            self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));

        };

        (self.grid_timetype = function (key) {
            self.grid_timetype_current = key;
            self.rebuildData && self.rebuildData(self.gridOptions.data);
        })('usage');

        self.rebuildData = function (data) {
            // if (self.tabActive === 'settlereport') {
            //     angular.forEach(data, function(item) {
            //         item.min = (Math.round(item.min * 100) / 100);
            //         item.max = (Math.round(item.max * 100) / 100);
            //         item.sum = (Math.round(item.sum * 100) / 100);
            //     })
            // }
            if (self.tabActive === 'monthlyreport') {
                angular.forEach(data, function (item) {
                    item.monthlySum = (Math.round(item.monthlySum * 100) / 100);
                    angular.forEach(item[self.grid_timetype_current], function (val, key) {
                        item['day' + $filter('date')(key, 'yyyyMMdd')] = val;
                    });
                });
            }
            if (self.tabActive === 'dailyreport') {

                angular.forEach(data, function (item) {
                    item.dailysum = (Math.round(item.dailysum * 100) / 100);
                    angular.forEach(item[self.grid_timetype_current], function (val, key) {
                        item['hour' + $filter('date')(key, 'H')] = val;
                    });
                });
            }

            self.gridOptions.data = data;
        };

        $scope.$watch('$ctrl.billingserviceData.selected', function (selected) {
            if (angular.isDefined(selected)) {
                if (!$rootScope.User.data.groupmode) {
                    self.tabClick($stateParams.tab || 'settlereport');
                } else {
                    self.tabClick('projectreport');
                }
            }
        });

        // self.tabClick($rootScope.User.data.groupmode ? 'projectreport' : $stateParams.tab || 'settlereport');
        // $timeout(function () {
        //     $('.ui-grid-viewport').height($('.ui-grid-viewport').height());
        // }, 120);
        return self;
    }
});
angular.module('app').filter('numberToFixed', function () {
    return function (input, val) {
        var multiple = Math.pow(10, val),
            fixed = Math.round(input * multiple) / multiple;
        return fixed;
    };
});