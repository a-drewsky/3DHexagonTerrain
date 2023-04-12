import TileStackDataClass from './TileStackData'
import TileStackRendererClass from './TileStackRenderer'
import TileStackViewClass from './TileStackView'
import TileStackBuilderClass from './TileStackBuilder'

export default class TileStackManagerClass {

    constructor(hexMapData, camera, images, settings, canvas) {
        this.data = new TileStackDataClass(hexMapData, images)
        this.renderer = new TileStackRendererClass(this.data, hexMapData, camera, images, settings)
        this.view = new TileStackViewClass(hexMapData, this.data, this.renderer, camera, canvas)
        this.builder = new TileStackBuilderClass(hexMapData, this.data, settings)
    }


   

}