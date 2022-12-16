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
      let rotatedMap = this.utils.rotateMap()
      for (let [key, value] of rotatedMap) {
         if (value.selected != null) {
            let keyObj = this.hexMapData.split(key);

            let tilePos = this.utils.hexPositionToXYPosition(keyObj, value.height)

            if (!value.selectionImages[value.selected] || !value.selectionImages[value.selected][this.camera.rotation]){
               this.renderer.renderSelectionImage(value, value.selected)
            } 

            let sprite = value.selectionImages[value.selected][this.camera.rotation]

            ctx.drawImage(sprite, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)



         }
      }


   }

}