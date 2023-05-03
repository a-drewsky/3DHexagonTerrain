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

   draw = (drawctx, spriteReference) => {
      let spriteObject = this.structureData.getStructure(spriteReference.id.q, spriteReference.id.r)

      if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let sprite = spriteObject.imageObject

      let spriteSize

      let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.cameraData.rotation)

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

}