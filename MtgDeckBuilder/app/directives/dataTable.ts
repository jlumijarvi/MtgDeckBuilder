namespace app.directives {
    'use strict';

    interface IDataTableScope {
    }

    class DataTable {

        scope: any = {};

        constructor(private $timeout: ng.ITimeoutService) {
        }

        link: ng.IDirectiveLinkFn = (scope: ng.IRepeatScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            if (scope.$last) {
                console.log('LAST!');
            }
        }

        public static factory(): ng.IDirectiveFactory {
            var directive = ($timeout: ng.ITimeoutService) => {
                return new DataTable($timeout);
            }

            directive.$inject = ['$timeout'];

            return directive;
        }
    }

    angular.module('app').directive('ngDataTable', DataTable.factory());
}
