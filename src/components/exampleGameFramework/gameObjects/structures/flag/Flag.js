import FlagDataClass from "./FlagData";
import StructureRendererClass from "../StructureRenderer";
import FlagConfig from "./FlagConfig";

export default class FlagClass {

    constructor(pos, structureName, hexMapData, tileManager, camera, settings, images){
        this.data = new FlagDataClass(pos, FlagConfig[structureName], hexMapData, images.flag)
        this.renderer = new StructureRendererClass(this.data, hexMapData, tileManager.data, camera, settings, images)
    }

}