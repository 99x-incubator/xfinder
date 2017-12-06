var app = angular.module('ADFinder.profile');
    
app.service('profileService', function ($location) {
    var email;
    var templates;

    var addProfileEmail = function(iemail) {
        email = iemail;        
        $location.path('/profile');
    };

    var getProfileEmail = function(){
        return email;
    };

    var addTemplates = function(itemplates) {
        templates = itemplates;
    }

    var getTemplate = function(templateId, specFields, fieldName) {
        var optionList = null;
        templates.filter(function(template, index) {
            var selectedIndex = 1;
            if(template._id === templateId) {
                if(template.options.length !== 0) {
                    for(var val in specFields) {
                        for(var val in specFields) {
                            if(specFields[val]['values']['value'] == templateId && fieldName === specFields[val]['key']) {
                                selectedIndex = specFields[val]['values']['selected'];
                            }
                        }
                    }
                    optionList = {
                        options: template.options,
                        selected: selectedIndex
                    };
                }
            } else {
                return;
            }
        });
        return optionList;
    }

    var getTemplateForSpecialFields = function(templateId, specFields, fieldName) {
        var optionList = null;
        templates.filter(function(template, index) {
            var selectedIndex = 1;
            if(template._id === templateId) {
                if(template.options.length !== 0) {
                    for(var val in specFields) {
                        if(specFields[val]['value'] == templateId && fieldName === val) {
                            selectedIndex = specFields[val]['selected'];
                        }
                    }
                    optionList = {
                        options: template.options,
                        selected: selectedIndex
                    };
                }
            } else {
                return;
            }
        });
        return optionList;
    }

    return {
        addProfileEmail: addProfileEmail,
        getProfileEmail: getProfileEmail,
        addTemplates: addTemplates,
        getTemplate: getTemplate,
        getTemplateForSpecialFields: getTemplateForSpecialFields
    };
});