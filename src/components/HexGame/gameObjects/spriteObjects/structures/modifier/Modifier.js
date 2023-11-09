import ModifierConfig from "./ModifierConfig"

export default class ModifierClass {

    constructor(pos, modifierId, images) {
        if (!ModifierConfig[modifierId]) throw Error(`Invalid Modifier ID: (${modifierId}). Modifier config properties are: [${Object.getOwnPropertyNames(ModifierConfig).splice(3)}]`)
        
        this.id = ModifierConfig[modifierId].id
        
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.rotation = null

        this.images = []
        this.shadowImages = []

        this.height = ModifierConfig[modifierId].height
        this.imageObject = images.structures.modifier
        this.sprite = ModifierConfig[modifierId].sprite
        this.sprites = ModifierConfig[modifierId].sprites

        this.render = true
        this.prerender = false

        this.type = 'modifier'
        this.modifierType = ModifierConfig[modifierId].modifierType
        if (ModifierConfig[modifierId].spriteChance) this.spriteChance = ModifierConfig[modifierId].spriteChance
        if (ModifierConfig[modifierId].cost) this.cost = ModifierConfig[modifierId].cost

        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default

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
        while (roll <= chance && numSprites < 6) {
            addSprite(positions, filteredPositions)
            numSprites++
            chance = this.spriteChance[numSprites+1]
        }
        return filteredPositions
    }

}