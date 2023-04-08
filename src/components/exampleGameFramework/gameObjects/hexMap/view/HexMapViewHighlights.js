import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils"

export default class HexMapViewSelectionClass {

   constructor(hexMapData, spriteManager, camera, settings, images) {

      this.hexMapData = hexMapData
      this.spriteManager = spriteManager
      this.camera = camera
      this.commonUtils = new HexMapCommonUtilsClass()

   }

   draw = (ctx) => {

      //draw highlight for selected tile

      let selectionArr = this.hexMapData.getSelectionArr()

      for (let i = 0; i < selectionArr.length; i++) {

         let selectionObj = selectionArr[i]

         let keyObj = {
            q: selectionObj.position.q,
            r: selectionObj.position.r
         }

         let value = this.spriteManager.tiles.data.getEntry(keyObj.q, keyObj.r)

         let tilePos = this.spriteManager.tiles.data.hexPositionToXYPosition(this.commonUtils.rotateTile(keyObj.q, keyObj.r, this.camera.rotation), value.height, this.camera.rotation)

         if (!value.selectionImages[selectionObj.selection] || !value.selectionImages[selectionObj.selection][this.camera.rotation]) {
            this.spriteManager.tiles.renderer.renderSelectionImage(value, selectionObj.selection)
         }

         let sprite = value.selectionImages[selectionObj.selection][this.camera.rotation]

         ctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)

      }


   }

}