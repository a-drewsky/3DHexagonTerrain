import villager_icon from '../../images/units/villagerUnit/villager_unit_icon.png'
import mountain_ranger_icon from '../../images/units/mountainRanger/mountain_ranger_icon.png'
import imperial_soldier_icon from '../../images/units/imperialSoldier/imperial_swordsman_icon.png'

export default class CardConfig {

    static villager_unit = {
        name: 'Billager',
        type: 'unit',
        unitId: 'villager_unit',
        image: villager_icon,
        cost: [{resource: 'gold', amount: 2}, {resource: 'copper', amount: 4}, {resource: 'iron', amount: 6}],
        description: 'An average villager meant for testing purposes. Has no unique abilities.'
    }

    static mountain_ranger = {
        name: 'Mountain Ranger',
        type: 'unit',
        unitId: 'mountain_ranger',
        image: mountain_ranger_icon,
        cost: [{resource: 'gold', amount: 2}, {resource: 'copper', amount: 4}, {resource: 'iron', amount: 6}],
        description: 'An archer from the highland realm.'
    }

    static imperial_soldier = {
        name: 'Imperial Soldier',
        type: 'unit',
        unitId: 'imperial_soldier',
        image: imperial_soldier_icon,
        cost: [{resource: 'gold', amount: 2}, {resource: 'copper', amount: 4}, {resource: 'iron', amount: 6}],
        description: 'Cool soldier boi.'
    }

}