/*global angular*/
'use strict';
angular.module('app').constant('monitorColumnGroupmode', [{
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
    displayName: '项目名称',
    name: 'name',
    width: '*',
    minWidth: 260,
    enableColumnMenu: false,
    enableSorting: false,
    cellTemplate: '<div class="ui-grid-cell-contents"><a target="_blank" ui-sref="dashboard.control({projectid:row.entity.id})" ng-bind="COL_FIELD"></a></div>'
}, {
    displayName: '单位面积能耗',
    type: 'number',
    name: 'uaec',
    width: '*',
    minWidth: 120,
    headerCellClass: 'text-right',
    cellClass: 'text-right'
}, {
    displayName: '节能等级',
    type: 'number',
    name: 'ecslevel',
    width: '*',
    minWidth: 120,
    headerCellClass: 'text-right',
    cellClass: 'text-right'
}, {
    displayName: '节能标准',
    name: 'ecsdesc',
    width: '*',
    minWidth: 150,
    headerCellClass: 'text-right',
    cellClass: 'text-right'
}]);