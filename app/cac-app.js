var app = angular.module('cacApp', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'home.html',
		controller : 'HomeCtrl'
	})
	.when('/countries/:country', {
		templateUrl : 'country.html',
		controller : 'CountryCtrl'
	})
	.when('/countries', {
		templateUrl : 'countries.html',
		controller : 'CountriesCtrl'
	});
}])
.controller('HomeCtrl', function($scope) {
	$scope.greeting = "Hi from HomeCtrl";
})
.controller('CountryCtrl', function($scope, $routeParams) {
	$scope.greeting = "Hi from CountryCtrl";
	$scope.country = $routeParams.country;
})
.controller('CountriesCtrl', function($scope) {
	$scope.greeting = "Hi from CountriesCtrl";
});