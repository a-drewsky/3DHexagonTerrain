import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, tileData, structureData, unitData, cameraData, images, canvas){
        this.structures = new StructureManagerClass(hexMapData, tileData, structureData, cameraData, images)
        this.units = new UnitManagerClass(hexMapData, tileData, unitData, cameraData, images)
        this.view = new SpriteObjectViewClass(hexMapData, tileData, this.units.data, this.structures.data, cameraData, images, canvas)
    }

    update = () => {
        this.units.update()
        this.structures.update()
    }

    render = () => {
        this.units.render()
        this.structures.render()
    }

}