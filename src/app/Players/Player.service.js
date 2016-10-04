(function() {
    'use strict';

    var showApp = angular.module('theShowApp.Players');

    showApp.service('PlayerService', PlayerService);

    PlayerService.inject = [];

    function PlayerService() {
        var self = this,
            rosteredPlayers,
            bereavementList = [],
            paternityList = [];

        // Internal helpers
        self.sortNames = function(x, y)  {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                return 0;
            }
        };

        self.getRandomArbitrary = function(min, max) {
            return Math.random() * (max - min) + min;
        };

        self.updateExemptedListDays = function(element, index, array) {
            var arrLength = array.length - 1;
            array[index].days--;
            /* If the player has 0 days we add him back to the players list and remove him from the exempted list he was a part of. We mark him as selected so he cannot be chosen again and sort the players list since it has been updated. */
            if (array[index].days < 1) {
                rosteredPlayers.push(array[index].name);
                rosteredPlayers.sort(self.sortNames);
            }
            if (index === arrLength) {
                array.forEach(function (currentValue, index2, arr) {
                    if (currentValue.days === 0) {
                        arr.splice(index2, 1);
                    }
                });
            }
        };

        self.addPlayerToExemptedList = function(player, array, rosteredPlayers) {
            array.push({'name': player, 'days': 3, selected: true});
            rosteredPlayers.splice(rosteredPlayers.indexOf(player), 1);
            return rosteredPlayers;
        };

        // Publicly exposed
        function runExemptedPlayers (vmRosteredPlayers, vmPaternityList, vmBereavementList) {
            rosteredPlayers = vmRosteredPlayers;
            paternityList = vmPaternityList;
            bereavementList = vmBereavementList;

            paternityList.forEach(self.updateExemptedListDays);
            bereavementList.forEach(self.updateExemptedListDays);

            var exemptCheck = Math.random() * 100;
            /* If our exemptCheck is less than 6 we add him to one of the exempt lists, unless they had already been placed there previously, in which case we simply return. */
            // NOTE: Current logic triggers exemptCheck at a far higher rate than will be found in production for debugging purposes.
            if (exemptCheck < 6) {
                var player = rosteredPlayers[Math.floor(self.getRandomArbitrary(0, rosteredPlayers.length))];
                if (player.selected) {
                    return;
                }
                if (exemptCheck > 3) {
                    self.addPlayerToExemptedList(player, bereavementList, rosteredPlayers);
                } else {
                    self.addPlayerToExemptedList(player, paternityList, rosteredPlayers);
                }
            }
        }


        return {
            runExemptedPlayers : runExemptedPlayers
        }
    }
})();