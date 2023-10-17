import HexMapDataMapClass from "./HexMapDataMap"
import TileStackDataClass from "../tileStack/TileStackData"
import StructureDataClass from "../spriteObjects/structures/StructureData"
import UnitDataClass from "../spriteObjects/unit/UnitData"
import ProjectileDataClass from "../spriteObjects/projectile/ProjectileData"
import CameraDataClass from "../camera/CameraData"

import HexMapSelectionsClass from "./HexMapDataSelections";
import CardDataClass from "../cards/CardData";

export default class HexMapDataClass {

    constructor(canvas, images, uiController, globalState) {

        this.selectionData = new HexMapSelectionsClass()
        this.cardData = new CardDataClass()
        this.mapData = new HexMapDataMapClass(canvas, this.selectionData)
        this.tileData = new TileStackDataClass(this.mapData, this.selectionData, images)
        this.structureData = new StructureDataClass(this.mapData, images.structures)
        this.unitData = new UnitDataClass(this.mapData, this.tileData, images, uiController, globalState)
        this.projectileData = new ProjectileDataClass(this.mapData, this.unitData, this.structureData, this.tileData, images)
        this.cameraData = new CameraDataClass(this.mapData, canvas)

    }

}