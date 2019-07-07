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
