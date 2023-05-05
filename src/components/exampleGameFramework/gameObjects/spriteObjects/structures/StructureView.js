import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureViewClass{

    constructor(hexMapData, tileData, structureData, cameraData, images, canvas) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.structureData = structureData
        this.cameraData = cameraData
        this.images = images
        this.commonUtils = new CommonHexMapUtilsClass()
        this.canvas = canvas
    }

   draw = (drawctx, spriteObject) => {
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

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

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

      let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotaiton)
      let sprite = spriteObject.imageObject
      let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

      let shadowSize

      let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

      shadowSize = {
         width: this.hexMapData.size * 2 * sprite.shadowSize.width,
         height: this.hexMapData.size * 2 * sprite.shadowSize.height
      }

      shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
      shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


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