(function (angular) {
  'use strict';

  angular
    .module('ngPokedex')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Pokemon'];

  function HomeController(Pokemon) {

    var homeVm = this;
    homeVm.loading = false;
    homeVm.pokemons = [];
    homeVm.nextDataSetUrl = null;
    homeVm.pokemonIndex = 1;

    // method bindings
    homeVm.getPokemons = getPokemons;
    homeVm.getPokemonsByOffset = getPokemonsByOffset;

    onInit();
    function onInit() {
      console.log('HomeControler loaded');
      homeVm.loading = true;

      // return homeVm.getPokemonsByOffset().then(function (data) {
      //   var temp = data.results.map(function (item) {
      //     item.idForImage = ('000'+homeVm.pokemonIndex).slice(-3);
      //     homeVm.pokemonIndex += 1;
      //     return item;
      //   });
      //   homeVm.pokemons = homeVm.pokemons.concat(temp);
      //   homeVm.nextDataSetUrl = data.next;
      // });

      return getPokemons().then(function (data) {
        homeVm.pokemons = data.map(function (item) {
          item.idForImage = ('000' + homeVm.pokemonIndex).slice(-3);
          homeVm.pokemonIndex += 1;
          return item;
        });
      });
    }

    /**
     * Gets a list of all the pokemons from pokedexify API
     */
    function getPokemons() {
      return Pokemon.getPokemons()
        .then(function (response) {
          homeVm.loading = false;
          return response;
        });
    }

    /**
     * Gets a list of pokemons from the POKEDEX party API
     * @param {String} dataUrl The url to get pokemons with the correct values of offset and limit
     */
    function getPokemonsByOffset(dataUrl) {
      return Pokemon.getPokemonsByOffset(dataUrl)
        .then(function (response) {
          homeVm.loading = false;
          return response;
        });
    }
  }
})(window.angular);