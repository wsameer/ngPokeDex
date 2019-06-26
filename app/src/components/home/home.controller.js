(function (angular) {
  'use strict';

  angular
    .module('ngPokeDex')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Pokemon'];

  function HomeController(Pokemon) {

    var homeVm = this;
    homeVm.loading = true;
    homeVm.pokemons = [];

    onInit();
    function onInit() {
      console.log('HomeControler loaded');

      return getPokemons().then(function (response) {
        console.log('Pokemons ale');
      });
    }

    function getPokemons() {
      return Pokemon.getPokemons()
        .then(function (data) {
          homeVm.loading = false;
          homeVm.pokemons = data;
          return homeVm.pokemons;
        })
    }
  }
})(window.angular);