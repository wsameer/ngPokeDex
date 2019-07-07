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