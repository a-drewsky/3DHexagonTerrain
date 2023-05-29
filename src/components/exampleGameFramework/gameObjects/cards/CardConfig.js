import villager_icon from '../../images/units/villagerUnit/villager_unit_icon.png'

export default class CardConfig {

    static villager_unit = {
        name: 'Billager',
        type: 'unit',
        unitId: 'villager_unit',
        image: villager_icon,
        cost: [{resource: 'gold', amount: 2}, {resource: 'copper', amount: 4}, {resource: 'iron', amount: 6}],
        description: 'An average villager meant for testing purposes. Has no unique abilities.'
    }

}