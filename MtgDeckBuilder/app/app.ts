/// <reference path="../typings/tsd.d.ts" />

namespace app {
    'user strict';

    var app = angular.module('app', ['ngRoute', 'ngResource', 'cgBusy', 'ui.bootstrap', 'ngSanitize', 'ngFx', 'ngAnimate']);

    app.config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider: ng.route.IRouteProvider): void {
        $routeProvider.when('/cards', {
            templateUrl: '/app/controllers/cards.html',
            controller: 'CardsController as vm'
        });
        $routeProvider.when('/card/:cardId', {
            templateUrl: '/app/controllers/card.html'
        });
        $routeProvider.when('/decks', {
            templateUrl: '/app/controllers/decks.html'
        });
        $routeProvider.when('/deck:deckId', {
            templateUrl: '/app/controllers/deck.html'
        });
        $routeProvider.otherwise('/cards');
    }
}
