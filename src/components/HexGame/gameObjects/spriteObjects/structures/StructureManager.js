import StructureRendererClass from "./StructureRenderer"
import ModifierRendererClass from "./modifier/ModifierRenderer"
import StructureBuilderClass from "./StructureBuilder"

export default class StructureManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.data = hexMapData.structureData

        this.structureRenderer = new StructureRendererClass(hexMapData, images)
        this.modifierRenderer = new ModifierRendererClass(hexMapData, images)
        this.builder = new StructureBuilderClass(hexMapData)
    }

    update = () => {
        for (let [key, value] of this.data.structureMap) {
            if (value.curState() == 'destroyed') {
                this.data.destroyStructure(value)
                return
            }
        }
    }

    render = () => {
        for (let [key, value] of this.data.structureMap) {
            if (value.render && !value.prerender){
                if(value.type != 'modifier') this.structureRenderer.renderSprite(value)
                else this.modifierRenderer.renderSprite(value)
            } 
            value.render = false
            value.prerender = false
        }
    }

}