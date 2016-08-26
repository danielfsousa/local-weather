// =================
//   SERVICES
// =================
app.factory('weather', ['$resource', function($resource) {

    var API = function(method) {
        return $resource('http://api.openweathermap.org/data/2.5/' + method, { callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } });
    };

    return {
        find: function(latitude, longitude, units, callback) {
            API('find').get({ lat: latitude, lon: longitude, units: units, APPID: '74e08c1b6d67c8565e0a0632b512e6f4', cnt: 1 }).$promise.then(callback);
        },
        city: function (city, units, callback) {
            API('weather').get({ q: city, units: units, APPID: '74e08c1b6d67c8565e0a0632b512e6f4' }).$promise.then(callback);
        }
    }

}]);

app.factory("geolocation", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
}]);


