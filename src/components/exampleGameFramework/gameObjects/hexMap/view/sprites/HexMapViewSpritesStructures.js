import HexMapCommonUtilsClass from "../../../commonUtils/HexMapCommonUtils"
import HexMapViewUtilsClass from "../../utils/HexMapViewUtils"

export default class HexMapViewSpritesStructuresClass {

    constructor(hexMapData, spriteManager, camera, images, canvasDims) {
        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.images = images
        this.commonUtils = new HexMapCommonUtilsClass()
        this.viewUtils = new HexMapViewUtilsClass(camera)
        this.canvasDims = canvasDims
    }

   draw = (drawctx, spriteReference) => {
      let spriteObject = this.spriteManager.structures.data.getStructure(spriteReference.id.q, spriteReference.id.r)

      if (this.commonUtils.checkImagesLoaded(spriteObject) == false) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let sprite = spriteObject.imageObject

      let spriteSize

      let spritePos = this.spriteManager.tiles.data.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[0][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

}