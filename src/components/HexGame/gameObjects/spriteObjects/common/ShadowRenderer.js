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

        if (!spriteObject.imageObject.shadow) return

        let shadowImage = this.images.shadows[spriteObject.imageObject.shadow][this.cameraData.rotation]

        let nearestTile = this.commonUtils.roundToNearestHex(position)
        nearestTile = this.tileData.getEntry(nearestTile)

        position = this.commonUtils.rotateTile(position, this.cameraData.rotation)
        let shadowPos = this.tileData.hexPositionToXYPosition(position, nearestTile.height, this.cameraData.rotation)
        let shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }

        shadowPos.x -= this.mapData.size + shadowImage.offset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + shadowImage.offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

        let croppedImage = this.utils.cropShadow(shadowImage.image, shadowImage.size, shadowImage.offset, position, this.tileData.rotatedMapList[this.cameraData.rotation])

        spriteObject.shadowImage = croppedImage

    }

    renderAllShadows = (spriteObject, position) => {

        let initRotation = this.cameraData.rotation

        if (!spriteObject.imageObject.shadow) return

        spriteObject.shadowImages = []

        //prerender shadow images
        for (let rotation = 0; rotation < 6; rotation++) {

            let shadowImage = this.images.shadows[spriteObject.imageObject.shadow][rotation]

            this.cameraData.rotation = rotation;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(position, this.cameraData.rotation)

            let croppedImage = this.utils.cropShadow(shadowImage.image, shadowImage.size, shadowImage.offset, keyObj, rotatedMap)

            spriteObject.shadowImages[rotation] = croppedImage

        }

        this.cameraData.rotation = initRotation

    }

}