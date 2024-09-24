'use strict';
angular.module('app').controller('CollectorIndex', function ($rootScope, $scope, $api, $uibModal, SweetAlert) {

    $scope.currentPage = 1;
    $scope.askingRemoveID = undefined;

    $scope.DoRemove = function (e, id, index) {
        e.preventDefault();
        $api.collector.delete({
            id: id
        }, function () {
            $scope.items.detail.splice(index, 1);
        }, SweetAlert.error);
    };
    $scope.AskForRemove = function (e, id) {
        e.preventDefault();
        $scope.askingRemoveID = id;
    };
    $scope.CancelRemove = function (e) {
        e.preventDefault();
        $scope.askingRemoveID = undefined;
    };

    $scope.switchStatus = function (item, e) {
        e.preventDefault();
        $uibModal.open({
            templateUrl: 'modal-collectorStatus.html',
            size: 'md',
            controller: function ($scope, $uibModalInstance) {
                $scope.item = angular.copy(item);
                $scope.ok = function () {
                    $api.collector.status({
                        id: item.id,
                        projectid: $rootScope.Project.current._id,
                        status: item.status == 'ONLINE' && 'DEBUG' || 'ONLINE'
                    }, function () {
                        item.status = ($scope.item.status == 'ONLINE' && 'DEBUG' || 'ONLINE');
                        $uibModalInstance.dismiss('cancel');
                    }, function () {
                        $uibModalInstance.dismiss('cancel');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        });
    };

    $scope.multiCheck = function (item) {
        if (item === 'all') {
            $scope.multiCheck.all && ($scope.showButton = true);
            !$scope.multiCheck.all && ($scope.showButton = false);
            angular.forEach($scope.items.detail, function (item) {
                item.isSelected = $scope.multiCheck.all;
            });
        } else {
            $scope.multiCheck.all = true;
            $scope.showButton = false;
            angular.forEach($scope.items.detail, function (item) {
                if (!item.isSelected) {
                    delete $scope.multiCheck.all;
                }
                if (item.isSelected) {
                    $scope.showButton = true;
                }
            });
        }
    };

    $scope.multiIds = function () {
        var Ids = [];
        angular.forEach($scope.items.detail, function (item) {
            item.isSelected && Ids.push(item.id);
        });
        return Ids;
    };

    $scope.switchAll = function (type, e) {
        e.preventDefault();
        var $parent = $scope;
        $uibModal.open({
            templateUrl: 'modal-collectorStatus.html',
            size: 'md',
            controller: function ($scope, $uibModalInstance) {
                $scope.ok = function () {
                    $api.collector.status({
                        id: $parent.multiIds(),
                        projectid: $rootScope.Project.current._id,
                        status: type
                    }, function () {
                        $api.collector.info({
                            project: $rootScope.Project.current._id
                        }, function (data) {
                            delete $parent.multiCheck.all;
                            $parent.items = data.result;
                            $uibModalInstance.dismiss('cancel');
                        });
                    }, function () {
                        $uibModalInstance.dismiss('cancel');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        });
    };

    $scope.popIsOpen = function () {
        angular.forEach($scope.items.detail, function (item) {
            delete item.titleIsOpen;
        });
    };

    $scope.popover = {
        url: {
            title: 'titleChange.html'
        },
        title: {
            title: '管理器名称修改'
        },
        ok: function (item, type, Change) {
            var isOpen = type + 'IsOpen';
            item[isOpen] = false;
            $scope.item = angular.copy(item);
            $scope.item[type] = Change[type];
            $api.collector.update($scope.item, function () {
                item[type] = Change[type];
                SweetAlert.success('更新成功');
            }, SweetAlert.error);
        },
        cancel: function (item, type) {
            var isOpen = type + 'IsOpen';
            item[isOpen] = false;
        }
    };
    $scope.$watch('currentPage', function () {
        $api.collector.info({
            project: $rootScope.Project.current._id,
            pageindex: $scope.currentPage,
            pagesize: 20
        }, function (data) {
            $scope.items = data.result;
        }, function () {
            delete $scope.items;
        });

    });

});