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
            return input
                .split(' ')
                .map(function (ch) {
                    return ch.charAt(0).toUpperCase() + ch.substring(1);
                })
                .join(' ');
        }
    }
})();