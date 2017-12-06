var angular = require('angular');

require('angular-route');
require('sweetalert');

var app = angular.module('ADFinder.templates', ['ngRoute', 'ngResource'])

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/settings/templates', {
        templateUrl: 'settings/templates/templates.html',
        controller: 'templatesCtrl'
    });
}]);

app.controller('templatesCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    if(!localStorage.getItem('access_token')) {
        $location.path('/login');
    }

    $scope.templateFields = [{ optionName: '' }];

    $scope.add = function() {
        $scope.templateFields.push({
            optionName: ''
        });
    }

    $scope.remove = function() {
        var length = $scope.templateFields.length;
        $scope.templateFields.splice(--length, length);
    }

    $scope.saveChanges = function(values) {
        var els = document.getElementsByClassName("options");
            
        var templateName = $scope.templateName;
        console.log($scope.option);
        if(templateName === undefined) {
            $scope.error = true;
            return;
        }

        var opts = [];

        if(els.length === 0) {
            $scope.err = "please add options";
            return;
        } else {
            for(a=0; a<els.length; a++) {
                if(els[a].value === undefined) {
                    $scope.error = true;
                    return;   
                }
                opts.push(els[a].value);
            }
        }

        var access_token = localStorage.getItem('access_token');
        var config = {
           headers: {
                'auth-token': access_token
           }
        };

        var reqObj = {
            name: $scope.templateName,
            options: opts
        };

        $http.post('/api/v1/template', reqObj, config)
            .then(function(response) {
                if(response.data.state === true) {
                    swal("Successfully saved", "Your changes have been saved !", "success");
                    $scope.templateName = "";
                    for(a=0; a<els.length; a++) {
                        els[a].value = "";
                    }
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}]);
