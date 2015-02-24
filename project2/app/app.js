'use strict';

var socket = io.connect('http://localhost:8080');

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view2'});
}]);

socket.on('userlist', function(userlist){
    console.log(userlist);
});

angular.module("myApp").controller("HomeController", function($scope, $rootScope, $location){
    $scope.newuser = function(){
        socket.emit('adduser', $scope.name, function(success){
            if(success){
                // user succesfuly added
                var joinObj = {};
                joinObj.room = 'lobby';
                joinObj.pass = '';
                socket.emit('joinroom', joinObj, function (success) {
                    if(success){
                        console.log("joined room");
                        $location.path('/view1');
                    }
                });

            }else{
                // respond to username already existing
                $scope.validName = {color: 'red'};
            }
        });
    }
});