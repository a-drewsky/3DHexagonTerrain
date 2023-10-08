import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ModifierViewClass{

    constructor(hexMapData, images, canvas) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.canvas = canvas
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    drawSingleImage = (drawctx, spriteObject) => {

        if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite.singleImageSize.width,
            height: this.mapData.size * 2 * sprite.singleImageSize.height
        }

        spritePos.x -= this.mapData.size + sprite.singleImageOffset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.singleImageOffset.y * this.mapData.size * 2


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

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite.spriteSize.width,
            height: this.mapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.mapData.size + sprite.offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.offset.y * this.mapData.size * 2


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

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite.spriteSize.width,
            height: this.mapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.mapData.size + sprite.offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.offset.y * this.mapData.size * 2


        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[0][this.cameraData.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawShadow = (drawctx, modifier) => {
       if (this.commonUtils.checkShadowImages(modifier) == false) return

       let keyObj = this.commonUtils.rotateTile(modifier.position.q, modifier.position.r, this.cameraData.rotation)
       let height = this.tileData.getEntry(modifier.position.q, modifier.position.r).height
 
       let shadowSize
 
       let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)
 
       shadowSize = {
          width: this.mapData.size * 2 * modifier.imageObject.shadowSize.width,
          height: this.mapData.size * 2 * modifier.imageObject.shadowSize.height
       }
 
       shadowPos.x -= this.mapData.size + modifier.imageObject.shadowOffset.x * this.mapData.size * 2
       shadowPos.y -= (this.mapData.size * this.mapData.squish) + modifier.imageObject.shadowOffset.y * this.mapData.size * 2
 
 
       if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
 
       drawctx.drawImage(
          modifier.shadowImages[0][this.cameraData.rotation],
          shadowPos.x,
          shadowPos.y,
          shadowSize.width,
          shadowSize.height
       )
    }

}