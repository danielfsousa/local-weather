// =================
//   CONTROLLERS
// =================
app.controller('MainController', ['$scope', 'geolocation', 'weather', function($scope, geolocation, weather) {

    geolocation().then(function (position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);

        weather.find(latitude, longitude, 'metric', function(data) {
            $scope.city = data.list[0].name;
            $scope.weather = data.list[0].weather[0].main.toLowerCase();
            $scope.temp = data.list[0].main.temp + 'º';
            $scope.loadComplete = true;
        });

        weather.city('Brasilia', 'metric', function(data) {
            $scope.cidade2 = data.name;
        });


    }, function (reason) {
        console.log("Your location could not be determined." + reason);
    });

}]);
