import BunkerDataClass from "./BunkerData";
import StructureRendererClass from "../StructureRenderer";
import BunkerConfig from "./BunkerConfig";

export default class BunkerClass {

    constructor(pos, structureName, hexMapData, camera, settings, images){
        this.data = new BunkerDataClass(pos, BunkerConfig[structureName], hexMapData, images.bunker)
        this.renderer = new StructureRendererClass(this.data, hexMapData, camera, settings, images)
    }

}