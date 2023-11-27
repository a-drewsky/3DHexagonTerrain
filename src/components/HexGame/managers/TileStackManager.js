import TileStackRendererClass from '../renderers/TileStackRenderer'
import TileStackBuilderClass from '../builders/TileStackBuilder'
import CommonHexMapUtilsClass from '../commonUtils/CommonHexMapUtils'

export default class TileStackManagerClass {

    constructor(gameData, images) {
        this.data = gameData.tileData
        this.mapData = gameData.mapData
        this.selectionData = gameData.selectionData
        this.cameraData = gameData.cameraData
        this.renderer = new TileStackRendererClass(gameData, images)
        this.builder = new TileStackBuilderClass(gameData)
        this.utils = new CommonHexMapUtilsClass()
    }

    update = () => {

        this.render()
    }

    render = () => {
        //Will be needed for level editor

    }


}