import HexMapCommonUtilsClass from "../../utils/HexMapCommonUtils"
import HexMapViewUtilsClass from "../../utils/HexMapViewUtils"

export default class HexMapViewSpritesModifiersClass {

    constructor(hexMapData, spriteManager, camera, images, canvasDims) {
        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.images = images
        this.commonUtils = new HexMapCommonUtilsClass()
        this.viewUtils = new HexMapViewUtilsClass(camera)
        this.canvasDims = canvasDims
    }

    drawSingleImage = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.structures.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.hexMapData.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.data.imageObject.singleImageSize.width,
            height: this.hexMapData.size * 2 * spriteObject.data.imageObject.singleImageSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.data.imageObject.singleImageOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.data.imageObject.singleImageOffset.y * this.hexMapData.size * 2


        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.data.images[0][this.camera.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawTop = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.structures.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.data.modifierType == 'singleImage') {
            this.drawSingleImage(drawctx, spriteReference)
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.hexMapData.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.data.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * spriteObject.data.imageObject.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.data.imageObject.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.data.imageObject.offset.y * this.hexMapData.size * 2


        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.data.images[0][this.camera.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawBottom = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.structures.getStructure(spriteReference.id.q, spriteReference.id.r)

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        if (spriteObject.data.modifierType == 'singleImage') {
            return
        }

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let spriteSize

        let spritePos = this.hexMapData.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * spriteObject.data.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * spriteObject.data.imageObject.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + spriteObject.data.imageObject.offset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + spriteObject.data.imageObject.offset.y * this.hexMapData.size * 2


        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.data.images[0][this.camera.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

}