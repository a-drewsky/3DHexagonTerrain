import UnitDataClass from "./UnitData"
import UnitRendererClass from "./UnitRenderer"
import UnitViewClass from "./UnitView"

export default class UnitClass {

    constructor(pos, hexMapData, camera, images, settings){
        this.data = new UnitDataClass(pos, hexMapData, images.unit.villager)
        this.renderer = new UnitRendererClass(this.data, hexMapData, camera, settings, images)
        this.view = new UnitViewClass(camera)
    }

    initialize(stats) {
        
    }

}