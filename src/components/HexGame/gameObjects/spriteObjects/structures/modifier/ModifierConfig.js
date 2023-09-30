export default class ModifierConfig {

    static emptymine = {
        id: 'empty_mine',
        modifierType: 'singleImage',
        sprite: 'empty_mine',
        height: 1,
        stats: {}
    }

    static rubblepile = {
        id: 'rubble_pile',
        modifierType: 'singleImage',
        sprite: 'rubble_pile',
        height: 1,
        stats: {}

    }

    static smallRocks = {
        id: 'small_rocks',
        modifierType: 'components',
        sprite: 'small_rocks',
        height: 1,
        stats: {},
        secondSpriteChance: 0.4,
        spriteIncrementChance: 0.2
    }

    static oakTrees = {
        id: 'oak_forest',
        modifierType: 'components',
        sprite: 'woodland_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.4,
        spriteIncrementChance: 0.2,
        cost: 1
    }

    static spruceTrees = {
        id: 'spruce_forest',
        modifierType: 'components',
        sprite: 'tundra_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.6,
        spriteIncrementChance: 0.2,
        cost: 1
    }

    static cacti = {
        id: 'cacti',
        modifierType: 'components',
        sprite: 'desert_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.6,
        spriteIncrementChance: 0.3
    }

}