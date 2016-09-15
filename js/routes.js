app.config(['$routeProvider', function($routeProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'MainController'
    })

    .when('/:city', {
        templateUrl: 'pages/home.html',
        controller: 'CityController'
    })

    .otherwise({redirectTo: '/'});


}]);