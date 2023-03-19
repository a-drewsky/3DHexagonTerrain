import HexMapRendererMapClass from "../renderers/HexMapRendererMap";

export default class HexMapViewMapClass {

    constructor(hexMapData, camera, settings, images, utils, canvas) {

        this.hexMapData = hexMapData
        this.camera = camera

        this.images = images
        this.utils = utils

        this.canvasDims = {
            width: canvas.width,
            height: canvas.height
        }

    }

    draw = (drawctx) => {

        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        let zoom = this.camera.zoomAmount * this.camera.zoom

        let position = this.camera.position

        let filteredMapLength = [...rotatedMap].filter(([key, value]) => !this.hexMapData.getEntry(value.q, value.r).images || this.hexMapData.getEntry(value.q, value.r).images.length == 0).length

        if(filteredMapLength == 0) drawctx.drawImage(this.hexMapData.shadowMap.get(0 + ',' + this.camera.rotation), position.x, position.y, this.canvasDims.width + zoom, this.canvasDims.height + zoom * (this.canvasDims.height / this.canvasDims.width), position.x, position.y, this.canvasDims.width + zoom, this.canvasDims.height + zoom * (this.canvasDims.height / this.canvasDims.width))

        for (let [key, value] of rotatedMap) {

            let keyObj = this.hexMapData.split(key)
            let tileObj = this.hexMapData.getEntry(value.q, value.r)

            if(!tileObj.images || tileObj.images.length == 0) continue

            let tilePos = this.utils.hexPositionToXYPosition(keyObj, tileObj.height)

            if (this.utils.onScreenCheck({ x: tilePos.x - this.hexMapData.size, y: tilePos.y - this.hexMapData.size * this.hexMapData.squish }, { width: tileObj.images[this.camera.rotation].width, height: tileObj.images[this.camera.rotation].height }, this.canvasDims) == true) {
                drawctx.drawImage(tileObj.images[this.camera.rotation], tilePos.x - this.hexMapData.size, tilePos.y - this.hexMapData.size * this.hexMapData.squish, tileObj.images[this.camera.rotation].width, tileObj.images[this.camera.rotation].height)
            }


        }

    }

}