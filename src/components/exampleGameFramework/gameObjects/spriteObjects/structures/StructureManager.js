import StructureRendererClass from "./StructureRenderer"
import ModifierRendererClass from "./ModifierRenderer"
import StructureBuilderClass from "./StructureBuilder"

export default class StructureManagerClass {

    constructor(hexMapData, tileData, structureData, cameraData, images) {
        this.hexMapData = hexMapData
        this.data = structureData

        this.structureRenderer = new StructureRendererClass(this.data, hexMapData, tileData, cameraData, images)
        this.modifierRenderer = new ModifierRendererClass(this.data, hexMapData, tileData, cameraData, images)
        this.builder = new StructureBuilderClass(hexMapData, tileData, this.data)
    }

    update = () => {
        for (let [key, value] of this.data.structureMap) {
            value.update()
            if (value.state.current.name == 'destroyed') {
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