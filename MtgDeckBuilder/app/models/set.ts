/// <reference path="../../typings/tsd.d.ts" />

namespace app.models {

    export interface ISet {
        name: string;
        code: string;
        gathererCode: string;
        oldCode: string;
        magicCardsInfoCode: string;
        releaseDate: string;
        border: string;
        type: string;
        block: string;
        onlineOnly: string;
        booster: string;
        cards: ICard[];
    }

    export class Set implements ISet {

        constructor(public name: string,
            public code: string,
            public gathererCode: string,
            public oldCode: string,
            public magicCardsInfoCode: string,
            public releaseDate: string,
            public border: string,
            public type: string,
            public block: string,
            public onlineOnly: string,
            public booster: string,
            public cards: ICard[]) {
        }
    }
}
