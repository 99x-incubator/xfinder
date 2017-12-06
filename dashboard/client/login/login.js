var angular = require('angular');

require('angular-route');

var app = angular.module('ADFinder.login', ['ngRoute']);

require('./loginService.js');

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}]);

app.controller('loginCtrl', ['$rootScope', '$scope', '$location', '$http', 'loginService', function($rootScope, $scope, $location, $http, loginService) {
	$scope.serverError = false;

	if(localStorage.getItem('access_token')) {
		$location.path(window.history.back());
	}

	$scope.submit = function() {
		var username = $scope.ad.username;
		var password = $scope.ad.password;
		loginService.login(username, password);
	}
}]);