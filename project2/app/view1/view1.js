'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function () {
}]);



angular.module('myApp').controller('ChatCtrl', function ($scope) {
    $scope.chatbox = '';
    socket.emit('rooms');

    $scope.options = [
        {label: 'lobby', value: 'lobby'}

    ];

    $scope.roomlist = $scope.options[0];

    $scope.newRoom = function(){
        console.log('creating room ' + $scope.roomName);
        if($scope.roomName != ''){
            var joinObj = {};
            joinObj.room = $scope.roomName;
            joinObj.pass = '';
            socket.emit('joinroom', joinObj, function (success, reason) {
                if(success){
                    console.log("new room created");
                }else{
                    console.log("creation failed: " + reason)
                }
            });
        }
    };

    socket.on('updatechat', function( roomName, msgHistory){
        console.log('message succesfuly sent');
        if(roomName === 'lobby'){
            $scope.chatbox = '';
            for(var i = 0; i < msgHistory.length; i++){
                $scope.chatbox += msgHistory[i].nick + ': ' + msgHistory[i].message + '\n';
            }
        }
        $scope.$apply();
    });

    socket.on('roomlist', function(roomlist){
        console.log(roomlist);
        $scope.options = roomlist;
    });

    $scope.comment = function () {
        var data = {};
        data.roomName = 'lobby';
        data.msg = $scope.msg;
        socket.emit('sendmsg', data);
        $scope.msg = '';
    }
});