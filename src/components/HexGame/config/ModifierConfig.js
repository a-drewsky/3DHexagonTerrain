export default class ModifierConfig {

    static emptymine = {
        id: 'empty_mine',
        modifierType: 'singleImage',
        sprite: 'empty_mine',
        height: 1,
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }
    }

    static rubblepile = {
        id: 'rubble_pile',
        modifierType: 'singleImage',
        sprite: 'rubble_pile',
        height: 1,
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }

    }

    static smallRocks = {
        id: 'small_rocks',
        modifierType: 'components',
        sprites: ['rock_1', 'rock_2'],
        height: 1,
        spriteChance: { 1: 1.0, 2: 0.4, 3: 0.2, 4: 0.08, 5: 0.02, 6: 0.005 },
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }
    }

    static oakTrees = {
        id: 'oak_forest',
        modifierType: 'components',
        sprites: ['woodland_tree_1', 'woodland_tree_2'],
        height: 2,
        spriteChance: { 1: 1.0, 2: 0.4, 3: 0.2, 4: 0.08, 5: 0.02, 6: 0.005 },
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }
    }

    static spruceTrees = {
        id: 'spruce_forest',
        modifierType: 'components',
        sprites: ['tundra_tree_1', 'tundra_tree_2'],
        height: 2,
        spriteChance: { 1: 1.0, 2: 0.4, 3: 0.2, 4: 0.08, 5: 0.02, 6: 0.005 },
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }
    }

    static cacti = {
        id: 'cacti',
        modifierType: 'components',
        sprites: ['cacti_1', 'cacti_2'],
        height: 2,
        spriteChance: { 1: 1.0, 2: 0.2, 3: 0.05, 4: 0.005, 5: 0.0, 6: 0.0 },
        stats: {
            mvmt_mod: 0,
            agt_mod: 0,
            phys_atk_mod: 0,
            elem_atk_mod: 0,
            efft_rng: 0
        }
    }

}