/*global angular*/
'use strict';
angular.module('app').component('login', {
    templateUrl: 'app/modules/login/login.html',
    controller: function ($scope, $cookies, $element, $timeout, $state, User, SweetAlert) {

        var self = this,
            subdomain = /cloudenergy\.me/.test(location.hostname) ? /^(\w+)\./.exec(location.hostname)[1].toLowerCase() : 'www',
            logo = {
                www: {
                    src: 'app/modules/login/img/logo.png',
                    title: '古鸽智慧云能源'
                }
            };

        self.logoSrc = logo[subdomain] && logo[subdomain].src || logo.www.src;
        self.logoTitle = logo[subdomain] && logo[subdomain].title || logo.www.title;

        //输入框
        self.user = localStorage.loginUser;
        self.passwd = localStorage.loginPasswd;
        self.remember = !!localStorage.loginRemember;
        self.rememberaccount = !!localStorage.rememberAccount;
        self.readonly = true;
        $timeout(function () {
            self.readonly = false;
        }, 500);
        $element.find('input[type=checkbox]').radiocheck();

        self.clearUserInput = function () {
            delete localStorage.loginUser;
            delete self.user;
            delete localStorage.loginPasswd;
            delete self.passwd;
            delete localStorage.loginRemember;
            delete self.remember;
            delete localStorage.rememberAccount;
            delete self.rememberaccount;
        };
        self.clearPasswdInput = function () {
            delete localStorage.loginPasswd;
            delete self.passwd;
            delete localStorage.loginRemember;
            delete self.remember;
        };

        $scope.$watch('$ctrl.rememberaccount', function () {
            !self.rememberaccount ? self.remember = self.rememberaccount : '';
        });
        $scope.$watch('$ctrl.remember', function () {
            self.remember ? self.rememberaccount = self.remember : '';
        });

        //登录
        self.login = function (form) {

            var remember = self.remember,
                rememberaccount = self.rememberaccount;

            if (form.$invalid) {
                !self.user && form.user.$setDirty();
                !self.passwd && form.password.$setDirty();
            } else {

                delete localStorage.loginUser;
                delete localStorage.loginPasswd;
                delete localStorage.loginRemember;
                delete localStorage.rememberAccount;

                localStorage.loginUser = self.user;
                if (remember) {
                    localStorage.loginPasswd = self.passwd;
                    localStorage.loginRemember = remember;
                    localStorage.rememberAccount = rememberaccount;
                    localStorage.loginUser = self.user;
                }
                if (!remember && rememberaccount) {
                    delete localStorage.loginPasswd;
                    delete localStorage.loginRemember;
                    localStorage.rememberAccount = rememberaccount;
                    localStorage.loginUser = self.user;
                }

                User.$login({
                    user: self.user,
                    passwd: (new window.Hashes.MD5).hex(self.passwd).toUpperCase(),
                    remember: remember
                }).then(function () {
                    $state.go('dashboard.main', {}, {
                        location: 'replace'
                    });
                }, function (data) {
                    data.message = {
                        20000001: '用户不存在',
                        90000001: '服务器错误',
                        90000002: '拒绝访问',
                        90000003: '登录失败',
                        90000004: '权限不足',
                        90000005: '未登录',
                        90000006: ['验证失败', '账号或密码有误'],
                        90000007: '签名校验失败'
                    }[data.code] || data.message;
                    data.message && SweetAlert.error.apply(SweetAlert, angular.isArray(data.message) ? data.message : [data.message]);
                });

            }

        };

    }
});