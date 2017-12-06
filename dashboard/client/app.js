var angular = require('angular');

require('angular-resource');
require('angular-route');
require('./login/login.js');
require('./dashboard/dashboard.js');
require('./proHistory/proHistory.js');
require('./proHistory/history.js');
require('./history/history.js');
require('./history/records.js');
require('./settings/settings.js');
require('./help/help.js');

//require('./proHistory/proHistory.js');

var app = angular.module('ADFinder', ['ngRoute', 'ADFinder.login', 'ADFinder.proHistory', 'ADFinder.dashboard', 'ADFinder.history', 'ADFinder.records', 'ADFinder.historyProfile', 'ADFinder.help', 'ADFinder.settings', 'ngResource']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {


}]);

app.controller('indexCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
	$rootScope.isLoggedIn = false;

	if(!localStorage.getItem('access_token')) {
		$location.path('/login');
	}
	else {
		$rootScope.isLoggedIn = true;
	}

	$scope.addSideBar = function() {
		return './sidebar/sidebar.html';
	}

	$rootScope.logout = function() {
		$rootScope.isLoggedIn = false;
		localStorage.removeItem('access_token');
        $location.path('login'); 
 	}

	$scope.goBack = function() {
		window.history.back();
	}
}]);