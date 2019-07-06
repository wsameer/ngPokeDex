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

      // pokeDetailsVm.pokemonDetails = {
      //   "id":1,
      //   "idForImage":"001",
      //   "name":"bulbasaur",
      //   "abilities":[{
      //     "ability": {
      //       "name":"chlorophyll",
      //       "url":"https://pokeapi.co/api/v2/ability/34/"
      //     },
      //     "is_hidden":true,
      //     "slot":3
      //   }, {
      //     "ability": {
      //       "name":"overgrow",
      //       "url":"https://pokeapi.co/api/v2/ability/65/"
      //     },
      //     "is_hidden":false,
      //     "slot":1
      //   }],
      //   "base_experience":64,
      //   "height":7,
      //   "weight":69,
      //   "descriptionUrl": "https://pokeapi.co/api/v2/pokemon-species/1/",
      //   "types":[{
      //     "slot":1,
      //     "type": {
      //       "name":"grass",
      //       "url":"https://pokeapi.co/api/v2/type/12/"
      //     }
      //   }, {
      //     "slot":2,
      //     "type": {
      //       "name":"poison",
      //       "url":"https://pokeapi.co/api/v2/type/4/"
      //     }
      //   }],
      //   "stats": [{
      //     "base_stat":45,
      //     "effort":0,
      //     "stat": {
      //       "name":"speed",
      //       "url":"https://pokeapi.co/api/v2/stat/6/"}},{"base_stat":65,"effort":0,"stat":{"name":"special-defense","url":"https://pokeapi.co/api/v2/stat/5/"}},{"base_stat":65,"effort":1,"stat":{"name":"special-attack","url":"https://pokeapi.co/api/v2/stat/4/"}},{"base_stat":49,"effort":0,"stat":{"name":"defense","url":"https://pokeapi.co/api/v2/stat/3/"}},{"base_stat":49,"effort":0,"stat":{"name":"attack","url":"https://pokeapi.co/api/v2/stat/2/"}},{"base_stat":45,"effort":0,"stat":{"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}}]
      // };
      // console.log(pokeDetailsVm.pokemonDetails);

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