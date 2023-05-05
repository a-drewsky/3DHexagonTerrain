import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ModifierViewClass{

    constructor(hexMapData, tileData, structureData, cameraData, images, canvas) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.structureData = structureData
        this.cameraData = cameraData
        this.images = images
        this.commonUtils = new CommonHexMapUtilsClass()
        this.canvas = canvas
    }

    drawSingleImage = (drawctx, spriteObject) => {

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotaiton)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.singleImageSize.width,
            height: this.hexMapData.size * 2 * sprite.singleImageSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.singleImageOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.singleImageOffset.y * this.hexMapData.size * 2


        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawTop = (drawctx, spriteObject) => {

        if (spriteObject.modifierType == 'singleImage') {
            this.drawSingleImage(drawctx, spriteObject)
            return
        }

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotaiton)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.offset.y * this.hexMapData.size * 2


        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawBottom = (drawctx, spriteObject) => {

        if (spriteObject.modifierType == 'singleImage') {
            return
        }

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotaiton)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.offset.y * this.hexMapData.size * 2


        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraData.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

}