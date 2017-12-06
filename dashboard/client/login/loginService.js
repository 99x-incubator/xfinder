var angular = require('angular');

var app = angular.module('ADFinder.login');

app.service('loginService', ['$rootScope', '$http','$location', function($rootScope, $http, $location) {
	var login = function(username, password) {
		$http.post('/api/v1/authenticate', { username: username, password: password })
			.then(function(response) {
				if(response.data.state == true && response.data.access_token) {
					localStorage.setItem('access_token', response.data.access_token);
					$rootScope.isLoggedIn = true;
					$location.path('/dashboard');
				} else if(response.data.state == false) {
					$scope.serverError = true;
				}
			})
			.catch(function(err) {
				console.log(err);
			});
	};

	return {
		login: login
	};
}]);
