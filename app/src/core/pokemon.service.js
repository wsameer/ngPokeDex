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