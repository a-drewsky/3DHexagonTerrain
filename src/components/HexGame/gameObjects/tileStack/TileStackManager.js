import TileStackRendererClass from './TileStackRenderer'
import TileStackViewClass from './TileStackView'
import TileStackBuilderClass from './TileStackBuilder'
import CommonHexMapUtilsClass from '../commonUtils/CommonHexMapUtils'

export default class TileStackManagerClass {

    constructor(hexMapData, images, canvas) {
        this.data = hexMapData.tileData
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.cameraData = hexMapData.cameraData
        this.renderer = new TileStackRendererClass(hexMapData, images)
        this.view = new TileStackViewClass(hexMapData, this.renderer, canvas)
        this.builder = new TileStackBuilderClass(hexMapData)
        this.utils = new CommonHexMapUtilsClass()
    }

    render = () => {



    }


}