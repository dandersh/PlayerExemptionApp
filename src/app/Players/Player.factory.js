(function () {
    'use strict';

    var showApp = angular.module('theShowApp.Players');

    showApp.factory('PlayerDataFactory', PlayerDataFactory);

    PlayerDataFactory.inject = ['PlayerService', '$http', 'dataCalls'];

    function PlayerDataFactory(PlayerService, $http, dataCalls) {
        var url = dataCalls.url,
            apiKey = dataCalls.key;

        return {
            addPlayers: addPlayers,
            submitPlayers: submitPlayers,
            getPlayers: getPlayers
        };

        function addPlayers(vm) {
            var allPlayers = [];
            allPlayers.push(vm.rosteredPlayers);
            allPlayers.push(vm.paternity);
            allPlayers.push(vm.bereavement);
            var configObj = {
                'username': vm.username,
                'team': vm.team,
                '_id': vm._id,
                'players': allPlayers
            };
            return $http.put(url + "?apiKey=" + apiKey, configObj);
        }

        function submitPlayers(vm) {
            var allPlayers = [];
            allPlayers.push(vm.rosteredPlayers);
            allPlayers.push(vm.paternity);
            allPlayers.push(vm.bereavement);
            var configObj = {
                'username': vm.username,
                'team': vm.team,
                '_id': vm._id,
                'players': allPlayers
            };
            return $http.put(url + "?apiKey=" + apiKey, configObj);
        }

        function getPlayers(vm) {
            var username = vm.username.toString();
            var params = {
                "username": username
            };
            var getUrl = url + '?q=' + JSON.stringify(params) + '&fo=true&apiKey=' + apiKey;
            return $http.get(getUrl)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();