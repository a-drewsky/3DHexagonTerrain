export default class ModifierConfig {

    static emptymine = {
        name: 'Empty Mine',
        modifierType: 'singleImage',
        sprite: 'empty_mine',
        height: 1,
        stats: {}
    }

    static rubblepile = {
        name: 'Rubble Pile',
        modifierType: 'singleImage',
        sprite: 'rubble_pile',
        height: 1,
        stats: {}

    }

    static smallRocks = {
        name: 'Rocks',
        modifierType: 'components',
        sprite: 'small_rocks',
        height: 1,
        stats: {},
        secondSpriteChance: 0.4,
        spriteIncrementChance: 0.2
    }

    static oakTrees = {
        name: 'Forest',
        modifierType: 'components',
        sprite: 'woodland_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.4,
        spriteIncrementChance: 0.2
    }

    static spruceTrees = {
        name: 'Forest',
        modifierType: 'components',
        sprite: 'tundra_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.6,
        spriteIncrementChance: 0.2
    }

    static cacti = {
        name: 'Cacti',
        modifierType: 'components',
        sprite: 'desert_trees',
        height: 2,
        stats: {},
        secondSpriteChance: 0.6,
        spriteIncrementChance: 0.3
    }

}