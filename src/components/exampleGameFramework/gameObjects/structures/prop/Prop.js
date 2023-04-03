import PropDataClass from "./PropData";
import StructureRendererClass from "../StructureRenderer";
import PropConfig from "./PropConfig";

export default class PropClass{

    constructor(pos, structureName, hexMapData, camera, settings, images){
        this.data = new PropDataClass(pos, PropConfig[structureName], hexMapData, images.prop)
        this.renderer = new StructureRendererClass(this.data, hexMapData, camera, settings, images)
    }

}