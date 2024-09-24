/*global angular*/
'use strict';
angular.module('app').component('financial', {
    templateUrl: 'app/modules/financial/financial.html',
    controller: function ($scope, $element) {

        var self = this,
            modal = $element.find('.financial-modal');
        self.tabActive = self.tabActive && self.tabActive || 'nearest';

        modal.on('hidden.bs.modal', function () {
            delete self.modal;
            delete self.modalTab;
            delete self.modalTitle;
        });

        self.openModel = function (entity, tab, title) {
            self.modal = entity;
            self.modalTab = tab;
            self.modalTitle = title;
            modal.modal('show');
        };
    }
});

angular.module('app').component('financialMain', {
    templateUrl: 'app/modules/financial/main.html',
    bindings: {
        modal: '<',
        modalTab: '<',
        modalTitle: '<',
        openModel: '<',
        tabActive: '=?'
    },
    controller: function ($rootScope, $templateCache, $stateParams, $scope, $q, $api, $filter, $timeout, uiGridConstants) {

        var self = this,
            nowDate = new Date();
        self.$onChanges = function () {
            self.autoHeight = self.modal && 175 || 15;

            self.action = $stateParams.action;
            self.account = $stateParams.account;

            //tabs - start
            self.tabs = {
                nearest: '最近充值',
                deficit: '欠费商户',
                all: '全部商户'
            };
            self.tabActive = self.modalTab || $stateParams.tab || 'nearest';
            //tabs - end

            //toolbar - start
            //日期选择
            self.fromDate_ID = 'form_' + parseInt(Math.random() * 1000, 10);
            self.toDate_ID = 'to_' + parseInt(Math.random() * 1000, 10);
            self.fromDate = $stateParams.startDate || moment().subtract(30, 'days').format('YYYY-MM-DD');
            self.toDate = $stateParams.endDate || moment().format('YYYY-MM-DD');

            //充值方式
            self.manual = [{
                id: 0,
                title: '所有充值',
                val: undefined
            }, {
                id: 1,
                title: '自助充值',
                val: 0
            }, {
                id: 2,
                title: '人工充值',
                val: 1
            }];
            self.manual.selected = self.manual[0];

            //订单状态
            self.status = [{
                key: undefined,
                title: '所有状态'
            }, {
                key: 'CHECKING',
                title: '等待支付'
            }, {
                key: 'CHECKFAILED',
                title: '支付失败'
            }, {
                key: 'PROCESSING',
                title: '正在处理'
            }, {
                key: 'FAILED',
                title: '处理失败'
            }, {
                key: 'SUCCESS',
                title: '支付完成'
            }];
            self.status.selected = self.status[0];
            angular.forEach(self.status, function (item) {
                this[item.key] = item.title;
            }, self.status);

            //筛选
            self.filter = function () {
                self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
                self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            };

            //导出
            self.export = function () {
                var csvname = [document.title, '财务'];
                if (self.modal) {
                    csvname.push(self.modal.departmentname || self.modal.title || '');
                    csvname.push(self.modalTitle || '');
                } else {
                    csvname.push(self.tabs[self.tabActive] || '');
                }
                if (self.tabActive === 'nearest') {
                    csvname.push(self.fromDate.replace(/-/g, ''));
                    csvname.push(self.toDate.replace(/-/g, ''));
                } else {
                    csvname.push($filter('date')(new Date(), 'yyyyMMdd_HHmmss'));
                }
                self.gridOptions.exporterCsvFilename = csvname.join('_') + '.csv';
                self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
            };
            //toolbar - end

            //催缴欠费
            self.reminder = function (entity) {
                $api.message.remindrecharge({
                    uid: entity.departmentaccount,
                    project: $rootScope.Project.current._id
                }, function () {
                    entity.remindercount += 1;
                });
            };

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
                        }(self.load[self.tabActive](true)));
                        return defer.promise;
                    });

                    self.gridApi = gridApi;

                },
                rowHeight: 34,
                infiniteScrollDown: true,
                enableColumnMenus: false,
                enableColumnResizing: true,
                exporterOlderExcelCompatibility: true,
                // exporterHeaderFilter: function (displayName) {
                //     if (displayName === '充值金额(元)') {
                //         return displayName + '(合计：' + self.statistic.sumOfAmount + ')';
                //     }
                //     if (displayName === '欠费金额(元)') {
                //         return displayName + '(合计：' + self.statistic.sumOfArrears + ')';
                //     }
                //     if (displayName === '商户余额(元)') {
                //         return displayName + '(合计：' + self.statistic.sumOfBalance + ')';
                //     }
                //     return displayName;
                // },
                exporterFieldCallback: function (grid, row, col, value) {
                    return {
                        title: true,
                        account: true,
                        timepaid: true,
                        timecreate: true,
                        departmentname: true,
                        departmentaccount: true,
                        arrearagetime: true,
                        consists: true,
                        timepoint: true
                    }[col.field] ? '="' + (value || '') + '"' : value;
                },
                showColumnFooter: true
            };

            self.load = {
                nearest: function (loadMore) {
                    if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
                        return;
                    }
                    return $api.business.recentchargelog({
                        from: self.fromDate.replace(/-/g, ''),
                        to: self.toDate.replace(/-/g, ''),
                        // status: self.status.selected.key,
                        pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
                        pagesize: 50,
                        project: [{
                            id: $rootScope.Project.current._id,
                            ismanual: self.manual.selected.val,
                            department: self.modal ? (self.modal.departmentaccount || self.modal.account) : undefined
                        }]
                    }, function (data) {
                        data = data.result[$rootScope.Project.current._id] || {};
                        angular.forEach(data.detail, function (item) {
                            item.status = self.status[item.status] || item.status;
                            item.timepaid = item.timepaid && $filter('date')(item.timepaid * 1000, 'yyyy年M月dd日 H:mm:ss') || '';
                            item.timecreate = item.timecreate && $filter('date')(item.timecreate * 1000, 'yyyy年M月dd日 H:mm:ss') || '';
                        });
                        if (loadMore) {
                            self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
                        } else {
                            self.gridOptions.data = data.detail || [];
                            self.gridOptions.data.length && $timeout(function () {
                                self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                            });
                        }
                        self.gridOptions.paging = data.paging;
                        self.statistic = data.statistic;
                        return data;
                    }).$promise;
                },
                deficit: function (loadMore) {
                    return self.load.departments(loadMore);
                },
                all: function (loadMore) {
                    return self.load.departments(loadMore);
                },
                departments: function (loadMore) {
                    if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
                        return;
                    }
                    return $api.business.departments({
                        project: $rootScope.Project.current._id,
                        amount: self.tabActive === 'all' ? undefined : 0,
                        pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
                        pagesize: 50
                    }, function (data) {
                        data = data.result[$rootScope.Project.current._id] || {};
                        angular.forEach(data.detail, function (item) {
                            item.arrearagetime = item.arrearagetime && $filter('date')(item.arrearagetime * 1000, 'yyyy年M月dd日 H:mm:ss') || '';
                        });
                        if (loadMore) {
                            self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
                        } else {
                            self.gridOptions.data = data.detail || [];
                            self.gridOptions.data.length && $timeout(function () {
                                self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                            });
                        }
                        self.gridOptions.paging = data.paging;
                        self.statistic = data.statistic;
                        return data;
                    }).$promise;
                },
                usage: function (loadMore) {
                    if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
                        return;
                    }
                    return $api.business.departmentusage({
                        from: self.fromDate.replace(/-/g, ''),
                        to: self.toDate.replace(/-/g, ''),
                        pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
                        pagesize: 50,
                        project: [{
                            id: $rootScope.Project.current._id,
                            account: self.modal ? (self.modal.departmentaccount || self.modal.account) : undefined
                        }]
                    }, function (data) {
                        data = data.result[$rootScope.Project.current._id] || {};
                        if (loadMore) {
                            self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
                        } else {
                            self.gridOptions.data = data.detail || [];
                            self.gridOptions.data.length && $timeout(function () {
                                self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                            });
                        }
                        angular.forEach(self.gridOptions.data, function (item) {
                            item.timepoint = item.timepoint && $filter('date')(item.timepoint * 1000, 'yyyy年M月dd日 H:mm:ss') || '';
                        });
                        self.gridOptions.paging = data.paging;
                        return data;
                    }).$promise;
                }
            };

            self.tabList = function () {
                var headerCellTemplate = $templateCache.get('ui-grid/uiGridHeaderCell');
                switch (self.tabActive) {
                    case 'nearest':
                        self.gridOptions.columnDefs = [{
                            displayName: '',
                            name: '$index',
                            type: 'number',
                            width: 50,
                            minWidth: 50,
                            enablePinning: false,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                        }, {
                            displayName: '商户名称',
                            name: 'title',
                            width: '*',
                            minWidth: 200,
                            enablePinning: false,
                            enableColumnMenu: false,
                            enableSorting: false,
                            cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.openModel(row.entity,\'nearest\',\'充值记录\')">{{COL_FIELD}}</a></div>'
                        }, {
                            displayName: '商户账号',
                            type: 'number',
                            name: 'account',
                            width: '*',
                            minWidth: 120,
                            enableColumnMenu: false
                        }, {
                            displayName: '联系电话',
                            type: 'number',
                            name: 'mobile',
                            width: '*',
                            minWidth: 100,
                            enableColumnMenu: false
                        }, {
                            displayName: '充值金额(元)',
                            name: 'amount',
                            type: 'number',
                            width: '*',
                            minWidth: 200,
                            // headerCellTemplate: function () {
                            //     return headerCellTemplate.replace('</sub></span></div><div role="button" tabindex="0"', '</sub></span><div class="text-info">合计：{{grid.appScope.$ctrl.statistic.sumOfAmount}}</div></div><div role="button" tabindex="0"');
                            // }
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '大于'
                            }, {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '小于'
                            }],
                            headerCellClass: 'grid-cell-50',
                            footerCellFilter: 'number:2'
                        }, {
                            displayName: '本次余额(元)',
                            name: 'balance',
                            type: 'number',
                            width: '*',
                            minWidth: 120,
                            filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '大于'
                            }, {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '小于'
                            }],
                            headerCellClass: 'grid-cell-50'
                        }, {
                            displayName: '充值方式',
                            name: 'channel',
                            width: '*',
                            minWidth: 120,
                            enableColumnMenu: false
                        }, {
                            displayName: '充值时间',
                            name: 'timepaid',
                            type: 'date',
                            width: '*',
                            minWidth: 200
                        }, {
                            displayName: '操作账号',
                            type: 'number',
                            name: 'operator',
                            width: '*',
                            minWidth: 120,
                            enableColumnMenu: false
                        }, {
                            displayName: '订单状态',
                            name: 'status',
                            width: '*',
                            minWidth: 100,
                            headerCellClass: 'text-center',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'text-danger\':COL_FIELD!==\'支付完成\'}">{{COL_FIELD}}</div>'
                        }, {
                            displayName: '订单时间',
                            name: 'timecreate',
                            type: 'date',
                            width: '*',
                            minWidth: 200,
                            enablePinning: false
                        }];
                        self.modal && self.gridOptions.columnDefs.splice(1, 3);
                        break;
                    case 'deficit':
                        self.gridOptions.rowHeight = 38;
                        self.gridOptions.columnDefs = [{
                            displayName: '',
                            name: '$index',
                            type: 'number',
                            width: 50,
                            minWidth: 50,
                            enablePinning: false,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                        }, {
                            displayName: '商户名称',
                            name: 'departmentname',
                            width: '*',
                            minWidth: 200,
                            enablePinning: false,
                            enableColumnMenu: false
                        }, {
                            displayName: '商户账号',
                            name: 'departmentaccount',
                            width: '*',
                            minWidth: 120,
                            enableColumnMenu: false
                        }, {
                            displayName: '联系电话',
                            type: 'number',
                            name: 'mobile',
                            width: '*',
                            minWidth: 100,
                            enableColumnMenu: false
                        }, {
                            displayName: '欠费金额(元)',
                            type: 'number',
                            name: 'amount',
                            width: '*',
                            minWidth: 200,
                            // headerCellTemplate: function () {
                            //     return headerCellTemplate.replace('</sub></span></div><div role="button" tabindex="0"', '</sub></span><div class="text-info">合计：{{grid.appScope.$ctrl.statistic.sumOfArrears}}</div></div><div role="button" tabindex="0"');
                            // }
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '大于'
                            }, {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '小于'
                            }],
                            headerCellClass: 'grid-cell-50',
                            footerCellFilter: 'number:2'
                        }, {
                            displayName: '欠费时间',
                            name: 'arrearagetime',
                            type: 'date',
                            width: '*',
                            minWidth: 200
                        }, {
                            displayName: '已催次数',
                            type: 'number',
                            name: 'remindercount',
                            width: 100,
                            minWidth: 100
                        }, {
                            displayName: '',
                            name: 'send',
                            width: 100,
                            minWidth: 100,
                            enablePinning: false,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">催缴通知</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" class="btn btn-xs btn-info" ng-click="grid.appScope.$ctrl.reminder(row.entity)">催缴欠费</a></div>'
                        }];
                        break;
                    case 'all':
                        self.gridOptions.columnDefs = [{
                            displayName: '',
                            name: '$index',
                            type: 'number',
                            width: 50,
                            minWidth: 50,
                            enablePinning: false,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                        }, {
                            displayName: '商户名称',
                            name: 'departmentname',
                            width: '*',
                            minWidth: 200,
                            enablePinning: false,
                            enableColumnMenu: false
                        }, {
                            displayName: '商户账号',
                            name: 'departmentaccount',
                            width: '*',
                            minWidth: 120,
                            enableColumnMenu: false
                        }, {
                            displayName: '联系电话',
                            type: 'number',
                            name: 'mobile',
                            width: '*',
                            minWidth: 100,
                            enableColumnMenu: false
                        }, {
                            displayName: '商户余额(元)',
                            type: 'number',
                            name: 'amount',
                            width: '*',
                            minWidth: 200,
                            // headerCellTemplate: function () {
                            //     return headerCellTemplate.replace('</sub></span></div><div role="button" tabindex="0"', '</sub></span><div class="text-info">合计：{{grid.appScope.$ctrl.statistic.sumOfBalance}}</div></div><div role="button" tabindex="0"');
                            // }
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '大于'
                            }, {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '小于'
                            }],
                            headerCellClass: 'grid-cell-50',
                            footerCellFilter: 'number:2'
                        }, {
                            displayName: '',
                            name: 'nearest',
                            width: 100,
                            minWidth: 100,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">充值记录</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.openModel(row.entity,\'nearest\',\'充值记录\')">充值记录</a></div>'
                        }, {
                            displayName: '',
                            name: 'usage',
                            width: 100,
                            minWidth: 100,
                            enablePinning: false,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">消费清单</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents"><a href="javascript:void(0)" ng-click="grid.appScope.$ctrl.openModel(row.entity,\'usage\',\'消费清单\')">消费清单</a></div>'
                        }];
                        break;
                    case 'usage':
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
                            displayName: '消费项目',
                            name: 'consists',
                            width: '*',
                            minWidth: 200,
                            enableColumnMenu: false
                        }, {
                            displayName: '消费金额(元)',
                            type: 'number',
                            name: 'cost',
                            width: '*',
                            minWidth: 120,
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN,
                                placeholder: '大于'
                            }, {
                                condition: uiGridConstants.filter.LESS_THAN,
                                placeholder: '小于'
                            }],
                            headerCellClass: 'grid-cell-50',
                            footerCellFilter: 'number:2'
                        }, {
                            displayName: '记账时间',
                            name: 'timepoint',
                            type: 'date',
                            width: '*',
                            minWidth: 200
                        }];
                        break;
                }
                self.load[self.tabActive]();

            };

            self.tabList();
        };
    }
});