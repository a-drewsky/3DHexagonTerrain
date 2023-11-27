import CardConfig from "../config/CardConfig"
import UnitConfig from "../config/UnitConfig"

export default class CardClass {

    constructor(cardId) {
        if (!CardConfig[cardId]) throw Error(`Invalid Card ID: (${cardId}). Card config properties are: [${Object.getOwnPropertyNames(CardConfig).splice(3)}]`)

        this.name = CardConfig[cardId].name
        this.unitId = CardConfig[cardId].unitId
        this.cost = CardConfig[cardId].cost
        this.image = CardConfig[cardId].image
        this.description = CardConfig[cardId].description
        this.type = CardConfig[cardId].type
        this.flipped = true

        switch (CardConfig[cardId].type) {
            case 'unit':
                this.buildUnitStats(CardConfig[cardId].unitId)
                return
            default:
                return
        }

    }

    buildUnitStats = (unitId) => {
        this.stats = {
            health: UnitConfig[unitId].stats.max_health,
            movement: UnitConfig[unitId].stats.movement,
            mining: UnitConfig[unitId].stats.mining,
            physical_attack: UnitConfig[unitId].stats.physical_attack,
            physical_attack_modifications: UnitConfig[unitId].stats.physical_attack_modifications,
            elemental_attack: UnitConfig[unitId].stats.elemental_attack,
            elemental_attack_modifications: UnitConfig[unitId].stats.elemental_attack_modifications,
            physical_resistance: UnitConfig[unitId].stats.physical_resistance,
            physical_resistance_modifications: UnitConfig[unitId].stats.physical_resistance_modifications,
            elemental_resistance: UnitConfig[unitId].stats.elemental_resistance,
            elemental_resistance_modifications: UnitConfig[unitId].stats.elemental_resistance_modifications,
        }
    }

}