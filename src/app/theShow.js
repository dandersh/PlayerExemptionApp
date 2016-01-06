angular.module('theShowApp', ['theShowApp.common'])
    .controller("playerCtrl", function (playerModel, $scope) {

        var vm = this;
        $scope.exemptedPlayers = {};
        vm.paternity = [];
        vm.bereavement = [];


        vm.runExemptedPlayers = function() {
            return playerModel.runExemptedPlayers(vm.rosteredPlayers, vm.paternity, vm.bereavement);
        };

        vm.removePlayer = function (player) {
            var playerIndex = vm.rosteredPlayers.indexOf(player);
            vm.rosteredPlayers.splice(playerIndex, 1);
        };

        var userName = vm.username;

        vm.getTeam = function() {
            return playerModel.get(userName, vm);
        };

        vm.addTeam = function() {
            return playerModel.add(userName, vm);
        };

        vm.submitTeam = function() {
            return playerModel.submit(vm);
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

        $scope.editPlayer = function () {

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

        $scope.getTeam = function () {

            var username = $scope.team.username.toString();
            var team = $scope.team.team;
            var params = {
                "username": username,
                "team": team
            };
            var url = 'https://api.mongolab.com/api/1/databases/theshowapp/collections/teams?q=' + JSON.stringify(params) + '&fo=true&apiKey=M0OLjonEVjS6RrdiCbDw6oaDxLAtQeGE';
            $http.get(url).success(function (data, status, headers, config) {
                $scope.team.username = data.username;
                $scope.team.team = data.team;
                $scope.team._id = data._id;
                var playerLen = data.players.length;
                for (var i = 0; i < playerLen; i++) {
                    $scope.chosenTeam.push(data.players[i]);
                }
            }).error(function (data, status, headers, config) {
                console.log('failed');
            });
        };

        $scope.submit = function () {
            var configObj = {
                'username': $scope.team.username,
                'team': $scope.team.teamName,
                '_id': $scope.team._id,
                'players': $scope.chosenTeam
            };
            $http.put("https://api.mongolab.com/api/1/databases/theshowapp/collections/teams?apiKey=M0OLjonEVjS6RrdiCbDw6oaDxLAtQeGE", configObj).success(function (data, status, headers, config) {
                console.log('submitted');
            }).error(function (data, status, headers, config) {
                console.log('error');
            });
        };
    });
