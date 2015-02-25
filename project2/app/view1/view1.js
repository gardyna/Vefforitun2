'use strict';

/*
Known bug: site won't update until it recieves input
 */

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function () {
}]);



angular.module('myApp').controller('ChatCtrl', function ($scope, $rootScope) {
    $scope.chatbox = '';
    socket.emit('rooms');
    $scope.name = $rootScope.name;
    $scope.curroom = 'lobby';
    $scope.roomlist = {};
    $scope.userlist = [];

    socket.on('userlist', function(userlist){
        $scope.userlist = userlist;
        for(var item in userlist){
            console.log(userlist[item]);
        }
    });

    $scope.joinRoom = function(){
        console.log("changing room");
        var joinObj = {};
        joinObj.room = $scope.roomlis;
        joinObj.pass = '';
        socket.emit('joinroom', joinObj, function(success, reason){
            if(success){
                console.log('joined room');
                $scope.curroom = joinObj.room;
            }else{
                console.log("failed to join room:");
                console.log(reason);
            }
        });
    };

    $scope.newRoom = function(){
        console.log('creating room ' + $scope.roomName);
        if($scope.roomName != ''){
            var joinObj = {};
            joinObj.room = $scope.roomName;
            joinObj.pass = '';
            socket.emit('joinroom', joinObj, function (success, reason) {
                if(success){
                    console.log("new room created");
                    $scope.curroom = joinObj.room;
                }else{
                    console.log("creation failed: " + reason)
                }
            });
        }
    };

    socket.on('updatechat', function( roomName, msgHistory){
        console.log('message succesfuly sent');
        if(roomName === $scope.curroom){
            $scope.chatbox = '';
            for(var i = 0; i < msgHistory.length; i++){
                $scope.chatbox += msgHistory[i].nick + ': ' + msgHistory[i].message + '\n';
            }
        }
        $scope.$apply();
    });

    socket.on('roomlist', function(roomlist){
        for(var i = 0; i < roomlist.length; i++){
            console.log(roomlist[i].roomName);
        }
        $scope.roomlist = roomlist;
    });

    $scope.comment = function () {
        var data = {};
        data.roomName = $scope.curroom;
        data.msg = $scope.msg;
        socket.emit('sendmsg', data);
        $scope.msg = '';
    }


});