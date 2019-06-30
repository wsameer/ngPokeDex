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
