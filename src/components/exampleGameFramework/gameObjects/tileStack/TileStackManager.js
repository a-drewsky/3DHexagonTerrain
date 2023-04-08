import TileStackDataClass from './TileStackData'
import TileStackRendererClass from './TileStackRenderer'

export default class TileStackManagerClass {

    constructor(hexMapData, camera, images, settings) {
        this.data = new TileStackDataClass(hexMapData)
        this.renderer = new TileStackRendererClass(this.data, hexMapData, camera, images, settings)
    }


   

}