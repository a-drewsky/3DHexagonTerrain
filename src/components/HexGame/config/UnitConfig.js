export default class UnitConfig {

    /*
        resistance: {
            slashing: 0,
            piercing: 0,
            blunt: 0,
            fire: 0,
            ice: 0,
            water: 0,
            earth: 0,
            electric: 0
        }

        cost: {
            copper: 0,
            iron: 0,
            ruby: 0,
            amethyst: 0,
            jade: 0,
            lapis: 0
        }
    */

    static villager_unit = {
        id: 'villager_unit',
        sprite: 'villager',
        shadow: 'medium_round_shadow',
        name: 'Billager',
        description: 'An average villager. Has no unique abilities.',
        height: 2,
        stats: {
            range: 1, //to be removed
            drop_attack: false, //to be removed
            max_health: 100,
            movement: 4,
            mining: 3,
            resistance: {},
            movement_cost: { plains: 1, desert: 1, tundra: 2, hills: 2, forest: 2, water: 3 }
        },
        basic_ability: {
            ability_id: 'basic_slash',
            projectile: null,
            drop_attack: false,
            range: 1
        },
        special_abilities: [
            {
                ability_id: null,
                projectile: null,
                range: null,
                ability_type: null,
                cost: {}
            },
        ],
        state: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 900, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 450, type: 'action' },
            post_attack: { name: 'post_attack', rate: 150, duration: 300, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' },
            capture: { name: 'capture', rate: 450, duration: 900, type: 'action' }
        }
    }

    static mountain_ranger = {
        id: 'mountain_ranger',
        sprite: 'mountainRanger',
        shadow: 'medium_round_shadow',
        name: 'Mountain Ranger',
        description: 'An archer from the highland realm',
        height: 3,
        stats: {
            range: 3, //to be removed
            drop_attack: true, //to be removed
            max_health: 100,
            movement: 4,
            mining: 3,
            resistance: { slashing: 20, water: 20, earth: 20 },
            movement_cost: { plains: 1, desert: 1, tundra: 2, hills: 2, forest: 2, water: 3 }
        },
        basic_ability: {
            ability_id: 'basic_arrow_shot',
            projectile: 'arrow_projectile',
            drop_attack: true,
            range: 3
        },
        special_abilities: {
            example: {
                ability_id: null,
                projectile: null,
                range: null,
                ability_type: null,
                cost: {}
            },
        },
        state: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 900, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 450, type: 'action' },
            post_attack: { name: 'post_attack', rate: 150, duration: 300, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' },
            capture: { name: 'capture', rate: 450, duration: 900, type: 'action' }
        },
        abilities: {}
    }

    static imperial_soldier = {
        id: 'imperial_soldier',
        sprite: 'imperialSoldier',
        shadow: 'medium_round_shadow',
        name: 'Imperial Soldier',
        description: 'Strong soldier boi',
        height: 3,
        stats: {
            range: 1, //to be removed
            drop_attack: false, //to be removed
            max_health: 100,
            movement: 4,
            mining: 3,
            resistance: { slashing: 20, piercing: 40, blunt: 10 },
            movement_cost: { plains: 1, desert: 1, tundra: 2, hills: 2, forest: 2, water: 3 }
        },
        basic_ability: {
            ability_id: 'basic_slash',
            projectile: null,
            drop_attack: false,
            range: 1
        },
        special_abilities: {
            example: {
                ability_id: null,
                projectile: null,
                range: null,
                ability_type: null,
                cost: {}
            },
        },
        state: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 1050, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 450, type: 'action' },
            post_attack: { name: 'post_attack', rate: 150, duration: 300, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' },
            capture: { name: 'capture', rate: 450, duration: 900, type: 'action' }
        },
        abilities: {}
    }

}