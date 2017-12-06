var angular = require('angular');
require('angular-xeditable');
require('angular-datatables');
require('datatables');
require('datatables-buttons');
require('angular-route');

require('../proHistory/historyrecordService.js');

var app = angular.module('ADFinder.history', ['xeditable', 'ngRoute','datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'history/history.html',
    controller: 'historyCtrl'
   });
}]);

app.controller('historyCtrl', ['$rootScope', '$scope', '$location', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', 'historyrecordService', function($rootScope, $scope, $location, $http, DTOptionsBuilder, DTColumnBuilder, historyrecordService) {
	var access_token = localStorage.getItem('access_token');
	var config = {
	   headers: {
	        'auth-token': access_token
	   }
	};


    $rootScope.addNavBar = function() {
        return 'navbar/navbar.html';
    }

    $rootScope.addSideBar = function() {
        return 'sidebar/sidebar.html';
    }
    
    $rootScope.addBack = function() {
        return 'back/back.html';
    }

    var vm = this;
    vm.handleClick = handleClick;

    vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function() {
            return $http
                .get('/api/v1/history', config)
                .then(function(response) {
                    console.log(response);
                    return response.data.history;
                });
        })
        .withPaginationType('simple_numbers')
        .withOption('rowCallback', rowCallback)
        .withButtons([
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

    vm.dtColumns = [
        DTColumnBuilder.newColumn('loggedin').withTitle('Logged user'),
        DTColumnBuilder.newColumn('time').withTitle('Time')
    ];

    function handleClick(info) {
        historyrecordService.addRecordId(info._id);
        $location.path('/spechistory');
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
}]); 