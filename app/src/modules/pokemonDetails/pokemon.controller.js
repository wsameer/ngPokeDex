(function (angular) {
  'use strict';

  angular
    .module('ngPokedex')
    .controller('PokemonDetailsController', PokemonDetailsController);

  PokemonDetailsController.$inject = ['$routeParams', '$location', 'Pokemon'];

  function PokemonDetailsController($routeParams, $location, Pokemon) {
    var pokeDetailsVm = this;

    pokeDetailsVm.flavor_text = null;

    pokeDetailsVm.pokemonId = $routeParams.id;
    pokeDetailsVm.pokemonDetails = null;

    onInit();
    function onInit() {

      pokeDetailsVm.pokemonDetails = Pokemon.getPokemonByIdLocal(pokeDetailsVm.pokemonId);

      // pokemon not found
      if (pokeDetailsVm.pokemonDetails == null) {
        $location.path('pokemons');
        return;
      }

      if (!pokeDetailsVm.pokemonId) {
        pokeDetailsVm.pokemonId = 1;
      }
      return getPokemonSpecies("https://pokeapi.co/api/v2/pokemon-species/" + pokeDetailsVm.pokemonId)
        .then(function (response) {
          pokeDetailsVm.pokemonDetails.flavorText = response.flavor_text_entries[1].flavor_text || "Not Found";
          pokeDetailsVm.pokemonDetails.genera = response.genera[2].genus;
        });
    }

    /**
     * Calls the API url given in the parameter. Returns the description (flavor_text) only from the response
     * @param {String} url The API url from where the data is to fetched
     */
    function getPokemonSpecies(url) {
      return Pokemon.getPokemonSpecies(url)
        .then(function (response) {
          console.log(response);
          return response.data;
        });
    }
  }
})(window.angular);