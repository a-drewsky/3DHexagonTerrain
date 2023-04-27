import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, tileData, structureData, unitData, camera, images, canvas, settings){
        this.structures = new StructureManagerClass(hexMapData, tileData, structureData, camera, images, settings)
        this.units = new UnitManagerClass(hexMapData, tileData, unitData, camera, images, settings)
        this.view = new SpriteObjectViewClass(hexMapData, tileData, this.units.data, this.structures.data, camera, images, canvas, settings)
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