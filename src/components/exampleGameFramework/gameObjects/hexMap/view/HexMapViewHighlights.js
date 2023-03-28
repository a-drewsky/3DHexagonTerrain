import HexMapRendererSelectionsClass from "../renderers/HexMapRendererSelection"
import HexMapCommonUtilsClass from "../utils/HexMapCommonUtils"

export default class HexMapViewSelectionClass {

   constructor(hexMapData, camera, settings, images) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.commonUtils = new HexMapCommonUtilsClass(hexMapData, camera)
      this.renderer = new HexMapRendererSelectionsClass(hexMapData, camera, settings, images)

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

         let value = this.hexMapData.getEntry(keyObj.q, keyObj.r)

         let tilePos = this.commonUtils.hexPositionToXYPosition(this.hexMapData.utils.rotateTile(keyObj.q, keyObj.r, this.camera.rotation), value.height)

         if (!value.selectionImages[selectionObj.selection] || !value.selectionImages[selectionObj.selection][this.camera.rotation]) {
            this.renderer.renderSelectionImage(value, selectionObj.selection)
         }

         let sprite = value.selectionImages[selectionObj.selection][this.camera.rotation]

         ctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)

      }


   }

}