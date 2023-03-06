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
            type: 'unit',
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
            renderShadowImages: [],
            health: 100,
            stateConfig: {
                idle: {
                    rate: 'static',
                    duration: 'continuous',
                    type: 'static'
                },
                walk: {
                    rate: 150,
                    duration: 'continuous',
                    type: 'moving'
                },
                jumpUp: {
                    rate: 'static',
                    duration: 'continuous',
                    type: 'moving'
                },
                jumpDown: {
                    rate: 'static',
                    duration: 'continuous',
                    type: 'moving'
                },
                mine: {
                    rate: 150,
                    duration: 1800,
                    type: 'action'
                },
                attack: {
                    rate: 150,
                    duration: 750,
                    type: 'action'
                },
                hit: {
                    rate: 300,
                    duration: 900,
                    type: 'action'
                },
                death: {
                    rate: 150,
                    duration: 600,
                    type: 'action'
                }
            }
        }
    }

    bunker = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Stronghold',
            type: 'base',
            sprite: 'bunker',
            state: 'health_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            health: 100,
            rotation: 1
        }
    }

    mainBase = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Main Base',
            type: 'base',
            sprite: `mainbase`,
            state: 'health_lte_100',
            tileHeight: 3,
            images: [],
            shadowImages: [],
            health: 100,
            rotation: 1
        }
    }

    flag = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Flag',
            type: 'flag',
            sprite: 'flag',
            state: 0,
            tileHeight: 5,
            images: [],
            shadowImages: [],
        }
    }

    goldmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Gold Mine',
            type: 'resource',
            sprite: 'gold_mine',
            state: 'resources_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100,
            rotation: 1
        }
    }

    coppermine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Copper Mine',
            type: 'resource',
            sprite: 'copper_mine',
            state: 'resources_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100,
            rotation: 1
        }
    }

    ironmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Iron Mine',
            type: 'resource',
            sprite: 'iron_mine',
            state: 'resources_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100,
            rotation: 1
        }
    }

    rubymine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Ruby Mine',
            type: 'resource',
            sprite: 'ruby_mine',
            state: 'resources_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100,
            rotation: 1
        }
    }

    amethystmine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Amethyst Mine',
            type: 'resource',
            sprite: 'amethyst_mine',
            state: 'resources_lte_100',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            resources: 100,
            rotation: 1
        }
    }

    savannaTree = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Savanna Tree',
            type: 'prop',
            sprite: 'savanna_tree',
            state: 'default',
            tileHeight: 3,
            images: [],
            shadowImages: [],
            rotation: 1
        }
    }

    largeRock = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Large Rock',
            type: 'prop',
            sprite: 'large_rock',
            state: 'default',
            tileHeight: 2,
            images: [],
            shadowImages: [],
            rotation: 1
        }
    }

    emptymine = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Empty Mine',
            type: 'modifier',
            modifierType: 'singleImage',
            sprite: 'emptymine',
            state: 0,
            tileHeight: 1,
            images: [],
            shadowImages: []
        }
    }

    rubblepile = (pos) => {
        return {
            position: {
                q: pos.q,
                r: pos.r
            },
            name: 'Rubble Pile',
            type: 'modifier',
            modifierType: 'singleImage',
            sprite: 'rubblepile',
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
            type: 'modifier',
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
            type: 'modifier',
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
            type: 'modifier',
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
            type: 'modifier',
            modifierType: 'components',
            sprite: 'deserttree',
            state: 0,
            tileHeight: 2,
            images: [],
            shadowImages: []
        }
    }

}