import HexMapDataMapClass from "./HexMapDataMap"
import TileStackDataClass from "../tileStack/TileStackData"
import StructureDataClass from "../spriteObjects/structures/StructureData"
import UnitDataClass from "../spriteObjects/unit/UnitData"
import ProjectileDataClass from "../spriteObjects/projectile/ProjectileData"
import CameraDataClass from "../camera/CameraData"
import SelectionDataClass from "./selections/SelectionData"

import CardDataClass from "../cards/CardData"

export default class HexMapDataClass {

    constructor(canvas, images, uiController) {

        this.cardData = new CardDataClass()
        this.mapData = new HexMapDataMapClass(canvas)
        this.selectionData = new SelectionDataClass(this.mapData)
        this.tileData = new TileStackDataClass(this.mapData, images)
        this.structureData = new StructureDataClass(images)
        this.unitData = new UnitDataClass(this.tileData, images, uiController)
        this.projectileData = new ProjectileDataClass(this.unitData, this.structureData, this.tileData, images)
        this.cameraData = new CameraDataClass(this.mapData, canvas)

    }

}