export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

   }

   draw = (drawctx) => {

      let rotatedMap = this.utils.rotateMap()

      for (let [key, value] of rotatedMap) {

         if (value.terrain.type == 'trees') {

            let keyObj = this.hexMapData.split(key);

            let xOffset;
            let yOffset;

            if (this.camera.rotation % 2 == 1) {
               xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
               yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
            } else {
               xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
               yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
            }


            //draw image to a canvas

            let croppedImage = this.utils.cropOutTiles(this.images['woodlands_trees'], keyObj, rotatedMap)



            //draw the image to the screen

            drawctx.drawImage(
               croppedImage,
               this.hexMapData.posMap.get(this.camera.rotation).x + xOffset - this.hexMapData.size,
               this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - value.height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish) - this.hexMapData.size,
               this.hexMapData.size * 2,
               this.hexMapData.size * 3
            )

         }
      }
   }

}