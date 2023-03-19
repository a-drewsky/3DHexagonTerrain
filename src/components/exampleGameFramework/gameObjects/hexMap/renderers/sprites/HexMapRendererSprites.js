import HexMapViewUtilsClass from "../../utils/HexMapViewUtils";
import HexMapRendererSpritesModifiersClass from "./HexMapRendererSpritesModifiers";
import HexMapRendererSpritesStructuresClass from "./HexMapRendererSpritesStructures";
import HexMapRendererSpritesUnitsClass from "./HexMapRendererSpritesUnits";

export default class HexMapRendererSpritesClass {

    constructor(hexMapData, camera, settings, images) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = new HexMapViewUtilsClass(hexMapData, camera, settings, images);


        this.modifiers = new HexMapRendererSpritesModifiersClass(hexMapData, camera, settings, images, this.utils)
        this.structures = new HexMapRendererSpritesStructuresClass(hexMapData, camera, images, this.utils)
        this.units = new HexMapRendererSpritesUnitsClass(hexMapData, camera, images, this.utils)

    }


    prerenderTerrain = (terrainObject) => {

        if (terrainObject == null) return

        if (terrainObject.type == 'modifier') this.modifiers.render(terrainObject)
        else this.structures.render(terrainObject)

    }

    prerenderUnits = () => {
        for (let i = 0; i < this.hexMapData.unitList.length; i++) {

            let unitObject = this.hexMapData.unitList[i]

            if (unitObject == null) continue

            this.units.render(unitObject)

        }
    }

}