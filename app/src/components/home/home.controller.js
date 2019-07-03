(function (angular) {
  'use strict';

  angular
    .module('ngPokedex')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Pokemon'];

  function HomeController(Pokemon) {
    var homeVm = this;

    /** {Boolean} Flag to mantain the status of busy indicator */
    homeVm.loading = false;
    /** {Integer} The beginning of the offset to get pokemons data */
    homeVm.pokemonIndex = 1;
    /** {Array<objects>} Stores the data of pokemons */
    homeVm.pokemons = [];
    
    // method bindings
    homeVm.getPokemons = getPokemons;

    onInit();
    function onInit() {
      // start the loading indicator
      homeVm.loading = true;
      return homeVm.getPokemons(homeVm.pokemonIndex, homeVm.pokemonIndex + 9);
    }

    /**
     * Lopps through the given index range calls `getPokemonById` method for each loop
     * @param {Integer} fromIndex The start of the offset for the API
     * @param {Integer} toIndex   The end of the offset for the API
     */
    function getPokemons(fromIndex, toIndex) {
      fromIndex = fromIndex ? fromIndex : 1;
      toIndex = toIndex ? toIndex : fromIndex + 9;
      for (var index = fromIndex; index < toIndex; index++) {
        getPokemonById(index);
        homeVm.pokemonIndex++;
      }
      homeVm.loading = false;
    }

    /**
     * Sorts any array based on the given key name
     * @param {Array} array The array to sort
     * @param {String} key  The name of the key based on which the `array` is to be sorted
     */
    function sortArrayByKey(array, key) {
      if (array == null) return;
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    /**
     * Brings all details of a pokemon based on given indentification number
     * @param {Integer} pokemonId The ID of the pokemon whose information is to be fetched
     */
    function getPokemonById(pokemonId) {
      return Pokemon.getPokemonById(pokemonId)
        .then(function (pokemonData) {
          if (!pokemonData) {
            return null;
          }
          var newPokemon = {
            id: pokemonData.data.id,
            idForImage: ('000' + pokemonData.data.id).slice(-3),
            name: pokemonData.data.name,
            abilities: pokemonData.data.abilities,
            base_experience: pokemonData.data.base_experience,
            height: pokemonData.data.height,
            weight: pokemonData.data.weight,
            descriptionUrl: pokemonData.data.species.url,
            types: sortArrayByKey(pokemonData.data.types, 'slot'),
            stats: pokemonData.data.stats
          };
          
          homeVm.pokemons.push(newPokemon);
          Pokemon.addPokemonToCache(newPokemon);
          return homeVm.pokemons;
        });
    }
  }
})(window.angular);