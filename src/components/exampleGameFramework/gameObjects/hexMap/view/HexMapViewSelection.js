import HexMapViewSelectionRendererClass from "./HexMapViewSelectionRenderer"

export default class HexMapViewSelectionClass {

   constructor(hexMapData, camera, images, utils) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.utils = utils
      this.renderer = new HexMapViewSelectionRendererClass(hexMapData, camera, images, utils)

   }

   draw = (ctx) => {

      //draw highlight for selected tile

      for (let i = 0; i < this.hexMapData.selectionList.length; i++) {

         let selectionObj = this.hexMapData.selectionList[i]

         let keyObj = {
            q: selectionObj.q,
            r: selectionObj.r
         }

         let value = this.hexMapData.getEntry(keyObj.q, keyObj.r)

         let tilePos = this.utils.hexPositionToXYPosition(this.utils.rotateTile(keyObj.q, keyObj.r, this.camera.rotation), value.height)

         if (!value.selectionImages[selectionObj.selection] || !value.selectionImages[selectionObj.selection][this.camera.rotation]) {
            this.renderer.renderSelectionImage(value, selectionObj.selection)
         }

         let sprite = value.selectionImages[selectionObj.selection][this.camera.rotation]

         ctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)

      }


   }

}