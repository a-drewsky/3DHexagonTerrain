
import ModifierConfig from "../../../config/ModifierConfig"

import ModifierClass from "./Modifier"

export default class CombinedImageModifierClass extends ModifierClass {
    constructor(pos, modifierId, images) {
        if (!ModifierConfig[modifierId]) throw Error(`Invalid Modifier ID: (${modifierId}). Modifier config properties are: [${Object.getOwnPropertyNames(ModifierConfig).splice(3)}]`)
        super(pos, modifierId, images)

        this.sprites = ModifierConfig[modifierId].sprites

        if (ModifierConfig[modifierId].spriteChance) this.spriteChance = ModifierConfig[modifierId].spriteChance
        if (ModifierConfig[modifierId].cost) this.cost = ModifierConfig[modifierId].cost

        if (this.spriteChance) this.spritePositions = this.createSpritePosition()
    }

    createSpritePosition = () => {
        let addSprite = (positions, filteredPositions) => {
            let currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], image: this.sprites[Math.floor(Math.random() * this.sprites.length)] })
            positions.splice(currentIndex, 1)
        }

        let positions = [0, 1, 2, 3, 4, 5]
        let filteredPositions = []

        let roll = Math.random()
        let numSprites = 0
        let chance = 1.0
        while (roll <= chance && numSprites < 5) {
            addSprite(positions, filteredPositions)
            numSprites++
            chance = this.spriteChance[numSprites+1]
        }
        return filteredPositions
    }
}