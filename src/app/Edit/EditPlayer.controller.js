(function() {
    'use strict';

    var showApp = angular.module('theShowApp.EditPlayer');

    showApp.controller('EditPlayerController', EditPlayerController);

    EditPlayerController.inject = ['EditPlayerService', '$scope'];
    function EditPlayerController(EditPlayerService, $scope) {
        var ep = this,
            vm = $scope.pc;

        ep.enter = function () {
            return EditPlayerService.enterPlayer(ep,vm);
        };
    }
})();