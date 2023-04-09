import UnitDataClass from "./UnitData"
import UnitRendererClass from "./UnitRenderer"

export default class UnitManagerClass {

    constructor(hexMapData, tileData, camera, images, settings){
        this.data = new UnitDataClass(hexMapData, images)
        this.renderer = new UnitRendererClass(this.data, hexMapData, tileData, camera, settings, images)
    }

}