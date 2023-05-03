import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ModifierViewClass{

    constructor(hexMapData, tileData, structureData, cameraData, images, canvas) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.structureData = structureData
        this.cameraDataData = cameraData
        this.images = images
        this.commonUtils = new CommonHexMapUtilsClass()
        this.canvas = canvas
    }

    drawSingleImage = (drawctx, spriteReference) => {

        let spriteObject = this.structureData.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.cameraDataData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.imageObject.singleImageSize.width,
            height: this.hexMapData.size * 2 * spriteObject.imageObject.singleImageSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.imageObject.singleImageOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.imageObject.singleImageOffset.y * this.hexMapData.size * 2


        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraDataData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawTop = (drawctx, spriteReference) => {

        let spriteObject = this.structureData.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.modifierType == 'singleImage') {
            this.drawSingleImage(drawctx, spriteReference)
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.cameraDataData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * spriteObject.imageObject.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.imageObject.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.imageObject.offset.y * this.hexMapData.size * 2


        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraDataData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawBottom = (drawctx, spriteReference) => {

        let spriteObject = this.structureData.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.modifierType == 'singleImage') {
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.cameraDataData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * spriteObject.imageObject.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.imageObject.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.imageObject.offset.y * this.hexMapData.size * 2


        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraDataData.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

}