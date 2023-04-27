import StructureRendererClass from "./StructureRenderer"
import ModifierRendererClass from "./ModifierRenderer"
import StructureBuilderClass from "./StructureBuilder"

export default class StructureManagerClass {

    constructor(hexMapData, tileData, structureData, camera, images) {
        this.hexMapData = hexMapData
        this.data = structureData

        this.structureRenderer = new StructureRendererClass(this.data, hexMapData, tileData, camera, images)
        this.modifierRenderer = new ModifierRendererClass(this.data, hexMapData, tileData, camera, images)
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
                if(value.type != 'modifier') this.structureRenderer.render(value)
                else this.modifierRenderer.render(value)
            } 
            value.render = false
            value.prerender = false
        }
    }

}