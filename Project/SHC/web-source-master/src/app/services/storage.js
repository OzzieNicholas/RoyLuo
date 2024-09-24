'use strict';
angular.module('app').service('$storage', function ($cookies) {

    var $this = this,
        prefix = '__emapp_',
        domain = '.cloudenergy.me',
        keys = {
            uid: '',
            token: ''
        },
        originCookies = $cookies.getAll(),
        SHA1 = new window.Hashes.SHA1,
        PlainText = function (data, code) {
            var keyArray = [],
                valueArray = [];
            angular.forEach(data, function (item, key) {
                keyArray.push(key);
            });
            keyArray.sort();
            angular.forEach(keyArray, function (key) {
                valueArray.push(key + '=' + encodeURIComponent(angular.isObject(data[key]) ? JSON.stringify(data[key]) : data[key]));
            });
            return code + valueArray.toString().replace(/,/g, '') + code;
        };

    angular.extend($this, {
        get: function (item) {
            item = $this.expired() ? undefined : ($cookies.get(item) || sessionStorage[prefix + item] || localStorage[prefix + item]);
            return item === 'undefined' ? undefined : item;
        },
        set: function (data, remember, fromCookie) {
            if (data && Object.keys(data).length) {
                !fromCookie && Object.keys(keys).map(function (item) {
                    $cookies.put(item, data[item], {
                        path: '/',
                        domain: domain,
                        expires: remember && moment().add(1, 'M')._d || undefined
                    });
                });
                if (remember) {
                    $this.expired(moment().add(1, 'M').unix());
                    Object.keys(keys).map(function (item) {
                        localStorage[prefix + item] = data[item];
                    });
                } else {
                    sessionStorage[prefix + 'expires'] = 'Session';
                    Object.keys(keys).map(function (item) {
                        sessionStorage[prefix + item] = data[item];
                    });
                }
            } else {
                delete localStorage[prefix + 'expires'];
                delete sessionStorage[prefix + 'expires'];
                Object.keys(keys).map(function (item) {
                    delete localStorage[prefix + item];
                    delete sessionStorage[prefix + item];
                    $cookies.remove(item, {
                        path: '/',
                        domain: domain
                    });
                });
            }
        },
        expired: function (timestamp) {
            if (timestamp && moment(timestamp, 'X')) {
                localStorage[prefix + 'expires'] = timestamp;
            } else {
                if ($cookies.get('token')) {
                    return false;
                } else if (sessionStorage[prefix + 'expires']) {
                    return false;
                } else {
                    timestamp = localStorage[prefix + 'expires'];
                    return timestamp ? moment(timestamp, 'X').isBefore(moment()) : true;
                }
            }
        },
        valid: function () {
            var bool = true;
            Object.keys(keys).map(function (item) {
                if (!$this.get(item)) {
                    bool = false;
                }
            });
            return bool;
        },
        encrypt: function (data) {
            if ($this.valid()) {
                var timestamp = moment().unix();
                data.v = timestamp;
                data.t = $this.get('token');
                data.sign = SHA1.hex(PlainText(data, SHA1.hex(timestamp.toString())));
                data.p = $this.get('uid');
                delete data.t;
            }
            return data;
        }
    });

    Object.keys(originCookies).length && $this.set(originCookies, false, true);

});