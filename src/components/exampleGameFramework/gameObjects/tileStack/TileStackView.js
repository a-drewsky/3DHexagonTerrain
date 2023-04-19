import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import CommonViewUtilsClass from "../commonUtils/CommonViewUtils"

export default class TileStackViewClass {

    constructor(hexMapData, tileData, tileRenderer, camera, canvas) {

        this.hexMapData = hexMapData
        this.tileData = tileData
        this.tileRenderer = tileRenderer
        this.camera = camera

        this.commonUtils = new CommonHexMapUtilsClass()
        this.viewUtils = new CommonViewUtilsClass(camera)

        this.canvas = canvas

    }

    draw = (drawctx) => {

        let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]

        for (let [key, value] of rotatedMap) {

            let keyObj = this.commonUtils.split(key)
            let tileObj = this.tileData.getEntry(value.q, value.r)

            if (!tileObj.images || tileObj.images.length == 0) continue

            let tilePos = this.tileData.hexPositionToXYPosition(keyObj, tileObj.height, this.camera.rotation)

            if (this.viewUtils.onScreenCheck({ x: tilePos.x - this.hexMapData.size, y: tilePos.y - this.hexMapData.size * this.hexMapData.squish }, { width: tileObj.images[this.camera.rotation].width, height: tileObj.images[this.camera.rotation].height }, this.canvas) == true) {
                drawctx.drawImage(tileObj.images[this.camera.rotation], tilePos.x - this.hexMapData.size, tilePos.y - this.hexMapData.size * this.hexMapData.squish, tileObj.images[this.camera.rotation].width, tileObj.images[this.camera.rotation].height)
            }

            let tileSelection = this.hexMapData.getSelection(value.q, value.r)

            if(this.hexMapData.selections.stateSelections[tileSelection]) tileSelection = this.hexMapData.selections.stateSelections[tileSelection][this.hexMapData.state.current]

            if (tileSelection !== null) {
                this.drawHighlight(drawctx, value, tileSelection)
            }


        }

    }



    drawHighlight = (drawctx, position, selection) => {

        let tile = this.tileData.getEntry(position.q, position.r)

        let tilePos = this.tileData.hexPositionToXYPosition(this.commonUtils.rotateTile(position.q, position.r, this.camera.rotation), tile.height, this.camera.rotation)

        if (!tile.selectionImages[selection] || !tile.selectionImages[selection][this.camera.rotation]) {
            this.tileRenderer.renderSelectionImage(tile, selection)
        }

        let sprite = tile.selectionImages[selection][this.camera.rotation]

        drawctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)



    }

}