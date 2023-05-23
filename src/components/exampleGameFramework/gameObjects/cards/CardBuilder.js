import CardConfig from "./CardConfig";
import UnitConfig from "../spriteObjects/unit/UnitConfig"

export default class CardBuilderClass {

    buildCard = (cardId) => {
        if(!UnitConfig[cardId]) throw Error(`Invalid Card ID: (${cardId}). Card config properties are: [${Object.getOwnPropertyNames(UnitConfig).splice(3)}]`)
        let card = {
            name: CardConfig[cardId].name,
            cost: CardConfig[cardId].cost,
            image: CardConfig[cardId].image,
            description: CardConfig[cardId].description,
            type: CardConfig[cardId].type,
            flipped: true
        }

        switch(CardConfig[cardId].type){
            case 'unit':
                card.stats = this.buildUnitStats(CardConfig[cardId].unitId)
                break
        }

        return card
    }

    buildUnitStats = (unitId) => {
        return {
            health: UnitConfig[unitId].stats.health,
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