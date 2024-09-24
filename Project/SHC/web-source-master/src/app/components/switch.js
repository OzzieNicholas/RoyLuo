/*global angular*/
'use strict';
angular.module('app').component('switch', {
    template: '<input type="checkbox">',
    bindings: {
        state: '=',
        stateOn: '@',
        stateOff: '@',
        disabled: '<',
        onSwitch: '&'
    },
    controller: function ($scope, $element) {
        var self = this,
            input = $element.find('input[type=checkbox]'),
            data = $element.data() || {},
            valueOn,
            valueOff,
            onChange = function (event, state) {
                switchChange = true;
                toggle = self.state;
                self.state = state ? valueOn : valueOff;
                $scope.$apply();
            },
            switchChange = false,
            toggle;

        input.bootstrapSwitch(data);

        angular.isDefined(data.disabled) && input.bootstrapSwitch('disabled', data.disabled);

        $scope.$watch('$ctrl.state', function (state) {
            if (switchChange === true) {
                switchChange = false;
                self.onSwitch();
            } else if (angular.isUndefined(state) && angular.isDefined(toggle)) {
                self.state = toggle;
                toggle = undefined;
            } else {
                var disabled = input.bootstrapSwitch('disabled');
                disabled && input.bootstrapSwitch('disabled', false);
                input.off('switchChange.bootstrapSwitch');
                input.bootstrapSwitch('state', state === valueOn);
                input.on('switchChange.bootstrapSwitch', onChange);
                disabled && input.bootstrapSwitch('disabled', true);
            }
        });

        self.$onInit = function () {
            valueOn = angular.isUndefined(self.stateOn) ? true : self.stateOn;
            valueOff = angular.isUndefined(self.stateOff) ? false : self.stateOff;
        };

        self.$onChanges = function (change) {
            angular.isUndefined(data.disabled) && input.bootstrapSwitch('disabled', !!change.disabled.currentValue);
        };

    }
});