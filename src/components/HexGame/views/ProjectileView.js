import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class ProjectileViewClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.tileData = gameData.tileData
        this.unitData = gameData.unitData
        this.cameraData = gameData.cameraData
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    drawSprite = (hexmapCtx, projectile) => {

        let sprite = projectile.imageObject['default'].images[projectile.frame][this.cameraData.rotation]

        //set pos
        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target, percent)
        let pos = this.commonUtils.rotateTile(lerpPos, this.cameraData.rotation)

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.size.w,
            height: this.mapData.size * 2 * sprite.size.h
        }

        let spritePos = this.tileData.hexPositionToXYPosition(pos, projectile.spriteHeight(), this.cameraData.rotation, sprite.offset)

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return
        hexmapCtx.drawImage(
            projectile.image,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

    drawShadow = (hexmapCtx, projectile) => {
        if (this.commonUtils.checkShadowImages(projectile) === false) return
        
        let shadowImage = projectile.shadowImageObject[this.cameraData.rotation]

        let percent = projectile.travelPercent()
        let lerpPos = this.commonUtils.getLerpPos(projectile.position, projectile.target, percent)
        let pos = this.commonUtils.rotateTile(lerpPos, this.cameraData.rotation)

        let height = projectile.shadowHeight()

        let shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation, shadowImage.offset)

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) === false) return
        hexmapCtx.drawImage(
            projectile.shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

}