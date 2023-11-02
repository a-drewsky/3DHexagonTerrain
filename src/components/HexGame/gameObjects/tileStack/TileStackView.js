import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class TileStackViewClass {

    constructor(hexMapData, tileRenderer, canvas) {

        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData
        this.tileRenderer = tileRenderer

        this.commonUtils = new CommonHexMapUtilsClass()

        this.canvas = canvas

    }

    draw = (drawctx) => {

        let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]

        for (let [key, value] of rotatedMap) {

            let keyObj = this.commonUtils.split(key)
            let tileObj = this.tileData.getAnyEntry(value.q, value.r)

            if (!tileObj.images || tileObj.images.length == 0) continue

            let tilePos = this.tileData.hexPositionToXYPosition(keyObj, tileObj.height, this.cameraData.rotation)

            if (this.cameraData.onScreenCheck({ x: tilePos.x - this.mapData.size, y: tilePos.y - this.mapData.size * this.mapData.squish }, { width: tileObj.images[this.cameraData.rotation].width, height: tileObj.images[this.cameraData.rotation].height }) == false) {
                continue
            }
            
            drawctx.drawImage(tileObj.images[this.cameraData.rotation], tilePos.x - this.mapData.size, tilePos.y - this.mapData.size * this.mapData.squish, tileObj.images[this.cameraData.rotation].width, tileObj.images[this.cameraData.rotation].height)

            let tileSelections = this.selectionData.getSelectionNames(value.q, value.r)

            for (let tileSelection of tileSelections) {
                drawctx.drawImage(tileObj.selectionImageObject[tileSelection], tilePos.x - this.mapData.size, tilePos.y - this.mapData.size * this.mapData.squish, this.mapData.size * 2, this.mapData.size * 2)
            }


        }

    }

}