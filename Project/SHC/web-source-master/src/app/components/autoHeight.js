/*global angular*/
'use strict';
angular.module('app').component('autoHeight', {
    bindings: {
        fixHeight: '<'
    },
    controllerAs: 'autoheight',
    controller: function ($element, $timeout) {
        var self = this,
            resize = function () {
                var innerHeight = $(window).innerHeight(),
                    offsetTop = $element.offset().top,
                    fixheight = self.fixHeight ? self.fixHeight : 15;
                $element.height(innerHeight - offsetTop - fixheight);
            };
        resize();
        self.$onChanges = resize;
        $timeout(resize);
        $(window).on('resize', resize);
        self.$onDestroy = function () {
            $(window).off('resize', resize);
        };
    }
});