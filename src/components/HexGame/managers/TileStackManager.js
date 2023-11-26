import TileStackRendererClass from '../renderers/TileStackRenderer'
import TileStackBuilderClass from '../gameObjects/tileStack/TileStackBuilder'
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

    update = () => {

        this.render()
    }

    render = () => {
        //Will be needed for level editor

    }


}