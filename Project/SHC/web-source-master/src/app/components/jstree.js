/*global angular*/
'use strict';
angular.module('app').component('jstree', {
    bindings: {
        customer: '<',
        search: '<'
    },
    controller: function ($element, $ocLazyLoad) {

        var lazyLoad = $ocLazyLoad.load([{
            insertBefore: '#load_styles_before',
            files: ['https://cdn.bootcss.com/jstree/3.3.2/themes/default/style.min.css']
        }, {
            files: ['https://cdn.bootcss.com/jstree/3.3.2/jstree.min.js']
        }]);

        this.$onChanges = function (change) {
            lazyLoad.then(function () {
                if (change.customer) {
                    $element.data('jstree') && $element.data('jstree').destroy();
                    $element.jstree(change.customer.currentValue);
                }
                if (change.search && $element.jstree(true).search) {
                    $element.jstree(true).search(change.search.currentValue || '');
                }
            });
        };

    }
});