import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileRendererClass {

    constructor(hexMapData, images) {
        this.unitData = hexMapData.unitData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.utils = new CommonRendererUtilsClass(hexMapData, images)
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
        let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
        }
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
        let closestTile = this.commonUtils.roundToNearestHex(lerpPos.q, lerpPos.r)

        let height = projectile.tileHeight()

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
        this.utils.darkenSpriteJump(tempCanvas, projectile, closestTile, height)
        projectile.image = tempCanvas
    }

    renderShadow = (projectile) => {

        if (!projectile.imageObject.shadowImages) return

        let pos = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)


        let point1 = projectile.position
        let point2 = projectile.target
        let percent = projectile.travelPercent()
        let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
        }
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)

        let height = projectile.tileHeight()
        let sprite = projectile.imageObject
        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)
        let shadowSize = {
            width: this.mapData.size * 2 * sprite.shadowSize.width,
            height: this.mapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

        let shadowImage = sprite.shadowImages[this.cameraData.rotation].image

        shadowImage = this.utils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.tileData.rotatedMapList[this.cameraData.rotation])

        projectile.shadowImage = shadowImage

    }

}