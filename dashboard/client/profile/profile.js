// (function() {
//     angular.module('ADFinder.profile', ['xeditable', 'ngRoute','datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap'])
//
//         .config(['$routeProvider', function($routeProvider) {
//             $routeProvider.when('/profileList', {
//                 templateUrl: 'profile/profile.html',
//                 controller: 'profileCtrl'
//             });
//         }])
//
//         .service('profileUser', function ($location) {
//             var email;
//
//             var addProfileEmail = function(iemail) {
//                 email = iemail;
//                 $location.path("/profile");
//             };
//
//             var getProfileEmail = function(){
//                 return email;
//             };
//
//             return {
//                 addProfileEmail: addProfileEmail,
//                 getProfileEmail: getProfileEmail
//             };
//         })
//
//         .controller('profileCtrl', function($scope, $http, DTOptionsBuilder, DTColumnBuilder, profileUser) {
//             var vm = this;
//             vm.someClickHandler = someClickHandler;
//             var clickedUser = profileUser.getProfileEmail();
//
//             vm.dtOptions = DTOptionsBuilder
//                 .fromFnPromise(function() {
//                     return $http
//                         .get('/api/v1/user?email='+clickedUser)
//                         .then(function(response) {
//                             return response.data.user;
//                         });
//                 })
//                 .withPaginationType('simple_numbers')
//                 .withOption('rowCallback', rowCallback)
//                 .withButtons([
//                     'columnsToggle',
//                     'print',
//                     'excel'
//                 ])
//                 .withBootstrap()
//                 .withBootstrapOptions({
//                     TableTools: {
//                         classes: {
//                             container: 'btn-group',
//                             buttons: {
//                                 normal: 'btn btn-danger'
//                             }
//                         }
//                     },
//                     ColVis: {
//                         classes: {
//                             masterButton: 'btn btn-primary'
//                         }
//                     },
//                     pagination: {
//                         classes: {
//                             ul: 'pagination pagination-sm'
//                         }
//                     }
//                 });
//
//             vm.dtColumns = [
//                 DTColumnBuilder.newColumn('SAMAccountName').withTitle('Account name'),
//                 DTColumnBuilder.newColumn('FirstName').withTitle('First name'),
//                 DTColumnBuilder.newColumn('LastName').withTitle('Last name'),
 // DTColumnBuilder.newColumn('Email').withTitle('Email'),
//                 DTColumnBuilder.newColumn('Email').withTitle('Email'),
//                 DTColumnBuilder.newColumn('LastLogon').withTitle('LastLogon'),
//                 DTColumnBuilder.newColumn('Group').withTitle('Group')
//             ];
//
//             function someClickHandler(info) {
//                 console.log(info.Email);
//             }
//
//             function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
//                 $('td', nRow).unbind('click');
//                 $('td', nRow).bind('click', function() {
//                     $scope.$apply(function() {
//                         vm.someClickHandler(aData);
//                     });
//                 });
//                 return nRow;
//             }
//         });
//
// })();