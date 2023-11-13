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
            if (value.curState() === 'destroyed') {
                this.data.destroyStructure(value)
                return
            }
            switch(value.type){
                case 'flag':
                    this.updateFlag(value)
                    continue
                default:
                    continue
            }
        }
    }

    updateFlag = (flag) => {
        
        if(flag.captured){
            this.selectionData.clearAllSelections()
            this.uiController.setEndGameMenu(true)
        }
    }

    render = () => {
        for (let [key, value] of this.data.structureMap) {
            if (value.render && !value.prerender){
                if(value.type !== 'modifier') this.structureRenderer.renderSprite(value)
                else this.modifierRenderer.renderSprite(value)
            } 
            value.render = false
            value.prerender = false
        }
    }

}