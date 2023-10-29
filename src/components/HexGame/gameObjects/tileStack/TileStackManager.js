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

        for (let [key, value] of this.data.tileMap) {


            if(!value.rendered) continue

            let tilePos = this.data.hexPositionToXYPosition(value.position, value.height, this.cameraData.rotation)

            if (this.cameraData.onScreenCheck({ x: tilePos.x - this.mapData.size, y: tilePos.y - this.mapData.size * this.mapData.squish }, { width: value.images[this.cameraData.rotation].width, height: value.images[this.cameraData.rotation].height }) == false) {
                continue
            }

            let tileSelections = this.selectionData.getSelectionNames(value.position.q, value.position.r)

            for (let tileSelection of tileSelections) {

                if (!value.selectionImageObject[tileSelection]) throw Error(`Invalid Tile Selection: (${tileSelection}). Tile selection properties are: [${Object.getOwnPropertyNames(value.selectionImageObject).splice(3)}]`)

                if (!value.selectionImages[tileSelection] || !value.selectionImages[tileSelection][this.cameraData.rotation]) {
                    this.renderer.renderSelectionImage(value, tileSelection)
                }

            }
        }

    }


}