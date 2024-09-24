/*global angular*/
'use strict';
angular.module('app', ['ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'oc.lazyLoad']);

/*  angular rendering  */
angular.element(document).ready(function () {
    /*  bind focus class to .form-control  */
    $(document.body).on('focus', '.form-group > input.form-control, .input-group > input.form-control', function () {
        $(this).closest('.input-group, .form-group').addClass('focus');
    }).on('blur', '.form-group > input.form-control, .input-group > input.form-control', function () {
        $(this).closest('.input-group, .form-group').removeClass('focus');
    });
    angular.bootstrap(document, ['app']);
});