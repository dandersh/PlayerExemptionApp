angular.module('theShowApp.common')
    .service('playerModel', function($http) {
        var service = this,
            rosteredPlayers,
            bereavementList = [],
            paternityList = [],
            url = 'https://api.mongolab.com/api/1/databases/theshowapp/collections/teams',
            apiKey = '####';

        service.sortNames = function (x, y) {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                return 0;
            }
        };

        service.getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        service.updateExemptedListDays = function (element, index, array) {
            var arrLength = array.length - 1;
            array[index].days--;
            /* If the player has 0 days we add him back to the players list and remove him from the exempted list he was a part of. We mark him as selected so he cannot be chosen again and sort the players list since it has been updated. */
            if (array[index].days < 1) {
                rosteredPlayers.push(array[index].name);
                rosteredPlayers.sort(service.sortNames);
            }
            if (index === arrLength) {
                array.forEach(function (currentValue, index2, arr) {
                    if (currentValue.days === 0) {
                        arr.splice(index2, 1);
                    }
                });
            }
        };

        service.addPlayerToExemptedList = function (player, array, rosteredPlayers) {
            array.push({'name': player, 'days': 3, selected: true});
            rosteredPlayers.splice(rosteredPlayers.indexOf(player), 1);
            return rosteredPlayers;
        };

        service.runExemptedPlayers = function (vmRosteredPlayers, vmPaternityList, vmBereavementList) {
            rosteredPlayers = vmRosteredPlayers;
            paternityList = vmPaternityList;
            bereavementList = vmBereavementList;

            paternityList.forEach(service.updateExemptedListDays);
            bereavementList.forEach(service.updateExemptedListDays);

            var exemptCheck = Math.random() * 100;
            /* If our exemptCheck is less than 6 we add him to one of the exempt lists, unless they had already been placed there previously, in which case we simply return. */
            // NOTE: Current logic triggers exemptCheck at a far higher rate than will be found in production for debugging purposes.
            if (exemptCheck < 6) {
                var player = rosteredPlayers[Math.floor(service.getRandomArbitrary(0, rosteredPlayers.length))];
                if (player.selected) {
                    return;
                }
                if (exemptCheck > 3) {
                    service.addPlayerToExemptedList(player, bereavementList, rosteredPlayers);
                } else {
                    service.addPlayerToExemptedList(player, paternityList, rosteredPlayers);
                }
            }

        };

        service.enterPlayer = function(ep, vm) {
            if (_.isUndefined(vm.rosteredPlayers)) {
                vm.rosteredPlayers = [];
            }
            var splitPlayers = ep.player.split(',');
            _.each(splitPlayers, function(player) {
               vm.rosteredPlayers.push(player);
            });
            ep.player = '';
            return ep;
        };

        service.setRosteredPlayers = function(vm, data) {
            vm.username = data.username;
            vm.team = data.team;
            vm.rosteredPlayers = data.players.slice(0,1)[0] || [];
            vm.paternity = data.players.slice(1,2)[0] || [];
            vm.bereavement = data.players.slice(2,3)[0] || [];
            return vm;
        };

        service.submit = function (vm) {
            var allPlayers = [];
            allPlayers.push(vm.rosteredPlayers);
            allPlayers.push(vm.paternity);
            allPlayers.push(vm.bereavement);
            var configObj = {
                'username': vm.username,
                'team': vm.teamName,
                '_id': vm._id,
                'players': allPlayers
            };
            $http.put(url + "?apiKey=" + apiKey, configObj).success(function (data, status, headers, config) {
                console.log('submitted');
            }).error(function (data, status, headers, config) {
                console.log('error');
            });
        };

        service.add = function(userName, vm) {
            var allPlayers = [];
            allPlayers.push(vm.rosteredPlayers);
            allPlayers.push(vm.paternity);
            allPlayers.push(vm.bereavement);
            var configObj = {
                'username': vm.username,
                'team': vm.teamName,
                '_id': vm._id,
                'players': allPlayers
            };
            $http.put(url + "?apiKey=" + apiKey, configObj).success(function (data, status, headers, config) {
                console.log('submitted');
            }).error(function (data, status, headers, config) {
                console.log('error');
            });
        };

        service.get = function(userName, vm) {
            var username = vm.username.toString();
            // This is static data for the 'tester' to enable testing the application logic when the api key is not available.
            if (username === 'tester') {
                var testerData = {
                    username: 'tester',
                    players: [
                        ['David Wright', 'Matt Harvey', 'Yoenis Cespedes', 'Michael Conforto', 'Jacob deGrom', 'Lucas Duda', 'Wilmer Flores'],
                        [{name: 'Juan Uribe', days: 3, selected: true}, {name: 'Ruben Tejada', days: 1, selected: true}],
                        [{name: 'Daniel Murphy', days: 2, selected: true}]
                    ]
                };
                service.setRosteredPlayers(vm, testerData)
            }
            var params = {
                "username": username
            };

            var getUrl = url + '?q=' + JSON.stringify(params) + '&fo=true&apiKey=' + apiKey;
            $http.get(getUrl).success(function (data, status, headers, config) {
                service.setRosteredPlayers(vm, data);
            }).error(function (data, status, headers, config) {
                console.log('failed');
            });
        };
    });