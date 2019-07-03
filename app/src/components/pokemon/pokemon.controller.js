(function (angular) {
  'use strict';

  angular
    .module('ngPokedex')
    .controller('PokemonController', PokemonController);

  PokemonController.$inject = ['$routeParams', 'Pokemon'];

  function PokemonController($routeParams, Pokemon) {
    var pVm = this;

    pVm.flavor_text = null;

    pVm.pokemonId = $routeParams.id;
    pVm.pokemonDetails = null;

    onInit();
    function onInit() {

      // pVm.pokemonDetails = Pokemon.getPokemonByIdLocal(pVm.pokemonId);
      pVm.pokemonDetails = {
        "id":1,
        "idForImage":"001",
        "name":"bulbasaur",
        "abilities":[{
          "ability": {
            "name":"chlorophyll",
            "url":"https://pokeapi.co/api/v2/ability/34/"
          },
          "is_hidden":true,
          "slot":3
        }, {
          "ability": {
            "name":"overgrow",
            "url":"https://pokeapi.co/api/v2/ability/65/"
          },
          "is_hidden":false,
          "slot":1
        }],
        "base_experience":64,
        "height":7,
        "weight":69,
        "descriptionUrl": "https://pokeapi.co/api/v2/pokemon-species/1/",
        "types":[{
          "slot":1,
          "type": {
            "name":"grass",
            "url":"https://pokeapi.co/api/v2/type/12/"
          }
        }, {
          "slot":2,
          "type": {
            "name":"poison",
            "url":"https://pokeapi.co/api/v2/type/4/"
          }
        }],
        "stats": [{
          "base_stat":45,
          "effort":0,
          "stat": {
            "name":"speed",
            "url":"https://pokeapi.co/api/v2/stat/6/"}},{"base_stat":65,"effort":0,"stat":{"name":"special-defense","url":"https://pokeapi.co/api/v2/stat/5/"}},{"base_stat":65,"effort":1,"stat":{"name":"special-attack","url":"https://pokeapi.co/api/v2/stat/4/"}},{"base_stat":49,"effort":0,"stat":{"name":"defense","url":"https://pokeapi.co/api/v2/stat/3/"}},{"base_stat":49,"effort":0,"stat":{"name":"attack","url":"https://pokeapi.co/api/v2/stat/2/"}},{"base_stat":45,"effort":0,"stat":{"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}}]
      };
      console.log(pVm.pokemonDetails);

      if (!pVm.pokemonId) {
        pVm.pokemonId = 1;
      }
      return getPokemonSpecies("https://pokeapi.co/api/v2/pokemon-species/" + pVm.pokemonId)
        .then(function (response) {
          pVm.pokemonDetails.flavorText = response.flavor_text_entries[1].flavor_text || "Not Found";
          pVm.pokemonDetails.genera = response.genera[2].genus;
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