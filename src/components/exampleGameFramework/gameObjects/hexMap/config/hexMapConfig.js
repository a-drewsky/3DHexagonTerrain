export default class HexMapConfigClass {

    unit = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            path: [],
            destination: null,
            destinationStartTime: null,
            destinationCurTime: null,
            target: null,
            animationStartTime: null,
            animationCurTime: null,
            name: 'Villager',
            type: 'units',
            sprite: 'villager',
            state: 'idle',
            frame: 0,
            frameStartTime: Date.now(),
            frameCurTime: Date.now(),
            rotation: 5,
            tileHeight: 3,
            movementRange: 5,
            renderImages: [],
            renderShadowImages: []
        }
    }

    base = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Stronghold',
            type: 'structures',
            sprite: 'base',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

    goldmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Gold Mine',
            tag: 'mine',
            type: 'structures',
            sprite: 'goldmine',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100
        }
    }

    coppermine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Copper Mine',
            tag: 'mine',
            type: 'structures',
            sprite: 'coppermine',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100
        }
    }

    ironmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Iron Mine',
            tag: 'mine',
            type: 'structures',
            sprite: 'ironmine',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100
        }
    }

    rubymine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Ruby Mine',
            tag: 'mine',
            type: 'structures',
            sprite: 'rubymine',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100
        }
    }

    amethystmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Amethyst Mine',
            tag: 'mine',
            type: 'structures',
            sprite: 'amethystmine',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100
        }
    }

    savannaTree = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Savanna Tree',
            tag: 'largeTree',
            type: 'structures',
            sprite: 'savannatree',
            state: 0,
            tileHeight: 3,
            images: [],
            shadowImages: []
        }
    }

    largeRock = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Large Rock',
            type: 'structures',
            sprite: 'largerock',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

    emptymine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Empty Mine',
            type: 'modifiers',
            modifierType: 'singleImage',
            sprite: 'emptymine',
            state: 0,
            tileHeight: 1,
            images: [],
            shadowImages: []
        }
    }

    smallRocks = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Rocks',
            type: 'modifiers',
            modifierType: 'components',
            sprite: 'rocks',
            state: 0,
            tileHeight: 1,
            images: [],
            shadowImages: []
        }
    }

    oakTrees = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Forest',
            type: 'modifiers',
            modifierType: 'components',
            sprite: 'oaktree',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

    spruceTrees = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Forest',
            type: 'modifiers',
            modifierType: 'components',
            sprite: 'tundratree',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

    cacti = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Cacti',
            type: 'modifiers',
            modifierType: 'components',
            sprite: 'deserttree',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

}