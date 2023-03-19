export default class HexMapViewSpritesModifiersClass {

    constructor(hexMapData, camera, images, utils, canvasDims) {
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils
        this.canvasDims = canvasDims
    }

    drawSingleImage = (drawctx, spriteReference) => {

        let spriteObject = this.hexMapData.terrainList[spriteReference.id]

        if (this.utils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

        spriteSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.singleImageSize.width,
            height: this.hexMapData.size * 2 * this.images.modifier.singleImageSize.height
        }

        spritePos.x -= this.hexMapData.size + this.images.modifier.singleImageOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.singleImageOffset.y * this.hexMapData.size * 2


        if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.state][this.camera.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawTop = (drawctx, spriteReference) => {

        let spriteObject = this.hexMapData.terrainList[spriteReference.id]

        if (this.utils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.modifierType == 'singleImage') {
            this.drawSingleImage(drawctx, spriteReference)
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

        spriteSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.size.width,
            height: this.hexMapData.size * 2 * this.images.modifier.size.height
        }

        spritePos.x -= this.hexMapData.size + this.images.modifier.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.offset.y * this.hexMapData.size * 2


        if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.state][this.camera.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawBottom = (drawctx, spriteReference) => {

        let spriteObject = this.hexMapData.terrainList[spriteReference.id]

        if (this.utils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.modifierType == 'singleImage') {
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

        spriteSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.size.width,
            height: this.hexMapData.size * 2 * this.images.modifier.size.height
        }

        spritePos.x -= this.hexMapData.size + this.images.modifier.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.offset.y * this.hexMapData.size * 2


        if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.state][this.camera.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

}