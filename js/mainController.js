// =================
//   CONTROLLERS
// =================

//TODO: add SSL to support html geolocation
//TODO: join and minify files

app.controller('MainController', ['$scope', '$location', 'geolocation', 'weather', 'ip2coords', 'util', function ($scope, $location, geolocation, weather, ip2coords, util) {

    function loadImages() {
        var first = new Image();
        var img1 = new Image();
        var img2 = new Image();
        var img3 = new Image();
        var img4 = new Image();
        var img5 = new Image();
        var img6 = new Image();
        var img7 = new Image();

        first.src = 'img/' + $scope.weather + '.jpg';

        $scope.loadComplete = true;

        img1.src = 'img/clear.jpg';
        img2.src = 'img/clouds.jpg';
        img4.src = 'img/rain.jpg';
        img3.src = 'img/thunderstorm.jpg';
        img5.src = 'img/snow.jpg';
        img6.src = 'img/drizzle.jpg';
        img7.src = 'img/atmosphere.jpg';

    }

    function renderCurrentWeatherByCoords(data) {
        weather.weekForecast(data.list[0].name).$promise.then(renderWeekForecast, error);

        var temp = data.list[0].main.temp;

        if($scope.unit === 'f') {
            $scope.temp = Math.round((temp * (9 / 5)) + 32);
        } else {
            $scope.temp = Math.round(temp);
        }

        $scope.city = data.list[0].name;
        $scope.weather = data.list[0].weather[0].main.toLowerCase();
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

        loadImages();

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

    ip2coords.$promise.then(function (coords) {
        if (coords && coords.status === 'success') {
            weather.find(coords.lat, coords.lon).$promise.then(renderCurrentWeatherByCoords, error);
        }

        // geolocation().then(function (position) {
        //     var latitude = position.coords.latitude;
        //     var longitude = position.coords.longitude;
        //     weather.find(latitude, longitude).$promise.then(renderCurrentWeatherByCoords, error);
        // }, error);
    }, error);

}]);
