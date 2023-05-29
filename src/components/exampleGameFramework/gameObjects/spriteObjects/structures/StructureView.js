import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureViewClass{

    constructor(hexMapData, images, canvas) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.canvas = canvas
        this.commonUtils = new CommonHexMapUtilsClass()
    }

   draw = (drawctx, spriteObject) => {
      if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

      let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
      let sprite = spriteObject.imageObject
      let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

      let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

      let spriteSize = {
         width: this.mapData.size * 2 * sprite.spriteSize.width,
         height: this.mapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.mapData.size + sprite.spriteOffset.x * this.mapData.size * 2
      spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.spriteOffset.y * this.mapData.size * 2

      if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
      drawctx.drawImage(
         spriteObject.images[0][this.cameraData.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

   drawShadow = (drawctx, spriteObject) => {
      if (this.commonUtils.checkShadowImages(spriteObject) == false) return

      let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
      let sprite = spriteObject.imageObject
      let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

      let shadowSize

      let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

      shadowSize = {
         width: this.mapData.size * 2 * sprite.shadowSize.width,
         height: this.mapData.size * 2 * sprite.shadowSize.height
      }

      shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
      shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2


      if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

      drawctx.drawImage(
         spriteObject.shadowImages[0][this.cameraData.rotation],
         shadowPos.x,
         shadowPos.y,
         shadowSize.width,
         shadowSize.height
      )
   }

}