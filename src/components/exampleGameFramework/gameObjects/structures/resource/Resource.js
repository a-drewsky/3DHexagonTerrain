import ResourceDataClass from "./ResourceData";
import StructureRendererClass from "../StructureRenderer";
import ResourceConfig from "./ResourceConfig";

export default class ResourceClass{

    constructor(pos, structureName, hexMapData, tileManager, camera, settings, images){
        this.data = new ResourceDataClass(pos, ResourceConfig[structureName], hexMapData, images.resource)
        this.renderer = new StructureRendererClass(this.data, hexMapData, tileManager.data, camera, settings, images)
    }

}