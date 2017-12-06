var angular = require('angular');
require('angular-xeditable');
require('angular-datatables');
require('datatables');
require('datatables-buttons');
require('angular-route');
require('../profileForm/profileForm.js');
require('../profileForm/profileService.js');

//require('font-awesome');

var app = angular.module('ADFinder.dashboard', ['xeditable', 'ngRoute','datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'ADFinder.profile']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'dashboardCtrl'
    });
}]);

app.controller('dashboardCtrl', function($rootScope, $scope, $location, $resource, $http, $q, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, profileService) {

    $rootScope.addNavBar = function() {
        return 'navbar/navbar.html';
    }

    $rootScope.addSideBar = function() {
        return 'sidebar/sidebar.html';
    }

    if(!localStorage.getItem('access_token')) {
        $location.path('/login');
    }
    
    var tableData;

    var deferred = $q.defer();

    var vm = this;
    vm.handleClick = handleClick;

    vm.dtColumns = $resource('/api/v1/users/common').query().$promise;

    vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function() {
            return $http
                .get('/api/v1/users')
                .then(function(response) {
                    return response.data.users;
                });
        })
        .withPaginationType('simple_numbers')
        .withOption('rowCallback', rowCallback)
        .withButtons([
            'columnsToggle',
            'print',
            'excel'
        ])
        .withBootstrap()
        .withBootstrapOptions({
            TableTools: {
                classes: {
                    container: 'btn-group',
                    buttons: {
                        normal: 'btn btn-danger'
                    }
                }
            },
            ColVis: {
                classes: {
                    masterButton: 'btn btn-primary'
                }
            },
            pagination: {
                classes: {
                    ul: 'pagination pagination-sm'
                }
            }
        });

    // vm.dtColumns = [
    //     DTColumnBuilder.newColumn('SAMAccountName').withTitle('Account name'),
    //     DTColumnBuilder.newColumn('FirstName').withTitle('First name'),
    //     DTColumnBuilder.newColumn('LastName').withTitle('Last name'),
    //     DTColumnBuilder.newColumn('Email').withTitle('Email'),
    //     DTColumnBuilder.newColumn('LastLogon').withTitle('LastLogon').notVisible(),
    //     DTColumnBuilder.newColumn('Group').withTitle('Group').notVisible()
    // ];


    function handleClick(info) {
        profileService.addProfileEmail(info._id);
    }

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
            $scope.$apply(function() {
                vm.handleClick(aData);
            });
        });
        return nRow;
    }
});