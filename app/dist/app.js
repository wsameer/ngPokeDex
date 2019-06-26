(function (angular) {
    'use strict';
    angular.module('ngPokeDex', [
        'ngRoute',
        'core',
        'shared'
    ]);
})(window.angular);

angular
  .module('ngPokeDex')
  .config(config);

function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'src/components/home/home.view.html',
      controller: 'HomeController',
      controllerAs: 'homeVm'
    })
    .otherwise('/');
}

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
(function (angular) {
    'use strict';

    angular.module('shared', []);

})(window.angular);
(function (angular) {

  'use strict';

  function AppHeaderController() {
    var appHeaderVm = this;
    appHeaderVm.appName = 'ngPokeDex';
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
        return {
            getPokemons: getPokemons
        };

        /**
         * Get the list of pokemons based on offset
         * @param {Integer} offset The offset from where to start getting the data
         */
        function getPokemons(offset) {
            var data = {
                offset: offset || 0,
                limit: 10
            };

            return $http.get("https://pokeapi.co/api/v2/pokemon/", { params: data })
                .then(requestComplete)
                .catch(requestFailed);
        }

        function requestComplete(response) {
            return response.data.results;
        }

        function requestFailed(error) {
            logger.error('XHR Failed for getPokemons.' + error.data);
        }
    }
})();