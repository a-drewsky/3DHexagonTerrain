import HexMapRendererUtilsClass from "../../utils/HexMapRendererUtils";
import HexMapRendererSpritesModifiersClass from "./HexMapRendererSpritesModifiers";
import HexMapRendererSpritesStructuresClass from "./HexMapRendererSpritesStructures";

export default class HexMapRendererSpritesClass {

    constructor(hexMapData, spriteManager, camera, settings, images) {

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.images = images
        this.utils = new HexMapRendererUtilsClass(hexMapData, camera, settings, images);


        this.modifiers = new HexMapRendererSpritesModifiersClass(hexMapData, camera, settings, images, this.utils)
        this.structures = new HexMapRendererSpritesStructuresClass(hexMapData, camera, images, this.utils)

    }


    // prerenderTerrain = (terrainObject) => {

    //     if (terrainObject == null) return

    //     if (terrainObject.type == 'modifier') this.modifiers.render(terrainObject)
    //     else this.structures.render(terrainObject)

    // }

}