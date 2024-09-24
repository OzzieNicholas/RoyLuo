/*global angular*/
'use strict';
angular.module('app').component('customer', {
    templateUrl: 'app/components/customer/customer.html',
    bindings: {
        customerSelected: '='
    },
    controller: function ($rootScope, $element, $timeout, $api) {

        var self = this;

        //查询社会属性
        $api.customer.info({
            project: $rootScope.Project.current && $rootScope.Project.current._id,
            onlynode: 1
        }, function (data) {
            self.customer = {
                core: {
                    data: [{
                        id: 'ROOT',
                        parent: '#',
                        text: '全部',
                        state: {
                            selected: true,
                            opened: true
                        },
                        icon: 'glyphicon glyphicon-th-list'
                    }]
                },
                conditionalselect: function (node, event) {
                    if (node.id === 'ROOT') {
                        self.customerSelected = undefined;
                    } else {
                        self.customerSelected = node.id;
                    }
                    return true;
                },
                plugins: [
                    'search', 'conditionalselect'
                ]
            };
            (function forEach(list, parent) {
                angular.forEach(list, function (item, index) {
                    item.parent = parent;
                    item.text = item.title;
                    // if (parent === '#' && index === 0) {
                    //     item.state = {
                    //         selected: true,
                    //         opened: true
                    //     }
                    // }
                    if (Object.keys(item.child).length) {
                        item.icon = 'glyphicon glyphicon-th-list';
                    } else {
                        item.icon = 'glyphicon glyphicon-file';
                    }
                    forEach(item.child, item.id);
                    self.customer.core.data.push(item);
                });
            }(data.result, 'ROOT'));
        });

    }
});