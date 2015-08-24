/// <reference path="../../typings/tsd.d.ts" />

namespace app {
    'use strict';

    export interface ICardsScope extends ng.IScope {
    }

    export class CardsController {
        title: string;
        cards: app.models.ICard[];
        sets: any[];
        types: any[];
        subTypes: any[];
        filteredCards: app.models.ICard[];
        cardRequest: ng.IPromise<app.models.ICard[]>;
        searchText: string = '';
        filterText: string;
        cardsTableId: string;
        cardsPanelId: string;
        dataTable: DataTables.DataTable;
        searchColors: any[] = [];
        imageApiUrl: string = 'http://gatherer.wizards.com/Handlers/Image.ashx';
        searchScopeName: boolean = true;
        searchScopeText: boolean = true;
        exactColorMatch: boolean = false;
        filters: any[] = [];
        pageLength: number = 10;

        static $inject = ['dataContext', '$timeout', '$scope', '$filter', '$sce', '$location', '$anchorScroll'];
        constructor(private dataContext: app.DataContext,
            private $timeout: ng.ITimeoutService,
            private $scope: ICardsScope,
            private $filter: ng.IFilterService,
            private $sce: ng.ISCEService,
            private $location: ng.ILocationService,
            private $anchorScroll: ng.IAnchorScrollService) {

            this.title = 'Cards';
            this.cardsTableId = _.uniqueId('table');
            this.cardsPanelId = _.uniqueId('panel');

            this.searchColors = [{ color: 'White', code: 'W', checked: true },
                { color: 'Black', code: 'B', checked: true },
                { color: 'Blue', code: 'U', checked: true },
                { color: 'Red', code: 'R', checked: true },
                { color: 'Green', code: 'G', checked: true },
                { color: 'Artifact', customCode: 'S', checked: true }];

            this.refresh();
        }

        searchClicked(): void {
            this.filterText = this.searchText;

            _.each(this.filters, (it) => {
                it.isCollapsed = true;
            });

            if (angular.isDefined(this.dataTable)) {
                this.pageLength = this.dataTable.page.len();
                this.dataTable.destroy();
            }

            var colors: string[] = _.pluck(_.filter(this.searchColors, (value) => { return value.checked; }), 'color');
            var includeArtifacts = _.contains(colors, 'Artifact');
            colors = _.filter(colors, (value) => {
                return value != 'Artifact';
            });

            var sets: string[] = _.pluck(_.filter(this.filters[0].data, (value: any) => { return value.checked; }), 'name');

            var types: string[] = _.pluck(_.filter(this.filters[1].data, (value: any) => { return value.checked; }), 'name');
            var typeFilterActive = _.some(this.filters[1].data, (_type: any) => { return !_type.checked; });

            var subTypes: string[] = _.pluck(_.filter(this.filters[2].data, (value: any) => { return value.checked; }), 'name');
            var subTypeFilterActive = _.some(this.filters[2].data, (subtype: any) => { return !subtype.checked; });

            var filtered = _.filter(this.cards, (card: app.models.ICard) => {
                var ret = _.isEmpty(this.filterText) ||
                    (this.searchScopeText && angular.isDefined(card.text) && card.text.toLowerCase().indexOf(this.filterText.toLowerCase()) != -1) ||
                    (this.searchScopeName && angular.isDefined(card.name) && card.name.toLowerCase().indexOf(this.filterText.toLowerCase()) != -1);

                if (angular.isDefined(card.colors)) {
                    if (this.exactColorMatch) {
                        ret = ret && card.colors.length == colors.length && _.every(colors, (value) => { return _.contains(card.colors, value) });
                    }
                    else {
                        ret = ret && _.some(card.colors, (value) => { return _.contains(colors, value) });
                    }
                }
                else {
                    if (this.exactColorMatch) {
                        ret = ret && colors.length == 1 && includeArtifacts;
                    }
                    else {
                        ret = ret && includeArtifacts;
                    }
                }
                ret = ret && _.contains(sets, card._set.name);
                ret = ret && ((!typeFilterActive && angular.isUndefined(card.types)) || _.some(card.types, (_type) => { return _.contains(types, _type) }));
                ret = ret && ((!subTypeFilterActive && angular.isUndefined(card.subtypes)) || _.some(card.subtypes, (subtype) => { return _.contains(subTypes, subtype) }));

                return ret;
            });
            this.filteredCards = [];
            this.filteredCards = filtered.slice(0, 200);

            this.$timeout(() => {
                this.dataTable = angular.element('#' + this.cardsTableId).DataTable({
                    filter: false,
                    pageLength: this.pageLength
                });
                angular.element('[title]').tooltip();

                this.$anchorScroll(this.cardsPanelId);
            });
        }

        selectAll(list: any[], value: boolean): void {
            _.each(list, (item) => item['checked'] = value);
        }

        filterDataChanged(value: any): void {
            value.isActive = _.some(value.data, (it: any) => { return !it.checked; });
            value.selected = _.pluck(_.filter(value.data, (it: any) => { return it.checked; }), 'name');
        }

        private refresh(): void {
            this.cards = [];

            this.cardRequest = this.dataContext.getCards();
            this.cardRequest.then((cards: app.models.ICard[]) => {
                this.updateCards(cards);

                this.$timeout(() => {
                    angular.element('#inputSearch').focus();
                });
            });
        }

        private updateCards(cards: app.models.ICard[]): void {
            this.cards = cards;

            var allTypes = [];
            allTypes = allTypes.concat.apply(allTypes, _.pluck(this.cards, 'types')).sort();
            this.types = _.map(_.filter(_.uniq(allTypes, true), (value) => { return value != null }), (value) => { return { name: value, checked: true } });

            var allSubTypes = [];
            allSubTypes = allSubTypes.concat.apply(allSubTypes, _.pluck(this.cards, 'subtypes')).sort();
            this.subTypes = _.map(_.filter(_.uniq(allSubTypes, true), (value) => { return value != null }), (value) => { return { name: value, checked: true } });

            var allSets = [];
            allSets = _.map(this.cards, (value) => { return value._set.name; }).sort();
            this.sets = _.map(_.filter(_.uniq(allSets, true), (value) => { return value != null }), (value) => { return { name: value, checked: true } });

            this.filters.push({ name: 'Set', data: this.sets, isCollapsed: true, isActive: false });
            this.filters.push({ name: 'Type', data: this.types, isCollapsed: true, isActive: false });
            this.filters.push({ name: 'Subtype', data: this.subTypes, isCollapsed: true, isActive: false });
        }
    }

    angular.module('app').controller('CardsController', CardsController);
}
