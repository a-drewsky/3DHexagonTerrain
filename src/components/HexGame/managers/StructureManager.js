import StructureRendererClass from "../renderers/StructureRenderer"
import ModifierRendererClass from "../renderers/ModifierRenderer"
import StructureBuilderClass from "../builders/StructureBuilder"

export default class StructureManagerClass {

    constructor(gameData, images) {
        this.mapData = gameData.mapData
        this.selectionData = gameData.selectionData
        this.data = gameData.structureData

        this.structureRenderer = new StructureRendererClass(gameData, images)
        this.modifierRenderer = new ModifierRendererClass(gameData, images)
        this.builder = new StructureBuilderClass(gameData)
    }

    update = () => {
        for (let [key, value] of this.data.structureMap) {
            switch (value.spriteType) {
                case 'bunker':
                    this.updateBunker(value)
                    continue
                case 'resource':
                    this.updateResource(value)
                    continue
                case 'flag':
                    this.updateFlag(value)
                    continue
                default:
                    continue
            }
        }
    }

    updateFlag = (flag) => {
        if (flag.isCaptured()) {
            this.mapData.setState('end')
            this.selectionData.clearAllSelections()
        }
    }

    updateResource = (resource) => {
        if (resource.curState() === 'destroyed') this.data.destroyStructure(resource)
    }

    updateBunker = (bunker) => {
        if (bunker.curState() === 'destroyed') this.data.destroyStructure(bunker)
    }

    render = () => {
        for (let [key, value] of this.data.structureMap) {
            if (value.render && !value.prerender) {
                if (value.spriteType !== 'modifier') this.structureRenderer.renderSprite(value)
                else this.modifierRenderer.renderSprite(value)
                value.render = false
            }
        }
    }

}