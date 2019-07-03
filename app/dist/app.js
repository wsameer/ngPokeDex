(function (angular) {
    'use strict';
    angular.module('ngPokedex', [
        'ngRoute',
        'ui.bootstrap',
        'core',
        'shared'
    ]);
})(window.angular);

angular
  .module('ngPokedex')
  .config(config);

function config($routeProvider) {
  $routeProvider
    .when('/pokemons', {
      templateUrl: 'src/components/home/home.view.html',
      controller: 'HomeController',
      controllerAs: 'homeVm'
    })
    .when('/pokemons/:id', {
      templateUrl: 'src/components/pokemon/pokemon.view.html',
      controller: 'PokemonController',
      controllerAs: 'pVm'
    })
    .otherwise('/pokemons');
}

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
(function (angular) {
    'use strict';

    angular.module('shared', []);

})(window.angular);
(function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name ucfirst
     * @kind function
     *
     * @description Converts first character of a string to uppercase
     * 
     * @Usage
     * <div>{{ 'string' | ucfirst }}</div>
     * 
     * @Output
     * <div>String<div>
     */
    angular.module('shared')
        .filter('ucfirst', ucfirstFilter);

    function ucfirstFilter() {
        return function (input) {
            if (!input) return;
            return input
                .split(' ')
                .map(function (ch) {
                    return ch.charAt(0).toUpperCase() + ch.substring(1);
                })
                .join(' ');
        }
    }
})();
(function (angular) {

  'use strict';

  function AppHeaderController() {
    var appHeaderVm = this;
    appHeaderVm.appName = 'ngPokedex';
    appHeaderVm.showAboutUs = false;

    appHeaderVm.toggleAboutUs = toggleAboutUs;

    function toggleAboutUs() {
      return appHeaderVm.showAboutUs = !appHeaderVm.showAboutUs;
    };
  }

  angular
    .module('shared')
    .component('appHeader', {
      templateUrl: 'src/shared/header/header.view.html',
      controller: AppHeaderController,
      controllerAs: 'appHeaderVm'
    });

})(window.angular);
(function (angular) {
    'use strict';
    angular.module('core', []);
})(window.angular);
(function () {
  'use strict';

  angular
    .module('core')
    .factory('Pokemon', Pokemon);

  Pokemon.$inject = ['$http'];

  function Pokemon($http) {

    var pokemons = [];

    return {
      // getPokemonsByOffset: getPokemonsByOffset,
      getPokemonById: getPokemonById,
      getPokemonSpecies: getPokemonSpecies,
      getCachedPokemons: getCachedPokemons,
      getPokemonByIdLocal: getPokemonByIdLocal,
      addPokemonToCache: addPokemonToCache
    };

    function addPokemonToCache(pokemonObj) {
      if (pokemonObj) {
        pokemons.push(pokemonObj);
      }
      return;
    }

    function getCachedPokemons() {
      return pokemons;
    }

    function getPokemonSpecies(url) {
      if (!url) return;

      return $http.get(url)
        .then(requestComplete)
        .catch(requestFailed);
    }

    function getPokemonByIdLocal(id) {
      id = parseInt(id, 10);
      
      if (pokemons.length < 1) {
        return null;
      }

      var searchedPokemon = pokemons.filter(function (pokemon) {
        return id === pokemon.id;
      });

      return searchedPokemon;
    }

    function getPokemonById(id) {
      if (!id) return;

      var apiUrl = "https://pokeapi.co/api/v2/pokemon/" + id + "/";
     
      return $http.get(apiUrl)
        .then(function (response) {
          return response;
        })
        .catch(requestFailed);
    }

    /**
     * Get the list of pokemons based on offset
     * @param {Integer} offset The offset from where to start getting the data
     */
    // function getPokemonsByOffset(url) {
    //   var apiUrl = url || "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12";

    //   return $http.get(apiUrl)
    //     .then(requestComplete)
    //     .catch(requestFailed);
    // }

    function requestComplete(response) {
      return response;
    }

    function requestFailed(error) {
      console.log('XHR Failed for getPokemons.' + error.data);
    }
  }
})();