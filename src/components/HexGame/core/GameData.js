import HexMapDataClass from "../data/HexMapData"
import TileStackDataClass from "../data/TileStackData"
import StructureDataClass from "../data/StructureData"
import UnitDataClass from "../data/UnitData"
import ProjectileDataClass from "../data/ProjectileData"
import CameraDataClass from "../data/CameraData"
import SelectionDataClass from "../data/SelectionData"
import CardDataClass from "../data/CardData"

export default class GameDataClass {

    constructor(canvas, images) {

        this.cardData = new CardDataClass()
        this.mapData = new HexMapDataClass(canvas)
        this.selectionData = new SelectionDataClass(this.mapData)
        this.tileData = new TileStackDataClass(this.mapData, images)
        this.structureData = new StructureDataClass(images)
        this.unitData = new UnitDataClass(this.tileData, images)
        this.projectileData = new ProjectileDataClass(this.tileData, images)
        this.cameraData = new CameraDataClass(this.mapData, canvas)

    }

}