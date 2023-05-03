import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class TileStackViewClass {

    constructor(hexMapData, tileData, tileRenderer, cameraData, canvas) {

        this.hexMapData = hexMapData
        this.tileData = tileData
        this.tileRenderer = tileRenderer
        this.cameraDataData = cameraData

        this.commonUtils = new CommonHexMapUtilsClass()

        this.canvas = canvas

    }

    draw = (drawctx) => {

        let rotatedMap = this.tileData.rotatedMapList[this.cameraDataData.rotation]

        for (let [key, value] of rotatedMap) {

            let keyObj = this.commonUtils.split(key)
            let tileObj = this.tileData.getEntry(value.q, value.r)

            if (!tileObj.images || tileObj.images.length == 0) continue

            let tilePos = this.tileData.hexPositionToXYPosition(keyObj, tileObj.height, this.cameraDataData.rotation)

            if (this.cameraDataData.onScreenCheck({ x: tilePos.x - this.hexMapData.size, y: tilePos.y - this.hexMapData.size * this.hexMapData.squish }, { width: tileObj.images[this.cameraDataData.rotation].width, height: tileObj.images[this.cameraDataData.rotation].height }) == true) {
                drawctx.drawImage(tileObj.images[this.cameraDataData.rotation], tilePos.x - this.hexMapData.size, tilePos.y - this.hexMapData.size * this.hexMapData.squish, tileObj.images[this.cameraDataData.rotation].width, tileObj.images[this.cameraDataData.rotation].height)
            }

            let tileSelections = this.hexMapData.getSelections(value.q, value.r)

            for (let tileSelection of tileSelections) {
                if (this.hexMapData.selections.stateSelections[tileSelection]) tileSelection = this.hexMapData.selections.stateSelections[tileSelection][this.hexMapData.curState()]

                if (tileSelection !== null) {
                    this.drawHighlight(drawctx, value, tileSelection)
                }
            }


        }

    }



    drawHighlight = (drawctx, position, selection) => {

        let tile = this.tileData.getEntry(position.q, position.r)

        let tilePos = this.tileData.hexPositionToXYPosition(this.commonUtils.rotateTile(position.q, position.r, this.cameraDataData.rotation), tile.height, this.cameraDataData.rotation)

        if (!tile.selectionImages[selection] || !tile.selectionImages[selection][this.cameraDataData.rotation]) {
            this.tileRenderer.renderSelectionImage(tile, selection)
        }

        let sprite = tile.selectionImages[selection][this.cameraDataData.rotation]

        drawctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)



    }

}