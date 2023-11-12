import TileStackRendererClass from './TileStackRenderer'
import TileStackBuilderClass from './TileStackBuilder'
import CommonHexMapUtilsClass from '../commonUtils/CommonHexMapUtils'

export default class TileStackManagerClass {

    constructor(hexMapData, images) {
        this.data = hexMapData.tileData
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.cameraData = hexMapData.cameraData
        this.renderer = new TileStackRendererClass(hexMapData, images)
        this.builder = new TileStackBuilderClass(hexMapData)
        this.utils = new CommonHexMapUtilsClass()
    }

    render = () => {
        //Will be needed for level editor

    }


}