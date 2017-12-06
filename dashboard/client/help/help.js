var angular = require('angular');
require('angular-xeditable');
require('angular-datatables');
require('datatables');
require('datatables-buttons');
require('angular-route');
require('../help/help.js');
 
//require('font-awesome');

var app = angular.module('ADFinder.help', ['xeditable', 'ngRoute','datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'ADFinder.profile']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/help', {
        templateUrl: 'help/help.html',
        controller: 'helpCtrl'
    });
}]);
app.controller('helpCtrl', function($rootScope, $scope, $location, $http, DTOptionsBuilder, DTColumnBuilder, profileService) {

    $rootScope.addNavBar = function() {
        return 'navbar/navbar.html';
    }

    $rootScope.addSideBar = function() {
        return 'sidebar/sidebar.html';
    }
    
    var vm = this;
    vm.handleClick = handleClick;

    vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function() {
            return $http
                .get('/api/v1/users')
                .then(function(response) {
                    return response.data.users;
                });
        })
        .withPaginationType('simple_numbers')
        .withButtons([
            'columnsToggle',
            'print',
            'excel'
        ])
        .withOption('rowCallback', rowCallback)
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

    vm.dtColumns = [
        DTColumnBuilder.newColumn('SAMAccountName').withTitle('Account name'),
        DTColumnBuilder.newColumn('FirstName').withTitle('First name'),
        DTColumnBuilder.newColumn('LastName').withTitle('Last name'),
        DTColumnBuilder.newColumn('Email').withTitle('Email'),
        DTColumnBuilder.newColumn('LastLogon').withTitle('LastLogon'),
        DTColumnBuilder.newColumn('Group').withTitle('Group')
    ];

    function handleClick(info) {
        profileService.addProfileEmail(info.Email);
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