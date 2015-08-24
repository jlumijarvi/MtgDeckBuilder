/// <reference path="../../typings/tsd.d.ts" />

namespace app.filters {
    'use strict';

    angular.module('app').filter('newLines', () => {
        return (text: string) => {
            return angular.isDefined(text) ? text.replace(/\n/g, '<br/>') : text;
        }
    });

    angular.module('app').filter('mtgSymbols', () => {
        return (text: string) => {
            if (!angular.isDefined(text)) {
                return text;
            }

            return text.replace(/\{T\}/g, '{tap}')
                .replace(/(\{)([^\/]+)\/([^\/]+)(\})/g, '$1$2$3$4')
                .replace(/\{(\w+)\}/g, '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=$1&type=symbol" width="15" title="$1" data-toggle="tooltip" />');
        }
    });
}
