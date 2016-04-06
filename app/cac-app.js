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
	})
	.otherwise({
		redirectTo : '/'
	});
}])
.controller('HomeCtrl', function($scope) {
	//
})
.controller('CountriesCtrl', ['$scope', '$http', function($scope, $http) {
	var url = "http://api.geonames.org/countryInfoJSON?username=billh";
	$http.get(url, { cache: true })
	.then(function(result) {
		$scope.countries = result.data.geonames;
	});
}])
.controller('CountryCtrl', ['$route', '$scope', '$routeParams', '$http', 
	function($route, $scope, $routeParams, $http) {
		var url = "http://api.geonames.org/countryInfoJSON?username=billh&country=" 
		+ $route.current.params.country;
		var geonameID = "";
		$http.get(url)
		.then(function(result) {
			$scope.data = result.data.geonames[0];
			$scope.flag = "http://www.geonames.org/flags/x/" + $scope.data.countryCode.toLowerCase() + ".gif";
			$scope.map = "http://www.geonames.org/img/country/250/"+$scope.data.countryCode+".png";
			geonameID = $scope.data.geonameId;
			$http.get("http://api.geonames.org/neighboursJSON?geonameId="+geonameID+"&username=billh")
			.then(function(neighbourResult) {
				$scope.neighbourData = neighbourResult;
				$scope.neighbourCount = $scope.neighbourData.data.geonames.length;
				$scope.neighbours = $scope.neighbourData.data.geonames;
			})
		})
	}])
.run(function($rootScope, $location, $timeout) {
	$rootScope.$on('$routeChangeError', function() {
		$location.path("/error");
	});
	$rootScope.$on('$routeChangeStart', function() {
		$rootScope.isLoading = true;
	});
	$rootScope.$on('$routeChangeSuccess', function() {
		$timeout(function() {
			$rootScope.isLoading = false;
		}, 1500);
	});
});