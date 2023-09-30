import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileViewClass {

    constructor(hexMapData, images, canvas) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.unitData = hexMapData.unitData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.canvas = canvas
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    drawSprite = (drawctx, projectile) => {

        let keyObj = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)
        let sprite = projectile.imageObject

        let pos = {
            q: keyObj.q,
            r: keyObj.r
        }


        //set pos
        let point1 = projectile.position
        let point2 = projectile.target
        let percent = projectile.travelPercent()
        let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
        }
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
        let height = projectile.tileHeight()

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite['default'].images[projectile.frame][this.cameraData.rotation].size.w,
            height: this.mapData.size * 2 * sprite['default'].images[projectile.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite['default'].images[projectile.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite['default'].images[projectile.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            projectile.image,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

    drawShadow = (drawctx, projectile) => {
        if (this.commonUtils.checkShadowImages(projectile) == false) return

        let keyObj = this.commonUtils.rotateTile(projectile.position.q, projectile.position.r, this.cameraData.rotation)
        let sprite = projectile.imageObject

        let pos = {
            q: keyObj.q,
            r: keyObj.r
        }

        let point1 = projectile.position
        let point2 = projectile.target
        let percent = projectile.travelPercent()
        let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
        }
        pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)

        let shadowSize
        let height = projectile.tileHeight()

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        shadowSize = {
            width: this.mapData.size * 2 * sprite.shadowSize.width,
            height: this.mapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            projectile.shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

}