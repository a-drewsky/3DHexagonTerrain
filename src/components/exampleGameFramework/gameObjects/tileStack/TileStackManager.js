import TileStackRendererClass from './TileStackRenderer'
import TileStackViewClass from './TileStackView'
import TileStackBuilderClass from './TileStackBuilder'
import TileStackSelectionModifierClass from './TileStackSelectionModifier'

export default class TileStackManagerClass {

    constructor(hexMapData, tileData, structureData, unitData, cameraData, images, canvas) {
        this.data = tileData
        this.renderer = new TileStackRendererClass(tileData, hexMapData, structureData, unitData, cameraData, images)
        this.view = new TileStackViewClass(hexMapData, tileData, this.renderer, cameraData, canvas)
        this.builder = new TileStackBuilderClass(hexMapData, tileData)
    }


   

}