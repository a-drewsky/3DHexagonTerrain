import StructureDataClass from "./StructureData"
import StructureRendererClass from "./StructureRenderer"
import ModifierRendererClass from "./ModifierRenderer"

export default class StructureManagerClass {

    constructor(hexMapData, tileData, camera, images, settings){
        this.data = new StructureDataClass(hexMapData, images.structures)
        this.structureRenderer = new StructureRendererClass(this.data, hexMapData, tileData, camera, settings, images)
        this.modifierRenderer = new ModifierRendererClass(this.data, hexMapData, tileData, camera, settings, images)
    }

}