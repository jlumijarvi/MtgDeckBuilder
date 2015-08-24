/// <reference path="../../typings/tsd.d.ts" />

namespace app.models {

    export interface ICard {
        name: string;
        manaCost: string;
        cmc: number;
        colors: string[];
        _type: string;
        supertypes: string[];
        types: string[];
        subtypes: string[];
        rarity: string;
        text: string;
        flavor: string;
        artist: string;
        _number: string;
        power: string;
        toughness: string;
        layout: string;
        multiverseid: number;
        imageName: string;
        id: string;
        manaCostArray: string[];
        _set: ISet;
        showImage: boolean;
    }

    export class Card implements ICard {

        constructor(public name: string,
            public manaCost: string,
            public cmc: number,
            public colors: string[],
            public _type: string,
            public supertypes: string[],
            public types: string[],
            public subtypes: string[],
            public rarity: string,
            public text: string,
            public flavor: string,
            public artist: string,
            public _number: string,
            public power: string,
            public toughness: string,
            public layout: string,
            public multiverseid: number,
            public imageName: string,
            public id: string,
            public manaCostArray: string[],
            public _set: ISet,
            public showImage: boolean = false) {
        }
    }
}