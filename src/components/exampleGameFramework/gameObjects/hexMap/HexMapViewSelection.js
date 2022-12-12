export default class HexMapViewSelectionClass {

   constructor(hexMapData, utils, settings) {

      this.hexMapData = hexMapData
      this.utils = utils
      this.colors = settings.HIGHLIGHT_COLORS

   }

   draw = (ctx) => {

      //draw highlight for selected tile
      let rotatedMap = this.utils.rotateMap()
      for (let [key, value] of rotatedMap) {
         if (value.selected != null) {
            let keyObj = this.hexMapData.split(key);

            let tilePos = this.utils.hexPositionToXYPosition(keyObj, value.height)

            let selctionColor = this.colors[value.selected]

            if (value.test === undefined) {

               let tempCanvas = document.createElement('canvas')
               tempCanvas.width = this.hexMapData.size * 2
               tempCanvas.height = this.hexMapData.size * 2
               let tempctx = tempCanvas.getContext('2d')
               tempctx.lineWidth = 6
               
               this.utils.drawFlatHexagon(tempctx, tempCanvas.width / 2, tempCanvas.height / 2 * this.hexMapData.squish, null, selctionColor)

               let selectionImage = this.utils.cropOutTiles(tempCanvas, {width: 1, height: 1, }, {x: 0, y: 0}, keyObj, rotatedMap)

               ctx.drawImage(selectionImage, tilePos.x - this.hexMapData.size, tilePos.y - (this.hexMapData.size * this.hexMapData.squish), this.hexMapData.size * 2, this.hexMapData.size * 2)
            } else {
               ctx.font = '20px arial'
               ctx.fillText(value.test, tilePos.x - 20, tilePos.y)
            }


         }
      }


   }

}