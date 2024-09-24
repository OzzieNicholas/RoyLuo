/*global angular*/
'use strict';
angular.module('app').directive('datetimepicker', function ($ocLazyLoad) {

    var lazyLoad = $ocLazyLoad.load([{
        insertBefore: '#load_styles_before',
        files: ['https://cdn.bootcss.com/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css']
    }, {
        files: ['https://cdn.bootcss.com/bootstrap-datetimepicker/4.17.37/js/bootstrap-datetimepicker.min.js']
    }]);

    return {
        restrict: 'EA',
        require: '?ngModel',
        link: function (scope, element, attrs, ctrl) {
            lazyLoad.then(function () {

                var elmData,
                    opt = {
                        maxDateTo: undefined, //最大至
                        minDateTo: undefined, //最小至
                        maxRangeTo: undefined, //最大范围至
                        minRangeTo: undefined, //最小范围至
                        rangeDay: undefined //限制范围（天）
                    },
                    options = {
                        locale: 'zh-CN',
                        format: 'YYYY-MM-DD',
                        maxDate: new Date(),
                        widgetPositioning: {
                            horizontal: 'right'
                        }
                    },
                    linkage = function (nowDate) {
                        if (!opt.completed) {
                            elmData = element.data('DateTimePicker');
                            opt.maxDateTo = opt.maxDateTo && $(opt.maxDateTo).data('DateTimePicker');
                            opt.minDateTo = opt.minDateTo && $(opt.minDateTo).data('DateTimePicker');
                            opt.maxRangeTo = opt.maxRangeTo && $(opt.maxRangeTo).data('DateTimePicker');
                            opt.minRangeTo = opt.minRangeTo && $(opt.minRangeTo).data('DateTimePicker');
                            opt.completed = true;
                        }
                        nowDate = nowDate || elmData.date();
                        if (opt.maxDateTo) {
                            opt.maxDateTo.minDate(nowDate);
                            opt.maxDateTo.date() && elmData.maxDate(opt.maxDateTo.date());
                        }
                        if (opt.minDateTo) {
                            opt.minDateTo.maxDate(nowDate);
                            opt.minDateTo.date() && elmData.minDate(opt.minDateTo.date());
                        }
                        if (opt.maxRangeTo && opt.rangeDay) {
                            opt.maxRangeTo.date(moment(Math.max(elmData.date(), Math.min(moment(nowDate).add(opt.rangeDay, 'days'), opt.maxRangeTo.date(), moment()))));
                        }
                        if (opt.minRangeTo && opt.rangeDay) {
                            opt.minRangeTo.date(moment(Math.min(elmData.date(), Math.max(moment(nowDate).subtract(opt.rangeDay, 'days'), opt.minRangeTo.date()))));
                        }
                    };

                angular.forEach(element.data(), function (val, key) {
                    if (!/^\$/.test(key)) {
                        if (/^\{.*\}$/.test(val) || /^\[.*\]$/.test(val)) {
                            eval('this[key]=' + val);
                        } else {
                            this[key] = val;
                        }
                    }
                }, options);

                scope.$watch(attrs.datetimepicker, function (val) {

                    if (!attrs.datetimepicker || angular.isDefined(val)) {

                        angular.isObject(val) && angular.extend(options, val);

                        angular.forEach(opt, function (val, key) {
                            opt[key] = options[key];
                            delete options[key];
                        });

                        element.datetimepicker(options);

                        !options.inline && element.off('dp.change').on('dp.change', function (event) {
                            linkage(event.date);
                            ctrl && ctrl.$setViewValue(event.target.value);
                        }).off('dp.show').on('dp.show', function () {
                            linkage();
                        });

                    }

                });

            });
        }
    };

});