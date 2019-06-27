(function (angular) {

  'use strict';

  function AppHeaderController() {
    var appHeaderVm = this;
    appHeaderVm.appName = 'ngPokedex';
    appHeaderVm.search = null;
  }

  angular
    .module('shared')
    .component('appHeader', {
      templateUrl: 'src/shared/header/header.view.html',
      controller: AppHeaderController,
      controllerAs: 'appHeaderVm'
    });

})(window.angular);