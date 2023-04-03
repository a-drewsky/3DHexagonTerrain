import HexMapUnitManagerClass from "./HexMapUnitManager";
import HexMapStructureManagerClass from "./HexMapStructureManager";

export default class HexMapSpriteManagerClass{

    constructor(hexMapData, camera, images, settings){
        this.units = new HexMapUnitManagerClass(hexMapData, camera, images, settings)
        this.structures = new HexMapStructureManagerClass(hexMapData, camera, images, settings)
    }

}