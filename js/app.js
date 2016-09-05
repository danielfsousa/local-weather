var app = angular.module('app', ['ngRoute', 'ngResource', 'ngAnimate', 'ngRoute', 'ngCookies']);

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
