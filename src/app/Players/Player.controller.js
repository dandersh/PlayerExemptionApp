(function() {
    'use strict';

    var showApp = angular.module('theShowApp.Players');

    showApp.controller('PlayerController', PlayerController);

    PlayerController.inject = ['PlayerDataFactory', 'PlayerService'];

    function PlayerController(PlayerDataFactory, PlayerService) {
        var vm = this;
        vm.paternity = [];
        vm.bereavement = [];

        function checkData(response) {
            var data = response;
            if (data === null) {
                throw new Error('No Data');
            }
        }

        function setRosteredPlayers(response) {
            var data = response;
            vm.username = data.username;
            vm.team = data.team;
            vm.rosteredPlayers = data.players.slice(0,1)[0] || [];
            vm.paternity = data.players.slice(1,2)[0] || [];
            vm.bereavement = data.players.slice(2,3)[0] || [];
            return vm;
        }

        function successfulResponse() {
            return toastr.success('Your request was successful', 'GOOD JOBBBBBB');
        }

        function errorResponse() {
            return toastr.error('Your request failed', 'Fail Whale');
        }

        vm.runExemptedPlayers = function() {
            return PlayerService.runExemptedPlayers(vm.rosteredPlayers, vm.paternity, vm.bereavement);
        };

        vm.removePlayer = function (player) {
            var playerIndex = vm.rosteredPlayers.indexOf(player);
            vm.rosteredPlayers.splice(playerIndex, 1);
        };

        vm.getTeam = function() {
            return PlayerDataFactory.getPlayers(vm)
                .then(checkData)
                .then(setRosteredPlayers)
                .then(successfulResponse)
                .catch(errorResponse);
        };
        vm.addTeam = function() {
            return PlayerDataFactory.addPlayers(vm)
                .then(successfulResponse)
                .catch(errorResponse);
        };

        vm.submitTeam = function() {
            return PlayerDataFactory.submitPlayers(vm)
                .then(successfulResponse)
                .catch(errorResponse);
        };

    }
})();