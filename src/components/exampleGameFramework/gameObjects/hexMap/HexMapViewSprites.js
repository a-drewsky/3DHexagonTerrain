export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
     }

   }

   draw = (drawctx) => {

      let rotatedMap = this.utils.rotateMap()

      for (let [key, value] of rotatedMap) {

         if (value.terrain.sprite == false) continue


         switch (value.terrain.type) {
            case 'trees':

               let image = this.images['woodlands_trees']

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


               let spritePos = {
                  x: this.hexMapData.posMap.get(this.camera.rotation).x + xOffset - this.hexMapData.size,
                  y: this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - value.height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish) - this.hexMapData.size
               }

               let spriteSize = {
                  width: this.hexMapData.size * 2 * image.size.width,
                  height: this.hexMapData.size * 2 * image.size.height
               }

               let zoom = this.camera.zoomAmount * this.camera.zoom

               let position = this.camera.position
       
               let canvasDims = this.canvasDims

              
               if(spritePos.x < position.x - spriteSize.width || spritePos.y < position.y - spriteSize.height || spritePos.x > position.x + canvasDims.width + zoom || spritePos.y > position.y + canvasDims.height + zoom * this.hexMapData.squish) continue;

               //draw image to a canvas

               let croppedImage = this.utils.cropOutTiles(image, keyObj, rotatedMap)



               //draw the image to the screen

               drawctx.drawImage(
                  croppedImage,
                  spritePos.x,
                  spritePos.y,
                  spriteSize.width,
                  spriteSize.height
               )

               break;
         }
      }
   }

}