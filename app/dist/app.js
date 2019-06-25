(function (angular) {
    'use strict';
    angular.module('ngPokeDex', [
        'ngRoute', 'shared'
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

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {

    var homeVm = this;
    homeVm.loading = true;

    onInit();
    function onInit() {
      console.log('HomeControler loaded');

      
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