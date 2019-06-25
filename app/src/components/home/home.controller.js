(function (angular) {
  'use strict';

  angular
    .module('ngPokeDex')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {

    var homeVm = this;
    homeVm.loading = true;

    onInit();
    function onInit() {
      console.log('HomeControler loaded');

      
    }
  }
})(window.angular);