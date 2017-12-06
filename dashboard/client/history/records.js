var angular = require('angular');

require('angular-route');

require('../profileForm/profileService.js');
require('../proHistory/historyrecordService.js');

var app = angular.module('ADFinder.records', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/record', {
        templateUrl: 'history/record.html',
        controller: 'recordCtrl'
    });
}]);

app.controller('recordCtrl', ['$rootScope', '$scope', '$location', '$http', 'historyrecordService', function($rootScope, $scope, $location, $http, historyrecordService) {
    var _id = historyrecordService.getRecordId();

    var access_token = localStorage.getItem('access_token');
    var config = {
       headers: {
            'auth-token': access_token
       }
    };
    
    $scope.edtVisibility = true;
    $scope.saveBtnVisibility = false;

    $scope.options = [
        {
            name: true,
            value: true
        },
        {
            name: false,
            value: false
        }
    ];

    var access_token = localStorage.getItem('access_token');
    
    var config = {
       headers: {
            'auth-token': access_token
       }
    };

    $http.get('/api/v1/user/spechistory?_id=' + _id, config)
        .then(function(res) {
            console.log(res);
            var user  = res.data.history;
            var fields = user.fields.userData;
            $scope.specFields = user.fields.specData;

            var fieldsSvr = {};
            for(var val in fields) {              
                if(val != '_id') {
                    fieldsSvr[val] = fields[val];
                }
            }
            return fieldsSvr;
        }, function(err) {
            console.log('error', err);
        }).then(function(fieldsSvr) {
            $scope.fields = fieldsSvr;             
        });
}]);