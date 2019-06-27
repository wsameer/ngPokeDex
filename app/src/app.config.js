angular
  .module('ngPokedex')
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
