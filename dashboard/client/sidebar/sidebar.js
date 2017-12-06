 var angular = require('angular');

 require('angular-resource');
 require('angular-route');

 var app = angular.module('ADFinder', ['ngRoute', 'ngResource']);

 // app.directive("sidebarPanel", function(){
 //     return{
 //         restrict: 'E',
 //         templateUrl: "sidebar.html"
 //     };
 // });

app.controller('sidebarCtrl', function($rootScope, $scope, $http) {
	this.isLoggedIn = $rootScope.isLoggedIn;
});