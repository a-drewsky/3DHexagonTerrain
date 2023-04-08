import UnitManagerClass from "../../unit/UnitManager";
import StructureManagerClass from "../../structures/StructureManager";
import TileStackManagerClass from "../../tileStack/TileStackManager";

export default class HexMapSpriteManagerClass{

    constructor(hexMapData, camera, images, settings){
        this.tiles = new TileStackManagerClass(hexMapData, camera, images, settings)
        this.units = new UnitManagerClass(hexMapData, this.tiles, camera, images, settings)
        this.structures = new StructureManagerClass(hexMapData, this.tiles, camera, images, settings)
    }

}