/*global angular*/
'use strict';
angular.module('app').component('loading', {
    controller: function ($rootScope, $timeout, $element) {
        var _timeout;
        $rootScope.$watch('HttpInProgress', function (val) {
            _timeout && $timeout.cancel(_timeout);
            if (val === 0) {
                _timeout = $timeout(function () {
                    $element.hide();
                }, 10);
            } else {
                $element.show();
            }
        });
    }
});