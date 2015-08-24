/// <reference path="../../typings/tsd.d.ts" />

namespace app {

    interface ICardResource extends ng.resource.IResource<app.models.ICard> {
    }

    export class DataContext {

        public sets: app.models.ISet[];
        public cards: app.models.ICard[];

        static $inject = ['$resource', '$http', '$q'];
        constructor(private $resource: ng.resource.IResourceService,
            private $http: ng.IHttpService,
            private $q: ng.IQService) {
        }

        getCards(): ng.IPromise<app.models.ICard[]>{

            if (angular.isDefined(this.cards)) {
                return this.$q.when(this.cards);
            }

            return this.$http.get('/app/data/AllSets.json').then((response: any) => {
                this.sets = [];
                this.cards = [];

                for (var prop in response.data) {
                    var _set = response.data[prop];
                    this.sets.push(_set);
                    for (var i = 0; i < _set.cards.length; i++) {
                        var len = this.cards.push(_set.cards[i]);
                        if (angular.isDefined(this.cards[len - 1].manaCost)) {
                            this.cards[len - 1].manaCostArray = this.cards[len - 1].manaCost.slice(1).replace(/\}/g, '').split('{');
                        }
                        this.cards[len - 1]._type = this.cards[len - 1]['type'];
                        delete this.cards[len - 1]['type'];
                        this.cards[len - 1]._number = this.cards[len - 1]['number'];
                        delete this.cards[len - 1]['number'];
                        this.cards[len - 1]._set = _set;
                    }
                    _set.cards = [];
                }
                return this.cards;
            });
        }

        //getCardResource(): ng.resource.IResourceClass<ICardResource> {
        //    return this.$resource('/api/cards/:cardId');
        //}
    }

    angular.module('app').service('dataContext', DataContext);
}
