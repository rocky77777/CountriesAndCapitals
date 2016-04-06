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
	
})
.controller('CountriesCtrl', ['$scope', '$http', function($scope, $http) {

	var url = "http://api.geonames.org/countryInfoJSON?username=billh";
	$http.get(url, { cache: true })
	// .then(handleSuccess, handleError)
	.then(function(result) {
		$scope.countries = result.data.geonames;
		// console.log($scope.countries);
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
			// $scope.neighbors = "http://api.geonames.org/neighbours?geonameId="+$scope.data.geonameId+"&username=billh";
			// console.log($scope.data);
			// console.log($route.current.params.country);
			geonameID = $scope.data.geonameId;
			// console.log(geonameID);
			$http.get("http://api.geonames.org/neighboursJSON?geonameId="+geonameID+"&username=billh")
			.then(function(neighbourResult) {
				$scope.neighbourData = neighbourResult;
				console.log(neighbourResult);
				// console.log($scope.neighbourData.data.geonames.length);
				$scope.neighbourCount = $scope.neighbourData.data.geonames.length;
				console.log($scope.neighbourData.data.geonames);
				$scope.neighbours = $scope.neighbourData.data.geonames;
				// $scope.neighbourList = $scope.neighborData.data.geonames;
				// var neighbourList = [];

				//make a for loop that loops through data.geonames and pushes 
				//each geoname[0].toponymName, [1].toponymName, etc. onto neighbourList

				// console.log($scope.neighbourData.data.geonames[11].toponymName);

				// for(var i = 0; i < $scope.neighbourCount; i++) {
				// 		neighbourList.push($scope.neighbourData.data.geonames[i].toponymName);
				// }
				// console.log(neighbourList);
				// $scope.neighbourList = neighbourList;
			})
		});

		// $http.get("http://api.geonames.org/neighbours?geonameId="+$scope.data.geonameId+"&username=billh")
		// .then(function(result) {
		// 	$scope.neighborData = neighborResult;
		// 	console.log(neighborResult);
	}
])



;