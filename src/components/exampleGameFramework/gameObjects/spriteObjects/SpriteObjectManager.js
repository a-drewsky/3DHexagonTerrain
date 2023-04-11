import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"

import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, tileData, camera, images, canvas, settings){
        this.units = new UnitManagerClass(hexMapData, tileData, camera, images, settings)
        this.structures = new StructureManagerClass(hexMapData, tileData, camera, images, settings)
        this.view = new SpriteObjectViewClass(hexMapData, tileData, this.units.data, this.structures.data, camera, images, canvas, settings)
    }

}