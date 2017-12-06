var angular = require('angular');

require('angular-route');

require('../profileForm/profileService.js');
require('./historyrecordService.js');

var app = angular.module('ADFinder.historyProfile', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/spechistory', {
        templateUrl: 'proHistory/history.html',
        controller: 'historyProfileCtrl'
    });
}]);

app.controller('historyProfileCtrl', function($rootScope, $scope, $location, $http, historyrecordService) {
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

    $http.get('/api/v1/user' + _id, config)
        .then(function(res) {
                var user  = res.data.user;
                $scope.specFields = res.data.fields[0];

                console.log('user data <<<<<<<<<<<<<<<<<<<<');
                console.log(res);
                console.log('spec fields');
                console.log($scope.specFields);

                $scope.specTextFields = [];
                $scope.specDropDownFields = [];

                for(var val in $scope.specFields) {
                    var tempObj = {};
                    if($scope.specFields[val]['type'] == 'text') {
                        tempObj['name'] = val;
                        tempObj['data'] = $scope.specFields[val];
                        $scope.specTextFields.push(tempObj);
                    } else {
                        tempObj['name'] = val;
                        tempObj['data'] = $scope.specFields[val];
                        $scope.specDropDownFields.push(tempObj);
                    }
                }
                
                var fieldsSvr = {};
                
                for(var val in user[0]) {              
                    if(val != '_id') {
                        if(user[0][val].common) {
                            $scope.commonSpecFields.push({
                                key: val,
                                values: user[0][val]
                            });
                        } else {
                            fieldsSvr[val] = user[0][val];
                        }
                    } else {
                        _id = user[0][val];
                    }
                }
                return fieldsSvr;
            }, function(err) {
                console.log('error', err);
            }).then(function(fieldsSvr) {
                $scope.fields = fieldsSvr;
            });

});