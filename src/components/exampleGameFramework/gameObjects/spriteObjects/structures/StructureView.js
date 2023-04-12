import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import CommonViewUtilsClass from "../../commonUtils/CommonViewUtils"

export default class StructureViewClass{

    constructor(hexMapData, tileData, structureData, camera, images, canvas) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.structureData = structureData
        this.camera = camera
        this.images = images
        this.commonUtils = new CommonHexMapUtilsClass()
        this.viewUtils = new CommonViewUtilsClass(camera)
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

      let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvas) == false) return
      drawctx.drawImage(
         spriteObject.images[0][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

}