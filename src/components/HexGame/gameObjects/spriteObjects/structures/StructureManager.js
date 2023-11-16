import StructureRendererClass from "./StructureRenderer"
import ModifierRendererClass from "./modifier/ModifierRenderer"
import StructureBuilderClass from "./StructureBuilder"

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
            switch (value.type) {
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

    //fix the prerender thing
    render = () => {
        for (let [key, value] of this.data.structureMap) {
            if (value.render && !value.prerender) {
                if (value.type !== 'modifier') this.structureRenderer.renderSprite(value)
                else this.modifierRenderer.renderSprite(value)
            }
            value.render = false
            value.prerender = false
        }
    }

    updateFlag = (flag) => {
        //set hexmap state to end and update this in the hexmap ui updater
        if (flag.isCaptured()) this.uiController.setEndGameMenu(true)
    }

    updateResource = (resource) => {
        if (resource.curState() === 'destroyed') this.data.destroyStructure(resource)
    }

    updateBunker = (bunker) => {
        if (bunker.curState() === 'destroyed') this.data.destroyStructure(bunker)
    }

}