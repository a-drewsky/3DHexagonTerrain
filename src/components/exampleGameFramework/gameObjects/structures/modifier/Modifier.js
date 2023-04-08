import ModifierDataClass from "./ModifierData";
import ModifierRendererClass from "./ModifierRenderer";
import ModifierConfig from "./ModifierConfig";

export default class ModifierClass{

    constructor(pos, structureName, hexMapData, tileManager, camera, settings, images){
        this.data = new ModifierDataClass(pos, ModifierConfig[structureName], hexMapData, images.modifier)
        this.renderer = new ModifierRendererClass(this.data, hexMapData, tileManager.data, camera, settings, images)
    }

}