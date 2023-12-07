import RendererUtilsClass from "./utils/RendererUtils"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import ShadowRendererClass from "./common/ShadowRenderer"

export default class ProjectileRendererClass {

    constructor(gameData, images) {
        this.mapData = gameData.mapData
        this.tileData = gameData.tileData
        this.cameraData = gameData.cameraData

        this.images = images

        this.utils = new RendererUtilsClass(gameData)
        this.commonUtils = new CommonHexMapUtilsClass()

        this.shadowRenderer = new ShadowRendererClass(gameData, images)
    }

    render = (projectile) => {

        this.renderSprite(projectile)
        this.renderShadow(projectile)

    }

    renderSprite = (projectile) => {

        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target.position, percent)
        let pos = this.commonUtils.rotateTile(lerpPos, this.cameraData.rotation)
        let closestTile = this.commonUtils.roundToNearestHex(lerpPos)

        let height = projectile.spriteHeight()

        let sprite = projectile.sprite(this.cameraData.rotation)

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation, sprite.offset)

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.size.w,
            height: this.mapData.size * 2 * sprite.size.h
        }

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return

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
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target.position, percent)

        this.shadowRenderer.renderActionShadow(projectile, lerpPos)

    }

}