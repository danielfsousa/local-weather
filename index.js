var app=angular.module("app",["ngRoute","ngResource","ngAnimate","ngRoute","ngCookies"]);Date.prototype.addDays=function(t){var e=new Date(this.valueOf());return e.setDate(e.getDate()+t),e},app.controller("CityController",["$scope","$routeParams","$interval","$location","weather","util",function(t,e,n,o,a,r){function i(e){a.weekForecast(e.name).$promise.then(c,u);var n=Math.round(e.main.temp);"f"===t.unit?t.temp=Math.round(1.8*n+32):t.temp=n,t.city=e.name,t.weather=e.weather[0].main.toLowerCase()}function c(e){t.days=[];var n=function(e){var n=Math.round(e);return"f"===t.unit?Math.round(1.8*n+32):n};e.list.forEach(function(e,o){t.days.push({date:(new Date).addDays(o),min:n(e.temp.min),max:n(e.temp.max),weather:e.weather[0].main.toLowerCase()})}),t.loadComplete=!0}function u(e){console.log("Your Location could not be determined."+e),t.error=!0,n(function(){o.path("/"),t.error=!1},3e3)}t.celsiusToF=function(){"c"===t.unit&&(t.temp=Math.round(1.8*t.temp+32),t.days.forEach(function(t){t.min=Math.round(1.8*t.min+32),t.max=Math.round(1.8*t.max+32)}),t.unit="f",r.setUnit("f"))},t.fahrenheitToC=function(){"f"===t.unit&&(t.temp=Math.round((t.temp-32)*(5/9)),t.days.forEach(function(t){t.min=Math.round((t.min-32)*(5/9)),t.max=Math.round((t.max-32)*(5/9))}),t.unit="c",r.setUnit("c"))},t.$watch("search",function(e,n){e&&(t.search=r.removeAccentuated(e))}),t.goCity=function(){o.path(t.search)},t.unit=r.getUnit(),a.city(e.city).$promise.then(i,u)}]),app.controller("MainController",["$scope","$location","geolocation","weather","ip2coords","util",function(t,e,n,o,a,r){function i(){var e=new Image,n=new Image,o=new Image,a=new Image,r=new Image,i=new Image,c=new Image,u=new Image,m="haze"===t.weather||"mist"===t.weather?"atmosphere":t.weather;e.src="img/"+m+".jpg",t.loadComplete=!0,n.src="img/clear.jpg",o.src="img/clouds.jpg",r.src="img/rain.jpg",a.src="img/thunderstorm.jpg",i.src="img/snow.jpg",c.src="img/drizzle.jpg",u.src="img/atmosphere.jpg"}function c(e){o.weekForecast(e.list[0].name).$promise.then(u,m);var n=e.list[0].main.temp;"f"===t.unit?t.temp=Math.round(1.8*n+32):t.temp=Math.round(n),t.city=e.list[0].name,t.weather=e.list[0].weather[0].main.toLowerCase()}function u(e){t.days=[];var n=function(e){var n=Math.round(e);return"f"===t.unit?Math.round(1.8*n+32):n};e.list.forEach(function(e,o){t.days.push({date:(new Date).addDays(o),min:n(e.temp.min),max:n(e.temp.max),weather:e.weather[0].main.toLowerCase()})}),i()}function m(n){console.log("Your Location could not be determined."+n),t.error=!0,$interval(function(){t.error=!1,e.path("/")},3e3)}t.celsiusToF=function(){"c"===t.unit&&(t.temp=Math.round(1.8*t.temp+32),t.days.forEach(function(t){t.min=Math.round(1.8*t.min+32),t.max=Math.round(1.8*t.max+32)}),t.unit="f",r.setUnit("f"))},t.fahrenheitToC=function(){"f"===t.unit&&(t.temp=Math.round((t.temp-32)*(5/9)),t.days.forEach(function(t){t.min=Math.round((t.min-32)*(5/9)),t.max=Math.round((t.max-32)*(5/9))}),t.unit="c",r.setUnit("c"))},t.$watch("search",function(e,n){e&&(t.search=r.removeAccentuated(e))}),t.goCity=function(){e.path(t.search)},t.unit=r.getUnit(),a.$promise.then(function(t){t&&"success"===t.status&&o.find(t.lat,t.lon).$promise.then(c,m)},m)}]),app.config(["$routeProvider",function(t){t.when("/",{templateUrl:"pages/home.html",controller:"MainController"}).when("/:city",{templateUrl:"pages/home.html",controller:"CityController"}).otherwise({redirectTo:"/"})}]),app.factory("weather",["$resource",function(t){var e=function(e){return t("http://api.openweathermap.org/data/2.5/"+e,{callback:"JSON_CALLBACK"},{get:{method:"JSONP"}})};return{find:function(t,n){return e("find").get({lat:t,lon:n,units:"metric",APPID:"74e08c1b6d67c8565e0a0632b512e6f4",cnt:1})},city:function(t){return e("weather").get({q:t,units:"metric",APPID:"74e08c1b6d67c8565e0a0632b512e6f4"})},weekForecast:function(t){return e("forecast/daily").get({q:t,units:"metric",APPID:"74e08c1b6d67c8565e0a0632b512e6f4",cnt:7})}}}]),app.factory("ip2coords",["$resource",function(t){var e=t("http://ip-api.com/json",{callback:"JSON_CALLBACK"},{get:{method:"JSONP"}});return e.get()}]),app.factory("geolocation",["$q","$window","$rootScope",function(t,e,n){return function(){var o=t.defer();return e.navigator?e.navigator.geolocation.getCurrentPosition(function(t){n.$apply(function(){o.resolve(t)})},function(t){n.$apply(function(){o.reject(t)})}):n.$apply(function(){o.reject(new Error("Geolocation is not supported"))}),o.promise}}]),app.factory("util",["$cookies",function(t){var e=t.get("unit");return{removeAccentuated:function(t){for(var e=[/[\300-\306]/g,/[\340-\346]/g,/[\310-\313]/g,/[\350-\353]/g,/[\314-\317]/g,/[\354-\357]/g,/[\322-\330]/g,/[\362-\370]/g,/[\331-\334]/g,/[\371-\374]/g,/[\321]/g,/[\361]/g,/[\307]/g,/[\347]/g],n=["A","a","E","e","I","i","O","o","U","u","N","n","C","c"],o=0;o<e.length;o++)t=t.replace(e[o],n[o]);return t},getUnit:function(){return e||(t.put("unit","c"),e="c"),e},setUnit:function(n){t.put("unit",n),e=n}}}]);