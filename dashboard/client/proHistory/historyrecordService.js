var app = angular.module('ADFinder.profile');
    
app.service('historyrecordService', function ($location) {
    var _id;

    var addRecordId = function(__id) {
        _id = __id;
    };

    var getRecordId = function(){
        return _id;
    };

    return {
        addRecordId: addRecordId,
        getRecordId: getRecordId
    };
});