import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"

export default class ShadowRendererClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.images = images

        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    renderActionShadow = (spriteObject, position) => {

        let shadowImage = spriteObject.shadowImageObject[this.cameraData.rotation]

        let nearestTile = this.commonUtils.roundToNearestHex(position)
        nearestTile = this.tileData.getEntry(nearestTile)

        position = this.commonUtils.rotateTile(position, this.cameraData.rotation)
        let shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }
        let shadowPos = this.tileData.hexPositionToXYPosition(position, nearestTile.height, this.cameraData.rotation, shadowImage.offset)

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) === false) return

        let croppedImage = this.utils.cropShadow(shadowImage.image, shadowImage.size, shadowImage.offset, position, this.tileData.rotatedMapList[this.cameraData.rotation])

        spriteObject.shadowImage = croppedImage

    }

    renderAllShadows = (spriteObject, position) => {

        let initRotation = this.cameraData.rotation

        spriteObject.shadowImages = []

        //prerender shadow images
        for (let rotation = 0; rotation < 6; rotation++) {

            let shadowImage = spriteObject.shadowImageObject[rotation]

            this.cameraData.rotation = rotation
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(position, this.cameraData.rotation)

            let croppedImage = this.utils.cropShadow(shadowImage.image, shadowImage.size, shadowImage.offset, keyObj, rotatedMap)

            spriteObject.shadowImages[rotation] = croppedImage

        }

        this.cameraData.rotation = initRotation

    }

}