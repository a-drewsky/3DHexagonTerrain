import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class TileStackViewClass {

    constructor(hexMapData, tileData, tileRenderer, cameraData, canvas) {

        this.hexMapData = hexMapData
        this.tileData = tileData
        this.tileRenderer = tileRenderer
        this.cameraData = cameraData

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

            if (this.cameraData.onScreenCheck({ x: tilePos.x - this.hexMapData.size, y: tilePos.y - this.hexMapData.size * this.hexMapData.squish }, { width: tileObj.images[this.cameraData.rotation].width, height: tileObj.images[this.cameraData.rotation].height }) == true) {
                drawctx.drawImage(tileObj.images[this.cameraData.rotation], tilePos.x - this.hexMapData.size, tilePos.y - this.hexMapData.size * this.hexMapData.squish, tileObj.images[this.cameraData.rotation].width, tileObj.images[this.cameraData.rotation].height)
            }

            let tileSelections = this.hexMapData.getSelections(value.q, value.r)

            for (let tileSelection of tileSelections) {
                if (this.hexMapData.selections.stateSelections[tileSelection]) tileSelection = this.hexMapData.selections.stateSelections[tileSelection][this.hexMapData.curState()]

                if (tileSelection !== null) {
                    // tileSelection = this.hexMapData.selections.modifySelection(tileSelection, value)
                    this.drawHighlight(drawctx, value, tileSelection)
                }
            }


        }

    }



    drawHighlight = (drawctx, position, selection) => {

        let tile = this.tileData.getAnyEntry(position.q, position.r)

        let tilePos = this.tileData.hexPositionToXYPosition(this.commonUtils.rotateTile(position.q, position.r, this.cameraData.rotation), tile.height, this.cameraData.rotation)

        if (!tile.selectionImages[selection] || !tile.selectionImages[selection][this.cameraData.rotation]) {
            this.tileRenderer.renderSelectionImage(tile, selection)
        }

        let sprite = tile.selectionImages[selection][this.cameraData.rotation]

        drawctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)



    }

}