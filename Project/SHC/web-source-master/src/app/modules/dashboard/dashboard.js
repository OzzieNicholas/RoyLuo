/*global angular,moment*/
'use strict';
angular.module('app').component('dashboard', {
    templateUrl: 'app/modules/dashboard/dashboard.html',
    controller: function ($timeout, $state, User, $rootScope) {

        var self = this,
            timeout = $timeout(function nowtime() {
                self.timeStr = moment().format('H:mm:ss');
                timeout = $timeout(nowtime, 1000);
            });
        self.adminLink = /cloudenergy\.me/.test(location.hostname) ? location.origin.replace(/pre\./, 'preadmin.').replace(/(www|basic|intel|leo)\./, 'admin.') : '/admin';

        self.logout = function () {
            User.$logout({
                redirect: '/'
            }).then(function () {
                $state.go('login');
            });
        };

        self.$onDestroy = function () {
            $timeout.cancel(timeout);
        };
    }
}).filter('menuActiveClass', function ($state) {
    return function (input) {
        var classes = [];
        if (angular.equals(input.state, $state.current.name)) {
            classes.push('active');
        }
        return classes;
    };
});