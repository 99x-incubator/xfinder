var angular = require('angular');

require('angular-route');
require('sweetalert');

require('./templates/templates.js');

var app = angular.module('ADFinder.settings', ['ngRoute', 'ngResource', 'ADFinder.templates']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/settings', {
        templateUrl: 'settings/settings.html',
        controller: 'settingsCtrl'
    });
}]);

app.controller('settingsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    if(!localStorage.getItem('access_token')) {
        $location.path('/login');
    }

    $scope.typeTextVisibility = false;
    $scope.typeTemplateVisibility = false;

    $scope.templateNames = [];

    $http.get('/api/v1/template').then(function(response) {
        response.data.names.map(function(template) {
            $scope.templateNames.push(template);
        });
        console.log($scope.templateNames);
    }).catch(function(err) {
        console.log('err', err);
    });    

    $http.get('/api/v1/mailstatus').then(function(response) {
        var mailStatus = response.data.mail;
        $scope.emailStatus = mailStatus;
    }).catch(function(err) {
        console.log('err', err);
    });

    $scope.templateSelectedValue = function() {
        if($scope.selection === "text field") {
            $scope.typeTextVisibility = true;
            $scope.typeTemplateVisibility = false;
        }
        else {
            $scope.typeTemplateVisibility = true;
            $scope.typeTextVisibility = false;
        }
    }

    $scope.changeMailStatus = function() {
        var access_token = localStorage.getItem('access_token');
        var config = {
           headers: {
                'auth-token': access_token
           }
        };

        var requestObj = {
            mailStatus: $scope.emailStatus
        };

        $http.post('/api/v1/settings/mail', requestObj, config).then(function(response) {
            if(response.status === 200 && response.statusText === "OK") {
                swal("Successfully saved", "Email status changed successfully !", "success");
            }
        }).catch(function(err) {
            //swal({ title: "Error !",   text: "Please try again <span style="color:#F8BB86">changes were not saved !",   html: true });
        });
    }

    $scope.saveChanges = function() {
        console.error($scope.field);
        console.error($scope.fieldValue);
        if($scope.field != undefined) {
            var field = $scope.field;
            var fieldValue = null;
            var fieldType = null;
            console.log($scope.typeTextVisibility);
            if($scope.typeTextVisibility == true) {
                if($scope.fieldValue == undefined) {
                    $scope.error = true;
                    return;
                }
                fieldValue = $scope.fieldValue;
                fieldType = "text";
            }
            else {
                if($scope.template == undefined) {
                    $scope.error = true;
                    return;
                }
                fieldValue = $scope.template;
                fieldType = "template";
            }

            var newField = {};
            
            newField['field'] = field;
            newField['value'] = fieldValue;
            newField['type'] = fieldType;

            console.log('requesting ...', newField);

            var access_token = localStorage.getItem('access_token');
            var config = {
               headers: {
                    'auth-token': access_token
               }
            };

            $http.post('/api/v1/settings/field', newField, config).then(function(response) {
                if(response.status === 200 && response.statusText === "OK") {
                    swal("Successfully saved", "Your changes have been saved !", "success");
                    $scope.field = '';
                    $scope.selection = 0;
                    
                    $scope.typeTextVisibility = false;
                    $scope.typeTemplateVisibility = false;

                    if($scope.error == true) {
                        $scope.error = false;
                    }
                }
            });
        } else {
            $scope.error = true;
        }
    }
}]);
