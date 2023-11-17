import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class TileStackViewClass {

    constructor(hexMapData, canvas) {

        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.commonUtils = new CommonHexMapUtilsClass()

        this.canvas = canvas

    }

    draw = (hexmapCtx) => {

        let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]

        for (let [key, value] of rotatedMap) {

            let keyObj = this.commonUtils.split(key)
            let tileObj = this.tileData.getAnyEntry(value)

            if (!tileObj.images || tileObj.images.length === 0) continue

            let tilePos = this.tileData.hexPositionToXYPosition(keyObj, tileObj.height, this.cameraData.rotation, {x: 0, y: 0})

            if (this.cameraData.onScreenCheck(tilePos, tileObj.images[this.cameraData.rotation]) === false) {
                continue
            }
            
            hexmapCtx.drawImage(tileObj.images[this.cameraData.rotation], tilePos.x, tilePos.y, tileObj.images[this.cameraData.rotation].width, tileObj.images[this.cameraData.rotation].height)

            let tileSelections = this.selectionData.getSelectionNames(value)

            for (let tileSelection of tileSelections) {
                hexmapCtx.drawImage(tileObj.selectionImageObject[tileSelection], tilePos.x, tilePos.y, this.mapData.size * 2, this.mapData.size * 2)
            }


        }

    }

}