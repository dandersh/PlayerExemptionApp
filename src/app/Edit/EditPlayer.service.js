(function() {
    'use strict';

    var showApp = angular.module('theShowApp.EditPlayer');

    showApp.service('EditPlayerService', EditPlayerService);

    EditPlayerService.inject = [];

    function EditPlayerService() {

        function enterPlayer(ep, vm) {
            if (_.isUndefined(vm.rosteredPlayers)) {
                vm.rosteredPlayers = [];
            }
            var splitPlayers = ep.player.split(',');
            _.each(splitPlayers, function(player) {
                vm.rosteredPlayers.push(player);
            });
            ep.player = '';
            return ep;
        }

        return {
            enterPlayer : enterPlayer
        }
    }
})();