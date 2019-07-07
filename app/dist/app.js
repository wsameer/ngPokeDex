(function (angular) {
    'use strict';
    angular.module('ngPokedex', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
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
      templateUrl: 'src/modules/home/home.view.html',
      controller: 'HomeController',
      controllerAs: 'homeVm'
    })
    .when('/pokemons/:id', {
      templateUrl: 'src/modules/pokemonDetails/pokemonDetails.view.html',
      controller: 'PokemonDetailsController',
      controllerAs: 'pokeDetailsVm'
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
      return homeVm.getPokemons(homeVm.pokemonIndex, homeVm.pokemonIndex + 10);
    }

    /**
     * Lopps through the given index range calls `getPokemonById` method for each loop
     * @param {Integer} fromIndex The start of the offset for the API
     * @param {Integer} toIndex   The end of the offset for the API
     */
    function getPokemons(fromIndex, toIndex) {
      fromIndex = fromIndex ? fromIndex : 1;
      toIndex = toIndex ? toIndex : fromIndex + 10;
      for (var index = fromIndex; index < toIndex; index++) {
        getPokemonById(index)
          .then(function (newPokemon) {
            if (newPokemon) {
              addPokemonToLocalStorage(newPokemon);
              homeVm.pokemonIndex++;
            }
          });
      }
      homeVm.loading = false;
    }

    function addPokemonToLocalStorage(newP) {
      var doesPokemonAlreadyExists = homeVm.pokemons.find(function (pokemon) {
        return newP.id === pokemon.id;
      });

      if (!doesPokemonAlreadyExists) {
        homeVm.pokemons.push(newP);
        Pokemon.addPokemonToCache(newP);
      }
      return true;
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

          return {
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
        });
    }
  }
})(window.angular);
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
// (function () {
//     'use strict';

//     function PokemonAboutController() {
//         var pokemonAboutVm = this;

//         pokemonAboutVm.$onInit = function () {
//             console.log(this);
//             //pokemonAboutVm.flavorText = "SAmeer";
//         };

//         pokemonAboutVm.$onChanges = function (changesObj) {
//             console.log(changesObj);
//             if (changesObj.flavorText.currentValue != changesObj.flavorText.previousValue) {
//                 pokemonAboutVm.flavorText = changesObj.flavorText.currentValue;
//             }
//         };
//     }

//     angular
//         .module('ngPokedex')
//         .component('pokemonAbout', {
//             templateUrl: './src/modules/pokemonDetails/about/about.view.html',
//             controller: PokemonAboutController,
//             bindings: {
//                 flavorText: '@'
//             }
//         });
// })();
(function () {
    'use strict';

    angular
        .module('ngPokedex')
        .component('pokemonEvolution', {
            template: "<div class='col-sm text-center'>Work in progress</div>",
        });
})();
(function () {
    'use strict';

    angular
        .module('ngPokedex')
        .component('pokemonStats', {
            template: "<div class='col-sm text-center'>Work in progress</div>"
        });
})();
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

        var thisPokemonExists = pokemons.find(function (pokemon) {
          return pokemon.id === pokemonObj.id;
        });

        !thisPokemonExists ? pokemons.push(pokemonObj) : null;
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

      return searchedPokemon[0];
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