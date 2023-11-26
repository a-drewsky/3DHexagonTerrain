import StructureRendererClass from "../renderers/StructureRenderer"
import ModifierRendererClass from "../renderers/ModifierRenderer"
import StructureBuilderClass from "../gameObjects/spriteObjects/structures/StructureBuilder"

export default class StructureManagerClass {

    constructor(hexMapData, images, uiController) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.data = hexMapData.structureData

        this.uiController = uiController

        this.structureRenderer = new StructureRendererClass(hexMapData, images)
        this.modifierRenderer = new ModifierRendererClass(hexMapData, images)
        this.builder = new StructureBuilderClass(hexMapData)
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