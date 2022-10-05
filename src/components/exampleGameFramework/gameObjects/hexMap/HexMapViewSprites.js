export default class HexMapViewSpritesClass {

    constructor(){



    }

    drawFeatures = () => {
        for (let [key, value] of this.rotatedMap) {
  
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
  
              let tempCanvas = this.cropOutTiles(this.images['woodlands_trees'], keyObj)
  
              
  
              //draw the image to the screen
  
              this.renderctx.drawImage(
                 tempCanvas,
                 this.hexMapData.x + xOffset - this.hexMapData.size,
                 this.hexMapData.y + yOffset - value.height * this.renderTileHeight - (this.hexMapData.size * this.hexMapData.squish) - this.hexMapData.size,
                 this.hexMapData.size * 2,
                 this.hexMapData.size * 3
              )
  
           }
        }
     }

}