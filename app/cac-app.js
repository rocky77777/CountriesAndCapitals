var app = angular.module('cacApp', ['ngRoute'])
app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'home.html',
		controller : 'HomeCtrl'
	})
	.when('/countries/:country', {
		templateUrl : 'country.html',
		controller : 'CountryCtrl',
		resolve : {
			data: function($route, $routeParams, $http, $q) {
				var deferred = $q.defer();
				var url = "http://api.geonames.org/countryInfoJSON?username=billh&country=" 
				+ $route.current.params.country;

				var obj = {};
				
				$http.get(url)
				.then(function(result) {
					obj.data = result.data.geonames[0];
					obj.flag = "http://www.geonames.org/flags/x/" + obj.data.countryCode.toLowerCase() + ".gif";
					obj.map = "http://www.geonames.org/img/country/250/"+obj.data.countryCode+".png";
					// geonameID = $scope.data.geonameId;
					$http.get("http://api.geonames.org/neighboursJSON?geonameId="+obj.data.geonameId+"&username=billh")
					.then(function(neighbourResult) {
						obj.neighbourData = neighbourResult;
						
						obj.neighbours = obj.neighbourData.data.geonames;
						obj.neighbourCount = obj.neighbours.length;

						deferred.resolve(obj);
					})
				})

				return deferred.promise;
			}
		}
	})
	.when('/countries', {
		templateUrl : 'countries.html',
		controller : 'CountriesCtrl',
		resolve : {
			data: function($http, $q, $timeout) {
				var deferred = $q.defer();

				var url = "http://api.geonames.org/countryInfoJSON?username=billh";
				$http.get(url)
				.then(function(result) {
					$timeout(function() {
						deferred.resolve(result.data.geonames);
					}, 500);
				});

				return deferred.promise;
			}
		}
	})
	.otherwise({
		redirectTo : '/'
	});
})
.directive('loadingIndicator', function() {
	return {
		template : '<img src="loading-animation.gif" />',
		restrict : 'E',
		link : function(scope, elem, attrs) {
			scope.$on('load-start', function() {
				elem.css({'display': 'block'});
			});

			scope.$on('load-end', function() {
				elem.css({'display' : 'none'});
			});
		}
	}
})
.controller('HomeCtrl', function($scope) {
	//
})
.controller('CountriesCtrl', function($scope, data) {
	$scope.countries = data;
})
.controller('CountryCtrl', 
	function( $scope, data) {
		$scope.data = data.data;
		$scope.neighbourCount = data.neighbourCount;
		$scope.neighbours = data.neighbours;
		$scope.map = $scope.map;
		$scope.flag = data.flag;
	})
.run(function($rootScope, $location, $timeout) {
	$rootScope.$on('$routeChangeError', function() {

	});
	$rootScope.$on('$routeChangeStart', function() {
		$rootScope.$broadcast('load-start');
		console.log('load-start');
	});
	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.$broadcast('load-end');
		console.log('load-end');
	});
});