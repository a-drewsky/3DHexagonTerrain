import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import ShadowRendererClass from "../common/ShadowRenderer"

export default class ProjectileRendererClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.images = images

        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()

        this.shadowRenderer = new ShadowRendererClass(hexMapData, images)
    }

    render = (projectile) => {

        this.renderSprite(projectile)
        this.renderShadow(projectile)

    }

    renderSprite = (projectile) => {

        let pos = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)

        //set pos
        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target, percent)
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
        let closestTile = this.commonUtils.roundToNearestHex(lerpPos)

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

        this.utils.cropOutTilesMovement(tempCanvas, sprite.offset, pos, height)
        this.utils.darkenSprite(tempCanvas, projectile, closestTile, 1)
        projectile.image = tempCanvas
    }

    renderShadow = (projectile) => {

        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target, percent)

        this.shadowRenderer.renderActionShadow(projectile, lerpPos)

    }

}