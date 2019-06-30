(function (angular) {
    'use strict';
    angular.module('ngPokedex', [
        'ngRoute',
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

    /** {Array<objects>} Stores the data of pokemons */
    homeVm.pokemons = [];


    homeVm.nextDataSetUrl = null;
    homeVm.pokemonIndex = 1;

    // method bindings
    homeVm.getPokemonSpecies = getPokemonSpecies;
    // homeVm.getPokemonsByOffset = getPokemonsByOffset;
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
          var data = pokemonData.data;
          homeVm.pokemons.push({
            id: data.id,
            idForImage: ('000' + data.id).slice(-3),
            name: data.name,
            abilities: data.abilities,
            base_experience: data.base_experience,
            height: data.height,
            weight: data.weight,
            descriptionUrl: data.species.url,
            types: sortArrayByKey(data.types, 'slot'),
            stats: data.stats
          });

          return homeVm.pokemons;
        });
    }

    /**
     * Calls the API url given in the parameter. Returns the description (flavor_text) only from the response
     * @param {String} url The API url from where the data is to fetched
     */
    function getPokemonSpecies(url) {
      return Pokemon.getPokemonSpecies(url)
        .then(function (response) {
          return response.flavor_text_entries[1].flavor_text || "Not Found";
        });
    }

    /**
     * Gets a list of pokemons from the POKEDEX API
     * @param {String} dataUrl The url to get pokemons with the correct values of offset and limit
     */
    // function getPokemonsByOffset(dataUrl) {
    //   return Pokemon.getPokemonsByOffset(dataUrl)
    //     .then(function (response) {
    //       homeVm.loading = false;
    //       return response;
    //     });
    // }
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
      getCachedPokemons: getCachedPokemons
    };

    function getCachedPokemons() {
      return pokemons;
    }

    function getPokemonSpecies(url) {
      if (!url) return;

      return $http.get(url)
        .then(requestComplete)
        .catch(requestFailed);
    }

    function getPokemonById(id) {
      if (!id) return;

      var apiUrl = "https://pokeapi.co/api/v2/pokemon/" + id + "/";
     
      return $http.get(apiUrl)
        .then(function (response) {
          pokemons.push(response);
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