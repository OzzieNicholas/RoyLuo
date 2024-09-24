/*global angular*/
'use strict';
angular.module('app').factory('SweetAlert', function () {
    return {
        swal: function () {
            return window.swal.apply(window.swal, arguments);
        },
        success: function (title, message) {
            return this.swal(title, message, 'success');
        },
        error: function (title, message) {
            return this.swal(title, message, 'error');
        },
        warning: function (title, message) {
            return this.swal(title, message, 'warning');
        },
        info: function (title, message) {
            return this.swal(title, message, 'info');
        },
        close: function () {
            return window.swal.close();
        }
    };
});