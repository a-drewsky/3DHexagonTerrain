import TileStackRendererClass from './TileStackRenderer'
import TileStackViewClass from './TileStackView'
import TileStackBuilderClass from './TileStackBuilder'

export default class TileStackManagerClass {

    constructor(hexMapData, tileData, structureData, unitData, cameraData, images, canvas) {
        this.data = tileData
        this.renderer = new TileStackRendererClass(this.data, hexMapData, structureData, unitData, cameraData, images)
        this.view = new TileStackViewClass(hexMapData, this.data, this.renderer, cameraData, canvas)
        this.builder = new TileStackBuilderClass(hexMapData, this.data)
    }


   

}