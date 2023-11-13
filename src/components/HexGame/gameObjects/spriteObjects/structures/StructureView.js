import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureViewClass{

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.cameraData = hexMapData.cameraData
        this.commonUtils = new CommonHexMapUtilsClass()
    }

   draw = (drawctx, structure) => {
      if (this.commonUtils.checkImagesLoaded(structure) === false) return

      let keyObj = this.commonUtils.rotateTile(structure.position, this.cameraData.rotation)
      let sprite = structure.imageObject[structure.curState()].images[structure.frame][this.cameraData.rotation]
      let height = this.tileData.getEntry(structure.position).height

      let spriteSize = {
         width: this.mapData.size * 2 * sprite.size.w,
         height: this.mapData.size * 2 * sprite.size.h
      }

      let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, sprite.offset)

      if (this.cameraData.onScreenCheck(spritePos, spriteSize) === false) return
      
      drawctx.drawImage(
         structure.images[0][this.cameraData.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

   drawShadow = (drawctx, structure) => {
      if (this.commonUtils.checkShadowImages(structure) === false) return

      let shadowImage = structure.shadowImageObject[this.cameraData.rotation]
      let keyObj = this.commonUtils.rotateTile(structure.position, this.cameraData.rotation)
      let height = this.tileData.getEntry(structure.position).height


      let shadowSize = {
         width: this.mapData.size * 2 * shadowImage.size.w,
         height: this.mapData.size * 2 * shadowImage.size.h
      }

      let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation, shadowImage.offset)


      if (this.cameraData.onScreenCheck(shadowPos, shadowSize) === false) return

      drawctx.drawImage(
         structure.shadowImages[this.cameraData.rotation],
         shadowPos.x,
         shadowPos.y,
         shadowSize.width,
         shadowSize.height
      )
   }

}