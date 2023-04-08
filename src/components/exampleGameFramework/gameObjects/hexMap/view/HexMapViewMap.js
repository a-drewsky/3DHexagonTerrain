import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils"
import HexMapViewUtilsClass from "../utils/HexMapViewUtils"


export default class HexMapViewMapClass {

    constructor(hexMapData, spriteManager, camera, images, canvas) {

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera

        this.images = images
        this.commonUtils = new HexMapCommonUtilsClass()
        this.viewUtils = new HexMapViewUtilsClass(camera)

        this.canvasDims = {
            width: canvas.width,
            height: canvas.height
        }

    }

    draw = (drawctx) => {

        let rotatedMap = this.spriteManager.tiles.data.rotatedMapList[this.camera.rotation]
        
        for (let [key, value] of rotatedMap) {

            let keyObj = this.commonUtils.split(key)
            let tileObj = this.spriteManager.tiles.data.getEntry(value.q, value.r)

            if(!tileObj.images || tileObj.images.length == 0) continue

            let tilePos = this.spriteManager.tiles.data.hexPositionToXYPosition(keyObj, tileObj.height, this.camera.rotation)

            if (this.viewUtils.onScreenCheck({ x: tilePos.x - this.hexMapData.size, y: tilePos.y - this.hexMapData.size * this.hexMapData.squish }, { width: tileObj.images[this.camera.rotation].width, height: tileObj.images[this.camera.rotation].height }, this.canvasDims) == true) {
                drawctx.drawImage(tileObj.images[this.camera.rotation], tilePos.x - this.hexMapData.size, tilePos.y - this.hexMapData.size * this.hexMapData.squish, tileObj.images[this.camera.rotation].width, tileObj.images[this.camera.rotation].height)
            }


        }

    }

}