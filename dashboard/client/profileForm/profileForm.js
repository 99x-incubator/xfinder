var angular = require('angular');

require('angular-route');
require('sweetalert');

var app = angular.module('ADFinder.profile', ['ngRoute', 'ngResource'])

require('./profileService.js');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile', {
        templateUrl: 'profileForm/profileForm.html',
        controller: 'profileFormCtrl'
    });
}]);

app.controller('profileFormCtrl', ['$scope', '$http', '$location', 'profileService', function($scope, $http, $location, profileService) {
    var email = profileService.getProfileEmail();
    $scope.edtVisibility = false;
    $scope.saveBtnVisibility = true;
    $scope.typeTextVisibility = true;
    $scope.typeTemplateVisibility = true;
    $scope.selection = "text field";
    $scope.templateNames = [];
    $scope.loadedTemplateOptions = [];
    $scope.loadedCommonTemplateOptions = [];
    $scope.templateId = 0;

    var templates = [];
    var templateToLoad = [];

    var config = {
       headers: {
            'auth-token': access_token
       }
    };

    $scope.invoke = function(templateId, fieldName) {
        if($scope.loadedTemplateOptions.length !== 0) {
            $scope.loadedTemplateOptions.push(profileService.getTemplate(templateId, $scope.specFields, fieldName));
        }
        else {
            $http.get('/api/v1/templates', config)
                .then(function(response) {
                    console.error('invoking ....', fieldName);
                    profileService.addTemplates(response.data.templates);
                    $scope.loadedTemplateOptions.push(profileService.getTemplateForSpecialFields(templateId, $scope.specFields, fieldName));
                }, function(err) {
                    console.log(err);
                });
        }
    }

    $scope.invokeCommon = function(templateId, fieldName) {
        if($scope.loadedCommonTemplateOptions.length !== 0) {
            $scope.loadedCommonTemplateOptions.push(profileService.getTemplate(templateId, $scope.commonSpecFields, fieldName));
        }
        else if($scope.loadedCommonTemplateOptions.length === 0) {
            $http.get('/api/v1/templates', config)
                .then(function(response) {
                    profileService.addTemplates(response.data.templates);
                    $scope.loadedCommonTemplateOptions.push(profileService.getTemplate(templateId, $scope.commonSpecFields, fieldName));
                }, function(err) {
                    console.log(err);
                });
        }
    }

    $http.get('/api/v1/template').then(function(response) {
        response.data.names.map(function(template) {
            $scope.templateNames.push(template);
        });
    }).catch(function(err) {
        console.log('err', err);
    });

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

    $scope.$watch('templateId', function() {
        console.log($scope.templateId);
    });

    var _id = null;
    var fieldsSpec = null;
    $scope.commonSpecFields = [];

    if(email == undefined) {
        $location.path('/dashboard');
    }
    else {
        var access_token = localStorage.getItem('access_token');
        
        $http.get('/api/v1/user?_id=' + email, config)
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
    }

    $scope.enableEditing = function() {
        $scope.edtVisibility = false;
        $scope.saveBtnVisibility = true;
    }

    $scope.cancelEditing = function() {
        $scope.edtVisibility = true;
        $scope.saveBtnVisibility = false;
    } 
    
    $scope.viewHistory = function() {
        $location.path('proHistory');
    }
    
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

    $scope.saveChanges = function() {
        var userData = {};
        var specData = {};
        var specCommonData = {};

        userData['_id'] = _id;
        var tempCount = 0;
        for(var val in $scope.fields) {
            if(tempCount <= 4) {
                
                userData[val] = document.getElementById(val).value;
                tempCount++;
            } else {
                console.log('breaking .......');
                break;
            }
        }


        for(var val in $scope.commonSpecFields) {
            var el = document.getElementById($scope.commonSpecFields[val]['key']);
            if(el.type == 'text') {
                specCommonData[$scope.commonSpecFields[val]['key']] = el.value;
            } else {
                specCommonData[$scope.commonSpecFields[val]['key']] = el.selectedIndex;
            }
        }

        for(var val in $scope.specTextFields) {
            console.log('text values', $scope.specTextFields);
            var el = document.getElementById($scope.specTextFields[val]['name']);
            if($scope.specTextFields[val]['data']['type'] == 'text') {
                specData[$scope.specTextFields[val]['name']] = el.value;
            }
        }

        for(var val in $scope.specDropDownFields) {
            var el = document.getElementById($scope.specDropDownFields[val]['name']);
            specData[$scope.specDropDownFields[val]['name']] = el.selectedIndex;
        }
        
        //commented possible termination ...
        // userData['fields'] = specData;
        var requestObj = {
            userData: userData,
            specCommonData: specCommonData,
            specData: specData
        }
        
        var access_token = localStorage.getItem('access_token');
        var config = {
           headers: {
                'auth-token': access_token
           }
        };
        
        $http.put('/api/v1/user', requestObj, config).then(function(response) {
            if(response.status === 200 && response.statusText === "OK") {
                swal("Successfully saved", "Your changes have been saved !", "success");
                $scope.edtVisibility = true;
                $scope.saveBtnVisibility = false;
            }
        }, function(err) {
            console.log('error', err);
        });
    }  
  
    $scope.addField = function() {
        var field = $scope.field;
        var fieldStatus = null;
        var fieldType = null;
        if($scope.typeTextVisibility == true) {
            fieldStatus = $scope.fieldValue;
            fieldType = "text";
        }
        else {
            fieldStatus = $scope.template;
            fieldType = "template";
        }
        var newFields = {};
        
        newFields['_id'] = _id;
        newFields['field'] = field;
        newFields['value'] = fieldStatus;
        newFields['type'] = fieldType;

        $http.post('/api/v1/fields', newFields).then(function(response) {
            if(response.status === 200 && response.statusText === "OK") {
                swal("Successfully saved", "Your changes have been saved !", "success");
                $scope.edtVisibility = true;
                $scope.saveBtnVisibility = false;
            }
        }, function(err) {
            console.log('error', err);
        });
    }
}]);