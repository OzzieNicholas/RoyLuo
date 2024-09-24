/*global angular*/
'use strict';
angular.module('app').component('analyze', {
    templateUrl: 'app/modules/analyze/analyze.html'
});

angular.module('app').component('analyzeGroup', {
    templateUrl: 'app/modules/analyze/group.html',
    controller: function ($rootScope, $filter, $api) {

        var self = this;

        //时间类型
        self.charttype = 'column';
        self.timetype = {
            DAY: '日',
            WEEK: '周',
            MONTH: '月',
            YEAR: '年'
        };

        self.chart = {};

        //时间选择
        self.timetypeChange = function (timetype) {

            self.building_current = '';
            self.energy_current = '';
            self.timetype_current = timetype;

            self.groupanalysis();

        };

        //加载数据
        self.groupanalysis = function () {
            $api.business.groupanalysis({
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                type: self.timetype_current || 'DAY',
                project: $rootScope.Project.ids
            }, function (data) {
                self.data = data.result;
                self.check(self.current);
            });
        };

        //类型选择
        self.current = 'consumption';
        self.check = function (type) {

            self.current = type;

            //能耗收入比
            self.sheet = [];

            //项目能耗柱状图
            var categories = [],
                nowData = [],
                yoyData = [];

            angular.forEach(self.data.detail, function (items, key) {
                categories.push(items.name = $rootScope.Project[key].title);
                self.sheet.push(items);
                angular.forEach(items, function (item, key) {
                    key === 'now' && nowData.push(item[type]);
                    key === 'yoy' && yoyData.push(item[type]);
                });
            });
            self.typeChange = function (type) {
                type && (self.charttype = type);
                self.chart.timeline = {
                    chart: {
                        type: self.charttype
                    },
                    title: false,
                    xAxis: {
                        categories: categories
                    },
                    yAxis: {
                        title: false
                    },
                    tooltip: {
                        shared: true
                    },
                    series: [{
                        name: '当前',
                        data: nowData
                    }, {
                        name: '同期',
                        data: yoyData
                    }]
                };
            };
            self.typeChange();

        };

        self.timetypeChange('DAY');

        return self;

    }
});

angular.module('app').component('analyzeBuilding', {
    templateUrl: 'app/modules/analyze/building.html',
    controller: function ($rootScope, $filter, $api, analyzePieOptions) {

        var self = this;
        self.charttype = 'column';
        //时间类型
        self.timetype = {
            DAY: '日',
            WEEK: '周',
            MONTH: '月',
            YEAR: '年'
        };

        self.chart = {};

        //时间－》建筑－》收入比－》曲线图
        //时间选择
        self.timetypeChange = function (timetype) {

            self.building_current = '';
            self.energy_current = '';
            self.timetype_current = timetype;

            self.buildingstatistic();

            self.incomerate();

            self.timeline();

        };

        //建筑选择
        self.building_current = '';
        self.building = function (buildingid) {
            self.energy_current = '';
            self.building_current = self.building_current === buildingid ? '' : buildingid;
            self.incomerate();
            self.timeline();
        };

        //收入比选择
        self.energy_current = '';
        self.energy = function (energy) {
            self.energy_current = self.energy_current === energy ? '' : energy;
            self.timeline();
        };

        //建筑数据
        self.buildingstatistic = function () {
            $api.business.buildingstatistic({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: $rootScope.Project.current._id
            }, function (data) {
                angular.forEach(data.result[$rootScope.Project.current._id], function (item) {
                    this.push(item);
                }, self.buildingData = []);
            });
        };

        //收入比数据
        self.incomerate = function () {
            $api.business.energyincomerate({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: {
                    project: $rootScope.Project.current._id,
                    building: self.building_current
                }
            }, function (data) {

                data = data.result[$rootScope.Project.current._id];

                self.pie = data.pie;

                angular.forEach(data.sheet, function (item) {
                    this.push(item);
                }, self.sheet = []);

                ///chart1
                self.chart.nowyoy = analyzePieOptions(data.pie.nowyoy.now, data.pie.nowyoy.yoy);

                ///chart2
                self.chart.nowbudget = analyzePieOptions(data.pie.nowbudget.now, data.pie.nowbudget.budget);

                ///chart3
                self.chart.nowincome = analyzePieOptions(data.pie.nowincome.now, data.pie.nowincome.income);

            });
        };
        //曲线图数据
        self.timeline = function () {
            $api.business.energytimeline({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: [{
                    project: $rootScope.Project.current._id,
                    energytype: self.energy_current,
                    building: self.building_current
                }]
            }, function (data) {

                var categories = [],
                    series = [];

                angular.forEach(data.result[$rootScope.Project.current._id] || {}, function (items, name, bool) {
                    if (Object.keys(items).length > categories.length) {
                        bool = 0;
                        categories = [];
                    }
                    angular.forEach(items, function (val, key) {
                        this.push(Math.round(val * 100) / 100);
                        bool === 0 && categories.push(key * 1);
                    }, items = []);
                    series.push({
                        data: items,
                        name: {
                            now: '当前能耗',
                            yoy: '同期能耗'
                        }[name] || name
                    });
                });
                self.typeChange = function (type) {
                    self.charttype = type;
                    self.chart.timeline = {
                        chart: {
                            type: self.charttype
                        },
                        title: false,
                        xAxis: {
                            type: 'datetime',
                            categories: categories,
                            labels: {
                                formatter: function () {
                                    return $filter('date')(this.value, {
                                        DAY: 'H时',
                                        WEEK: 'M-d',
                                        MONTH: 'M-d',
                                        YEAR: 'M月'
                                    }[self.timetype_current]);
                                }
                            }
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y:.2f}'
                                }
                            }
                        },
                        yAxis: {
                            title: false
                        },
                        tooltip: {
                            xDateFormat: {
                                DAY: '%H时',
                                WEEK: '%m月%d号',
                                MONTH: '%m月%d号',
                                YEAR: '%m月'
                            }[self.timetype_current],
                            pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y:.2f} kWh</span>'
                        },
                        series: series
                    };
                };
                ///chart4
                self.chart.timeline = {
                    chart: {
                        type: 'column'
                    },
                    title: false,
                    xAxis: {
                        type: 'datetime',
                        categories: categories,
                        labels: {
                            formatter: function () {
                                return $filter('date')(this.value, {
                                    DAY: 'H时',
                                    WEEK: 'M-d',
                                    MONTH: 'M-d',
                                    YEAR: 'M月'
                                }[self.timetype_current]);
                            }
                        }
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.2f}'
                            }
                        }
                    },
                    yAxis: {
                        title: false
                    },
                    tooltip: {
                        xDateFormat: {
                            DAY: '%H时',
                            WEEK: '%m月%d号',
                            MONTH: '%m月%d号',
                            YEAR: '%m月'
                        }[self.timetype_current],
                        pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y:.2f} kWh</span>'
                    },
                    series: series
                };

            });
        };

        self.timetypeChange('DAY');

        return self;

    }
});

angular.module('app').component('analyzeSocities', {
    templateUrl: 'app/modules/analyze/socities.html',
    controller: function ($rootScope, $filter, $api, analyzePieOptions) {

        var self = this;
        self.charttype = 'column';
        self.timetype = {
            DAY: '日',
            WEEK: '周',
            MONTH: '月',
            YEAR: '年'
        };

        self.socity_current = '';
        self.socity = function (socity) {
            self.socity_current = self.socity_current === socity ? '' : socity;
            self.timeline();
        };

        self.timetypeChange = function (key) {

            self.socity_current = '';
            self.timetype_current = key;
            self.chart = {};

            $api.business.socitystatistic({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: $rootScope.Project.current._id
            }, function (data) {
                angular.forEach(data.result[$rootScope.Project.current._id], function (item) {
                    this.push(item);
                }, self.socityData = []);
            });

            $api.business.socitydetail({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: $rootScope.Project.current._id
            }, function (data) {

                data = data.result[$rootScope.Project.current._id];

                self.pie = data.pie;

                angular.forEach(data.sheet, function (item) {
                    this.push(item);
                }, self.sheet = []);

                //优先级： 水>气
                self.pie.third = self.pie.water || self.pie.gas;
                if (self.pie.water) {
                    self.pie.third.unitTitle = '吨';
                    self.pie.third.nowTitle = '水当期总量';
                    self.pie.third.yoyTitle = '水同期总量';
                } else if (self.pie.gas) {
                    self.pie.third.unitTitle = '立方米';
                    self.pie.third.nowTitle = '气当期总量';
                    self.pie.third.yoyTitle = '气同期总量';
                }

                ///chart1
                self.chart.nowyoy = analyzePieOptions(data.pie.nowyoy.now, data.pie.nowyoy.yoy);

                ///chart2
                self.chart.electric = analyzePieOptions(data.pie.electric.now, data.pie.electric.yoy);

                ///chart3
                self.chart.third = analyzePieOptions(data.pie.third.now, data.pie.third.yoy);

            });

            self.timeline();

        };

        self.timeline = function () {
            $api.business.socitytimeline({
                timetype: self.timetype_current,
                time: $filter('date')(new Date(), 'yyyyMMdd'),
                project: [{
                    project: $rootScope.Project.current._id,
                    socity: self.socity_current
                }]
            }, function (data) {

                var categories = [],
                    series = [];

                angular.forEach(data.result[$rootScope.Project.current._id] || {}, function (items, name, bool) {
                    if (Object.keys(items).length > categories.length) {
                        bool = 0;
                        categories = [];
                    }
                    angular.forEach(items.detail, function (val, key) {
                        this.push(Math.round(val * 100) / 100);
                        bool === 0 && categories.push(key * 1);
                    }, items = []);
                    series.push({
                        data: items,
                        name: name
                    });
                });
                self.typeChange = function (type) {
                    self.charttype = type;
                    self.energyeffectiverate.chart.type = type;
                };
                self.typeChange = function (type) {
                    self.charttype = type;
                    self.chart.timeline = {
                        chart: {
                            type: self.charttype
                        },
                        title: false,
                        xAxis: {
                            type: 'datetime',
                            categories: categories,
                            labels: {
                                formatter: function () {
                                    return $filter('date')(this.value, {
                                        DAY: 'H时',
                                        WEEK: 'M-d',
                                        MONTH: 'M-d',
                                        YEAR: 'M月'
                                    }[self.timetype_current]);
                                }
                            }
                        },
                        yAxis: {
                            title: false
                        },
                        tooltip: {
                            xDateFormat: {
                                DAY: '%H时',
                                WEEK: '%m月%d号',
                                MONTH: '%m月%d号',
                                YEAR: '%m月'
                            }[self.timetype_current],
                            pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y:.2f} kWh</span>'
                        },
                        series: series
                    };
                };
                ///chart4
                self.chart.timeline = {
                    chart: {
                        type: 'column'
                    },
                    title: false,
                    xAxis: {
                        type: 'datetime',
                        categories: categories,
                        labels: {
                            formatter: function () {
                                return $filter('date')(this.value, {
                                    DAY: 'H时',
                                    WEEK: 'M-d',
                                    MONTH: 'M-d',
                                    YEAR: 'M月'
                                }[self.timetype_current]);
                            }
                        }
                    },
                    yAxis: {
                        title: false
                    },
                    tooltip: {
                        xDateFormat: {
                            DAY: '%H时',
                            WEEK: '%m月%d号',
                            MONTH: '%m月%d号',
                            YEAR: '%m月'
                        }[self.timetype_current],
                        pointFormat: '{series.name}: <span style="color:{point.color};font-weight:700;">{point.y:.2f} kWh</span>'
                    },
                    series: series
                };

            });
        };

        self.timetypeChange('DAY');

        return self;

    }
});

angular.module('app').factory('analyzePieOptions', function () {
    return function (now, yoy) {

        var percent = Math.max(-100, Math.round(100, (now - yoy) / yoy * 100 || 0)),
            data = [{
                // name: '',
                // color: '#7CB5EC',
                y: Math.abs(percent)
            }, {
                // name: '',
                // color: '#8085E9',
                y: 100 - Math.abs(percent)
            }];

        return {
            chart: {
                margin: [0, 0, 0, 0],
                style: {
                    textAlign: 'center'
                },
                type: 'pie'
            },
            title: {
                text: '<span style="' + (percent > 0 ? 'color:#e74c3c;' : 'color:#17bac1;') + '"><span style="font-size: 26px;">' + Math.abs(percent) + '</span><span style="font-size:14px;">%</span></span>',
                verticalAlign: 'middle',
                useHTML: true,
                y: 2
            },
            tooltip: false,
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        color: '#000',
                        connectorColor: '#000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                    innerSize: '80%'
                }
            },
            series: [{
                data: data
            }]
        };

    };
});