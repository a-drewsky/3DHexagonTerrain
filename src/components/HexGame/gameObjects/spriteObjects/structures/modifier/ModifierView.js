import CommonHexMapUtilsClass from "../../../commonUtils/CommonHexMapUtils"

export default class ModifierViewClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.cameraData = hexMapData.cameraData
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    drawSingleImage = (drawctx, modifier) => {

        if (this.commonUtils.checkImagesLoaded(modifier) === false) return

        let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)
        let sprite = modifier.imageObject
        let height = this.tileData.getEntry(modifier.position).height

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.singleImageSize.width,
            height: this.mapData.size * 2 * sprite.singleImageSize.height
        }

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, sprite.singleImageOffset)

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return
        drawctx.drawImage(
            modifier.images[0][this.cameraData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawTop = (drawctx, modifier) => {

        if (modifier.modifierType === 'singleImage') {
            this.drawSingleImage(drawctx, modifier)
            return
        }

        if (this.commonUtils.checkImagesLoaded(modifier) === false) return

        let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)
        let sprite = modifier.imageObject
        let height = this.tileData.getEntry(modifier.position).height

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.spriteSize.width,
            height: this.mapData.size * 2 * sprite.spriteSize.height
        }

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, sprite.offset)

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return
        drawctx.drawImage(
            modifier.images[0][this.cameraData.rotation].top,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawBottom = (drawctx, modifier) => {

        if (modifier.modifierType === 'singleImage') {
            return
        }

        if (this.commonUtils.checkImagesLoaded(modifier) === false) return

        let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)
        let sprite = modifier.imageObject
        let height = this.tileData.getEntry(modifier.position).height


        let spriteSize = {
            width: this.mapData.size * 2 * sprite.spriteSize.width,
            height: this.mapData.size * 2 * sprite.spriteSize.height
        }

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, sprite.offset)

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return
        drawctx.drawImage(
            modifier.images[0][this.cameraData.rotation].bottom,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawShadow = (drawctx, modifier) => {
        if (this.commonUtils.checkShadowImages(modifier) === false) return

        let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)
        let height = this.tileData.getEntry(modifier.position).height

        let shadowSize = {
            width: this.mapData.size * 2 * modifier.imageObject.shadowSize.width,
            height: this.mapData.size * 2 * modifier.imageObject.shadowSize.height
        }

        let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, modifier.imageObject.shadowOffset)

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) === false) return

        drawctx.drawImage(
            modifier.shadowImages[this.cameraData.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

}