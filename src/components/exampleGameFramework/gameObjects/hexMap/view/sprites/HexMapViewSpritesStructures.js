export default class HexMapViewSpritesStructuresClass {

    constructor(hexMapData, camera, images, utils, canvasDims) {
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils
        this.canvasDims = canvasDims
    }

   draw = (drawctx, spriteReference) => {
      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (this.utils.checkImagesLoaded(spriteObject) == false) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[0][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

}