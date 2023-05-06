import StructureClass from "../Structure"
import ModifierConfig from "./ModifierConfig"

export default class ModifierClass extends StructureClass{

    constructor(pos, structureName, hexMapData, images){
        super(pos, ModifierConfig[structureName], hexMapData, images.modifier)
        this.type = 'modifier'
        this.modifierType = ModifierConfig[structureName].modifierType
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default

        this.spritePositions = this.createSpritePosition()
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
    }

    update = () => {

    }

    createSpritePosition = () => {
        let positions = [0, 1, 2, 3, 4, 5]

        //create pos list
        let filteredPositions = []

        let currentIndex = Math.floor(Math.random() * positions.length)
        filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * this.imageObject.modifierImages.length) })
        positions.splice(currentIndex, 1)

        let chance = this.secondSpriteChance
        let roll = Math.random()
        while (roll > chance && positions.length > 0) {
            currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * this.imageObject.modifierImages.length) })
            positions.splice(currentIndex, 1)

            chance += this.spriteIncrementChance
            roll = Math.random()
        }

        return filteredPositions
    }

}