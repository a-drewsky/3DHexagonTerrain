import AbilityConfig from "../config/AbilityConfig"

export default class AbilityInterfaceClass {

    constructor(gameData){
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData
    }

    executeAbility = (abilityId, target, sender) => {
        let ability = AbilityConfig[abilityId]

        for(let attack in ability.stats.damage){
            let totalDamage = ability.stats.damage[attack]
            if(target.stats.resistance[attack]) totalDamage -= target.stats.resistance[attack]
            totalDamage = Math.max(totalDamage, 0)
            target.health -= totalDamage
        }

        if (target.spriteType === 'unit') {
            target.setAnimation('hit')
        } else {
            target.updateState()
        }
    }

}