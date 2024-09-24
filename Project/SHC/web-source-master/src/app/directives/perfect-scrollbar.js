/*global angular*/
'use strict';
angular.module('app').directive('perfectScrollbar', function ($ocLazyLoad, $timeout) {

    var lazyLoad = $ocLazyLoad.load([{
        insertBefore: '#load_styles_before',
        files: ['https://cdn.bootcss.com/jquery.perfect-scrollbar/0.6.13/css/perfect-scrollbar.min.css']
    }, {
        files: ['https://cdn.bootcss.com/jquery.perfect-scrollbar/0.6.13/js/perfect-scrollbar.jquery.min.js']
    }]);

    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            lazyLoad.then(function () {
                scope.$watch(attrs.perfectScrollbar, function (options) {
                    options = angular.isObject(options) && angular.extend({}, options) || {};
                    $timeout(function () {
                        element.perfectScrollbar(options);
                        element.data('perfectScrollbar') && element.perfectScrollbar('update');
                        element.data('perfectScrollbar', options);
                    });
                });
                scope.$watch(attrs.perfectScrollbarEvent, function (events) {
                    angular.forEach(events, function (fn, key) {
                        element.off(key);
                        angular.isFunction(fn) && element.on(key, fn);
                    });
                });
            });
        }
    };

});