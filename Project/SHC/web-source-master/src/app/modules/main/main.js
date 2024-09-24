/*global angular,moment*/
angular.module('app').component('main', {
    templateUrl: 'app/modules/main/main.html',
    controller: function () {
        this.selectDay = moment().format('YYYYMMDD');
        this.selectMonth = moment().format('YYYYMM');
    }
});

angular.module('app').component('mainCalendar', {
    templateUrl: 'app/modules/main/calendar.html',
    bindings: {
        groupmode: '<',
        selectDay: '=',
        selectMonth: '='
    },
    controller: function ($rootScope, $scope, $element, $timeout, $api) {

        var self = this,
            datetimepicker = $element.find('datetimepicker').on('dp.change', function (event) {
                $timeout(function () {
                    self.selectDay = event.date.format('YYYYMMDD');
                    self.selectMonth = event.date.format('YYYYMM');
                    self.bindTD();
                });
            }).on('dp.update', function (event) {
                if (angular.equals(event.viewDate.format('YYYYMM'), self.selectMonth)) {
                    self.bindTD();
                } else {
                    datetimepicker.data('DateTimePicker').defaultDate(event.viewDate._d);
                }
            });

        self.bindTD = function () {
            self.calendarData && datetimepicker.find('.datepicker-days table tbody td.day').each(function () {
                if (!/old|new/i.test(this.className)) {
                    var $this = $(this),
                        day = $this.data('day'),
                        dayclass = 'emstatus-keep';
                    if (self.calendarData.detail[day] > self.calendarData.average) {
                        dayclass = 'emstatus-up';
                    }
                    if (self.calendarData.detail[day] > self.calendarData.average) {
                        dayclass = 'emstatus-down';
                    }
                    $this.removeClass('emstatus-up').removeClass('emstatus-down').removeClass('emstatus-keep');
                    self.calendarData.detail[day] && $this.addClass(dayclass);
                }
            });
            datetimepicker.find('.datepicker-days table tbody td.active').click(function () {
                return false;
            });
        };

        $scope.$watch('$ctrl.selectMonth', function (month) {
            $api.business.calendar({
                time: month,
                project: [$rootScope.Project.current._id],
                assemble: self.groupmode
            }, function (data) {
                data = data.result[$rootScope.Project.current._id];
                self.calendarData = data || {};
                self.calendarData.detail = self.calendarData.detail;
                if (self.groupmode) {
                    self.calendarData.average = self.calendarData.buildingConsumption / (self.calendarData.detail && Object.keys(self.calendarData.detail).length || 0);
                } else {
                    self.calendarData.average = self.calendarData.buildingConsumption / (self.calendarData.detail && self.calendarData.detail.length || 0);
                }
                angular.forEach(self.calendarData.detail, function (item, key) {
                    if (self.groupmode) {
                        this[moment(key * 1).format('YYYY-MM-DD')] = item;
                    } else {
                        this[moment(item._id * 1).format('YYYY-MM-DD')] = item.value;
                    }
                }, self.calendarData.detail = {});
                self.bindTD();
            });
        });

    }
});

angular.module('app').component('mainDailycost', {
    templateUrl: 'app/modules/main/dailycost.html',
    bindings: {
        groupmode: '<',
        selectDay: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;

        self.$onChanges = function () {

            self.showDay = self.selectDay.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

            $api.business.dailycost({
                time: self.selectDay,
                project: [$rootScope.Project.current._id],
                assemble: self.groupmode
            }, function (data) {
                data = data.result[$rootScope.Project.current._id] || {};
                self.qoqPercent = data.qoqPercent;
                self.yoyPercent = data.yoyPercent;
                self.dailycost = {
                    chart: {
                        margin: [0, 0, 0, 0],
                        style: {
                            textAlign: 'center'
                        },
                        type: 'pie'
                    },
                    title: {
                        text: '<div class="pieTitle">今日费用</div><div class="pieNumber">' + data.cost + '</div><div class="pieUnit">元</div>',
                        verticalAlign: 'middle',
                        useHTML: true,
                        y: -12
                    },
                    tooltip: false,
                    plotOptions: {
                        pie: {
                            dataLabels: false,
                            innerSize: '85%'
                        }
                    },
                    series: [{
                        data: [data.cost]
                    }]
                };

            });

        };

    }
});

angular.module('app').component('mainMonthlykgce', {
    templateUrl: 'app/modules/main/monthlykgce.html',
    bindings: {
        groupmode: '<',
        selectMonth: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;
        self.$onChanges = function () {

            self.showDay = self.selectMonth.toString().replace(/^(\d{4})(\d{2})$/, '$1-$2');

            $api.business.monthlykgce({
                time: self.selectMonth,
                project: [$rootScope.Project.current._id]
            }, function (data) {

                var series = [],
                    total = 0,
                    kgceperunitarea = 0,
                    kwhperunitarea = 0;

                data = data.result[$rootScope.Project.current._id] || {};
                angular.forEach(data.detail, function (val, key) {
                    this.push([key, val]);
                }, data.detail = []);
                series.push({
                    data: data.detail
                });
                total = data.kgce;
                kgceperunitarea = data.kgceperunitarea;
                kwhperunitarea = data.kwhperunitarea;

                //统计单位面积能耗 & 单位面积电耗
                self.currentMonthKgceperunitarea = Math.round(kgceperunitarea * 100) / 100;
                self.currentMonthKwhperunitarea = Math.round(kwhperunitarea * 100) / 100;

                self.monthlykgce = {
                    chart: {
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 140,
                        marginTop: 0,
                        style: {
                            textAlign: 'center'
                        },
                        type: 'pie'
                    },
                    title: {
                        text: '<div class="pieTitle">月综合能耗</div><div class="pieNumber">' + (Math.round(total * 100) / 100) + '</div><div class="pieUnit">千克煤</div>',
                        verticalAlign: 'middle',
                        useHTML: true,
                        x: -70,
                        y: -12
                    },
                    tooltip: {
                        pointFormat: ' <b>{point.y}</b> 千克煤'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: false,
                            innerSize: '85%',
                            showInLegend: true
                        }
                    },
                    legend: {
                        verticalAlign: 'middle',
                        layout: 'vertical',
                        labelFormatter: function () {
                            return '<div style="text-align:left;">' + (Math.round(this.percentage * 10) / 10) + '% ' + this.name + '</div><div style="color:#BBB;text-align:left;">' + this.y + 'KGce</div>';
                        },
                        itemWidth: 100,
                        useHTML: true,
                        x: 140
                    },
                    series: series
                };

            });
        };

    }
});

angular.module('app').component('mainEnergyconstitute', {
    templateUrl: 'app/modules/main/energyconstitute.html',
    bindings: {
        selectMonth: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;

        self.$onChanges = function () {

            self.showDay = self.selectMonth.toString().replace(/^(\d{4})(\d{2})$/, '$1-$2');

            $api.business.energyconstitute({
                time: self.selectMonth,
                project: [$rootScope.Project.current._id]
            }, function (data) {

                var categories = [],
                    series = [];
                self.charttype = 'column';

                angular.forEach(data.result[$rootScope.Project.current._id] || {}, function (item, name, bool) {
                    if (Object.keys(item).length > categories.length) {
                        bool = 0;
                        categories = [];
                    }
                    angular.forEach(item, function (val, key) {
                        this.push(val);
                        bool === 0 && categories.push(parseInt(key));
                    }, item = []);
                    series.push({
                        data: item,
                        name: name
                    });
                });
                self.typeChange = function (type) {
                    type && (self.charttype = type);
                    self.energyconstitute = {
                        chart: {
                            type: self.charttype
                        },
                        title: false,
                        xAxis: {
                            type: 'datetime',
                            categories: categories,
                            labels: {
                                formatter: function () {
                                    return moment(this.value).format('M-DD');
                                }
                            }
                        },
                        yAxis: {
                            title: false
                        },
                        tooltip: {
                            xDateFormat: '%m月%d日',
                            pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y}元</span>'
                        },
                        series: series
                    };
                };
                self.typeChange();

            });

        };

    }
});

angular.module('app').component('mainDailysensordetail', {
    templateUrl: 'app/modules/main/dailysensordetail.html',
    bindings: {
        selectMonth: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;

        self.$onChanges = function () {

            $api.business.dailysensordetail({
                time: self.selectMonth,
                project: $rootScope.Project.current._id
            }, function (data) {

                data = data.result[$rootScope.Project.current._id] || {};

                var total = 0;

                angular.forEach(data, function (val, key) {
                    this.push([key, val]);
                    total += (val * 100);
                }, data = []);

                self.dailysensordetail = {
                    chart: {
                        marginLeft: -10,
                        marginRight: 200,
                        style: {
                            textAlign: 'left'
                        },
                        type: 'pie'
                    },
                    title: {
                        text: '<div class="pieTitle">' + self.selectMonth.toString().replace(/^(\d{4})(\d{2})$/, '$1年$2月') + '能耗</div><div>' + (total / 100) + 'KWh</div>',
                        verticalAlign: 'middle',
                        useHTML: true,
                        x: -100,
                        y: -5
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y:.2f}kWh {point.percentage:.2f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: false,
                            innerSize: '85%',
                            showInLegend: true
                        }
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'middle',
                        layout: 'vertical',
                        labelFormatter: function () {
                            var a = (Math.round(this.percentage * 10) / 10) + '% ' + this.name,
                                b = (Math.round((this.y || 0) * 100) / 100) + 'kWh';
                            return [
                                '<span class="center-block" title="' + a + '">' + a + '</span>',
                                '<span class="center-block text-muted" title="' + b + '">' + b + '</span>'
                            ].join('');
                        },
                        itemWidth: 200,
                        x: 140,
                        useHTML: true
                    },
                    series: [{
                        cropThreshold: 0,
                        turboThreshold: 0,
                        data: data
                    }]
                };

            });

        };

    }
});

angular.module('app').component('mainEnergyeffectiverate', {
    templateUrl: 'app/modules/main/energyeffectiverate.html',
    bindings: {
        groupmode: '<',
        selectMonth: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;
        self.$onChanges = function () {

            self.showDay = self.selectMonth.toString().replace(/^(\d{4})(\d{2})$/, '$1-$2');

            $api.business.energyeffectiverate({
                time: self.selectMonth,
                project: $rootScope.Project.ids,
                assemble: self.groupmode
            }, function (data) {

                var categories = [],
                    series = [];
                self.charttype = 'spline';
                angular.forEach(data.result || {}, function (items, name, bool) {
                    if (Object.keys(items).length > categories.length) {
                        bool = 0;
                        categories = [];
                    }
                    angular.forEach(items, function (item, key) {
                        this.push(Math.round(item.value * 100) / 100);
                        bool === 0 && categories.push(key * 1000);
                    }, items = []);
                    series.push({
                        data: items,
                        name: {
                            now: '本月能效',
                            yoy: '同期能效'
                        }[name] || name
                    });
                });

                self.typeChange = function (type) {
                    type && (self.charttype = type);
                    self.energyeffectiverate = {
                        chart: {
                            type: self.charttype
                        },
                        title: false,
                        xAxis: {
                            type: 'datetime',
                            categories: categories,
                            labels: {
                                formatter: function () {
                                    return moment(this.value).format('M-DD');
                                }
                            }
                        },
                        yAxis: {
                            title: false
                        },
                        tooltip: {
                            xDateFormat: '%m月%d日',
                            pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y}KWh</span>'
                        },
                        series: series
                    };
                };
                self.typeChange();

            });

        };

    }
});

angular.module('app').component('mainProjectdetail', {
    templateUrl: 'app/modules/main/projectdetail.html',
    bindings: {
        selectMonth: '<'
    },
    controller: function ($rootScope, $api) {

        var self = this;

        self.$onChanges = function () {

            $api.business.projectdetail({
                time: self.selectMonth,
                project: $rootScope.Project.ids
            }, function (data) {

                angular.forEach(data.result, function (item) {
                    item.data = [0, 0, 0, 0, 0];
                    item.data[item.ecslevel - 1] = item.uaec;
                    this.push({
                        name: item.name,
                        data: item.data
                    });
                }, data.series = []);

                self.projectdetail = {
                    chart: {
                        type: 'bar'
                    },
                    title: false,
                    xAxis: {
                        categories: ['0-1.8 KWh', '1.8-3.8 KWh', '3.8-5.7 KWh', '5.7-7.7 KWh', '7.7-∞ KWh']
                    },
                    yAxis: {
                        title: false
                    },
                    tooltip: {
                        valueSuffix: ' KWh'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'bottom',
                        y: -20,
                        floating: true,
                        borderWidth: 1
                    },
                    series: data.series
                };

            });

        };

    }
});