// =================
//   SERVICES
// =================
app.factory('weather', ['$resource', function ($resource) {

    var API = function (method) {
        return $resource('http://api.openweathermap.org/data/2.5/' + method, {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP'}});
    };

    return {
        find: function (latitude, longitude) {
            return API('find').get({
                lat: latitude,
                lon: longitude,
                units: 'metric',
                APPID: '74e08c1b6d67c8565e0a0632b512e6f4',
                cnt: 1
            });
        },
        city: function (city) {
            return API('weather').get({q: city, units: 'metric', APPID: '74e08c1b6d67c8565e0a0632b512e6f4'});
        },
        weekForecast: function (city) {
            return API('forecast/daily').get({
                q: city,
                units: 'metric',
                APPID: '74e08c1b6d67c8565e0a0632b512e6f4',
                cnt: 7
            });
        }
    }
}]);

app.factory('ip2coords', ['$resource', function ($resource) {

    var API = $resource('http://ip-api.com/json', {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP'}});

    return API.get();

}]);

app.factory("geolocation", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function () {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function () {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function () {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
}]);

app.factory('util', function () {

    var unit = 'c';

    return {
        removeAccentuated: function (str) {
            var accent = [
                /[\300-\306]/g, /[\340-\346]/g, // A, a
                /[\310-\313]/g, /[\350-\353]/g, // E, e
                /[\314-\317]/g, /[\354-\357]/g, // I, i
                /[\322-\330]/g, /[\362-\370]/g, // O, o
                /[\331-\334]/g, /[\371-\374]/g, // U, u
                /[\321]/g, /[\361]/g, // N, n
                /[\307]/g, /[\347]/g // C, c
            ];
            var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

            for (var i = 0; i < accent.length; i++) {
                str = str.replace(accent[i], noaccent[i]);
            }
            return str;
        },
        getUnit: function () {
            return unit;
        },
        setUnit: function (u) {
            unit = u;
        }

    }
});


