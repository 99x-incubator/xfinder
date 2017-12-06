var angular = require('angular');
require('angular-xeditable');
require('angular-datatables');
require('datatables');
require('datatables-buttons');
require('angular-route');

require('../profileForm/profileService.js');
require('./historyrecordService.js');

var app = angular.module('ADFinder.proHistory', ['xeditable', 'ngRoute','datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/proHistory', {
    templateUrl: 'proHistory/proHistory.html',
    controller: 'proHistoryCtrl'
   });
}]);

app.controller('proHistoryCtrl', ['$rootScope', '$scope', '$location', '$http', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', 'profileService', 'historyrecordService', function($rootScope, $scope, $location, $http, $q, DTOptionsBuilder, DTColumnBuilder, profileService, historyrecordService) {
	var _id = profileService.getProfileEmail();
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
    
    
    var tableData;

    var deferred = $q.defer();


    var vm = this;
    vm.handleClick = handleClick;
    
    vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function() {
            return $http
                .get('/api/v1/user/history?_id=' + _id, config)
                .then(function(response) {
                    console.log('got the response');
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