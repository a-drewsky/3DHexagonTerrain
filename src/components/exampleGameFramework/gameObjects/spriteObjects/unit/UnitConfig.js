export default class UnitConfig {

    static villager_unit = {
        id: 'villager_unit',
        sprite: 'villager',
        name: 'Billager',
        description: 'An average villager. Has no unique abilities.',
        height: 3,
        stats: {
            health: 100,
            movement: 4,
            mining: 3,
            physical_attack: 25,
            physical_attack_modifications: [{name: 'sav-', color: 'orange'}, {name: 'mtn+', color: 'mediumpurple'}, {name: 'des-', color: 'gold'}],
            elemental_attack: 35,
            elemental_attack_modifications: [{name: 'grs-', color: 'lightgreen'}, {name: 'sav+', color: 'orange'}],
            physical_resistance: 5,
            physical_resistance_modifications: [{name: 'tdr+', color: 'lightblue'}],
            elemental_resistance: 10,
            elemental_resistance_modifications: [{name: 'des+', color: 'gold'}],
        },
        animations: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 900, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 750, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' }
        },
        abilities: {}
    }

    static mountain_ranger = {
        id: 'mountain_ranger',
        sprite: 'mountainRanger',
        name: 'Mountain Ranger',
        description: 'An archer from the highland realm',
        height: 3,
        stats: {
            health: 100,
            movement: 4,
            mining: 3,
            physical_attack: 25,
            physical_attack_modifications: [{name: 'sav-', color: 'orange'}, {name: 'mtn+', color: 'mediumpurple'}, {name: 'des-', color: 'gold'}],
            elemental_attack: 35,
            elemental_attack_modifications: [{name: 'grs-', color: 'lightgreen'}, {name: 'sav+', color: 'orange'}],
            physical_resistance: 5,
            physical_resistance_modifications: [{name: 'tdr+', color: 'lightblue'}],
            elemental_resistance: 10,
            elemental_resistance_modifications: [{name: 'des+', color: 'gold'}],
        },
        animations: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 900, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 750, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' }
        },
        abilities: {}
    }

    static imperial_soldier = {
        id: 'imperial_soldier',
        sprite: 'imperialSoldier',
        name: 'Imperial Soldier',
        description: 'Strong soldier boi',
        height: 3,
        stats: {
            health: 100,
            movement: 4,
            mining: 3,
            physical_attack: 25,
            physical_attack_modifications: [{name: 'sav-', color: 'orange'}, {name: 'mtn+', color: 'mediumpurple'}, {name: 'des-', color: 'gold'}],
            elemental_attack: 35,
            elemental_attack_modifications: [{name: 'grs-', color: 'lightgreen'}, {name: 'sav+', color: 'orange'}],
            physical_resistance: 5,
            physical_resistance_modifications: [{name: 'tdr+', color: 'lightblue'}],
            elemental_resistance: 10,
            elemental_resistance_modifications: [{name: 'des+', color: 'gold'}],
        },
        animations: {
            idle: { name: 'idle', rate: 900, duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 1050, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 750, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' }
        },
        abilities: {}
    }

}