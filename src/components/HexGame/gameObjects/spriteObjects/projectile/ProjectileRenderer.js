import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileRendererClass {

    constructor(hexMapData, images) {
        this.unitData = hexMapData.unitData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.images = images

        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    render = (projectile) => {

        this.renderSprite(projectile)
        this.renderShadow(projectile)

    }

    renderSprite = (projectile) => {

        let pos = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)


        //set pos
        let point1 = projectile.position
        let point2 = projectile.target
        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(point1, point2, percent)
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
        let closestTile = this.commonUtils.roundToNearestHex(lerpPos.q, lerpPos.r)

        let height = projectile.spriteHeight()

        let sprite = projectile.sprite(this.cameraData.rotation)

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)
        spritePos.x -= this.mapData.size + sprite.offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.offset.y * this.mapData.size * 2

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.size.w,
            height: this.mapData.size * 2 * sprite.size.h
        }

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return

        let spriteImage = sprite.image

        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.mapData.size * 2 * sprite.size.w
        tempCanvas.height = this.mapData.size * 2 * sprite.size.h
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(spriteImage, 0, 0, tempCanvas.width, tempCanvas.height)

        this.utils.cropOutTilesJump(tempCanvas, sprite.offset, pos, this.tileData.rotatedMapList[this.cameraData.rotation], height)
        this.utils.darkenSprite(tempCanvas, projectile, closestTile, 1)
        projectile.image = tempCanvas
    }

    renderShadow = (projectile) => {

        let shadowImage = this.images.shadows[projectile.imageObject.shadow][this.cameraData.rotation]

        let pos = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)


        let point1 = projectile.position
        let point2 = projectile.target
        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(point1, point2, percent)
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)

        let height = projectile.shadowHeight()
        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)
        let shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }

        shadowPos.x -= this.mapData.size + shadowImage.offset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + shadowImage.offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

        let croppedImage = this.utils.cropStructureShadow(shadowImage.image, shadowImage.size, shadowImage.offset, pos, this.tileData.rotatedMapList[this.cameraData.rotation])

        projectile.shadowImage = croppedImage

    }

}