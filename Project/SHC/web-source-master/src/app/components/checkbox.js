/*global angular*/
'use strict';
angular.module('app').component('checkbox', {
    template: '<label class="checkbox"><input type="checkbox" data-toggle="checkbox" ng-model="$ctrl.checked" ng-click="$ctrl.onCheck()"></label>',
    bindings: {
        checked: '=',
        onCheck: '&'
    },
    controller: function ($element) {
        $element.find('input[type=checkbox]').radiocheck();
    }
});