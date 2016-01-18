angular.module('theShowApp', ['theShowApp.common'])
    .controller("playerCtrl", function (playerModel, $scope) {

        var vm = this;
        $scope.exemptedPlayers = {};
        vm.paternity = [];
        vm.bereavement = [];

        vm.successResponse = function() {
            toastr.success('Your request was successful', 'GOOD JOBBBBBB');
        };

        vm.failedResponse = function() {
            toastr.error('Your request was unsuccessful', 'SUBMIT');
        };

        vm.runExemptedPlayers = function() {
            return playerModel.runExemptedPlayers(vm.rosteredPlayers, vm.paternity, vm.bereavement);
        };

        vm.removePlayer = function (player) {
            var playerIndex = vm.rosteredPlayers.indexOf(player);
            vm.rosteredPlayers.splice(playerIndex, 1);
        };

        var userName = vm.username;

        vm.getTeam = function() {
             return playerModel.get(userName, vm).then(function(data) {
                 vm.successResponse();
            }).catch(function(err) {
                 vm.failedResponse();
            });
        };

        vm.addTeam = function() {
            return playerModel.add(vm).then(function() {
                vm.successResponse();
            }).catch(function(err) {
                vm.failedResponse();
            })
        };

        vm.submitTeam = function() {
            return playerModel.submit(vm).then(function() {
                vm.successResponse();
            }).catch(function(err) {
                vm.failedResponse();
            })
        };

    }).controller('editPlayer', function(playerModel, $scope, $http) {
        var ep = this,
            vm = $scope.vm;

        ep.enter = function () {
            return playerModel.enterPlayer(ep,vm);
        };

    }).controller('teamCtrl', function ($scope, $http) {
        $scope.chosenTeam = [];

        $scope.removePlayer = function (player) {
            var playerIndex = $scope.chosenTeam.indexOf(player);
            $scope.chosenTeam.splice(playerIndex, 1);
        };

        $scope.enter = function () {
            var teamLength = $scope.chosenTeam.length;
            for (var i = 0; i < teamLength; i++) {
                if ($scope.team.player === $scope.chosenTeam[i]) {
                    return false;
                }
            }
            $scope.chosenTeam.push($scope.team.player);
            $scope.team.player = '';
        };

    });
