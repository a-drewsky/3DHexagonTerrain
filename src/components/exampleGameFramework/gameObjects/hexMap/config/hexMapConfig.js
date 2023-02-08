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
            futureState: null,
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
            tag: 'base',
            sprite: 'base',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

    mainBase = (pos, posName) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Main Base',
            type: 'structures',
            tag: 'base',
            sprite: `mainbase_q${posName.q}r${posName.r}`,
            state: 0,
            tileHeight: 3,
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
            tag: 'blocker',
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
            tag: 'ruins',
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
            tag: 'ruins',
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
            tag: 'smallTrees',
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
            tag: 'smallTrees',
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
            tag: 'smallTrees',
            sprite: 'deserttree',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

}