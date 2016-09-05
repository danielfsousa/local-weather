app.controller('CityController', ['$scope', '$routeParams', '$interval', '$location', 'weather', 'util', function($scope, $routeParams, $interval, $location, weather, util) {

    function renderCurrentWeatherByCity(data) {
        weather.weekForecast(data.name).$promise.then(renderWeekForecast, error);

        var temp = Math.round(data.main.temp);

        if($scope.unit === 'f') {
            $scope.temp = Math.round((temp * (9 / 5)) + 32);
        } else {
            $scope.temp = temp;
        }

        $scope.city = data.name;
        $scope.weather = data.weather[0].main.toLowerCase();
    }

    function renderWeekForecast(data) {
        $scope.days = [];

        var round = function(minMax) {
            var temp = Math.round(minMax);
            if($scope.unit === 'f') {
                return Math.round((temp * (9 / 5)) + 32);
            } else {
                return temp;
            }
        };

        data.list.forEach(function(obj, index) {
            $scope.days.push({
                date: new Date().addDays(index),
                min: round(obj.temp.min),
                max: round(obj.temp.max),
                weather: obj.weather[0].main.toLowerCase()
            });
        });

        $scope.loadComplete = true;
    }

    function error(err) {
        console.log("Your Location could not be determined." + err);
        $scope.error = true;
        $interval(function () {
            $scope.error = false;
            $location.path('/');
        }, 3000);
    }

    $scope.celsiusToF = function () {
        if ($scope.unit === 'c') {
            $scope.temp = Math.round(($scope.temp * (9 / 5)) + 32);
            $scope.days.forEach(function (day) {
                day.min = Math.round((day.min * (9 / 5)) + 32);
                day.max = Math.round((day.max * (9 / 5)) + 32);
            });
            $scope.unit = 'f';
            util.setUnit('f');
        }
    };

    $scope.fahrenheitToC = function () {
        if ($scope.unit === 'f') {
            $scope.temp = Math.round(($scope.temp - 32) * (5 / 9));
            $scope.days.forEach(function (day) {
                day.min = Math.round((day.min - 32) * (5 / 9));
                day.max = Math.round((day.max - 32) * (5 / 9));
            });
            $scope.unit = 'c';
            util.setUnit('c');
        }
    };

    $scope.$watch('search', function (newValue, oldValue) {
        if(newValue) {
            $scope.search = util.removeAccentuated(newValue);
        }
    });

    $scope.goCity = function () {
        $location.path($scope.search);
    };

    $scope.unit = util.getUnit();

    weather.city($routeParams.city).$promise.then(renderCurrentWeatherByCity, error);

}]);