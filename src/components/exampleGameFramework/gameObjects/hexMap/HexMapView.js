export default class HexMapViewClass {

   constructor(ctx, hexMapData) {
      this.ctx = ctx;
      this.hexMapData = hexMapData;
   }

   draw = () => {

      console.log(this.hexMapData.getMapSize())

      for (let [key, value] of this.hexMapData.getMap()) {


         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         console.log(this.hexMapData.VecQ.y, keyObj.q, this.hexMapData.squish, this.hexMapData.VecR.y, keyObj.r, this.hexMapData.squish)

         this.drawHexagon(this.hexMapData.x + xOffset, this.hexMapData.y + yOffset, value.color);
      }

   }

   drawHexagon = (x, y, color) => {
      
      

      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'white';
      if (color) this.ctx.fillStyle = color;
      if (color) this.ctx.strokeStyle = color;
      let sideLength = Math.PI / 3;

      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.hexMapData.size, y + Math.cos(sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.hexMapData.size, y + Math.cos(sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.hexMapData.size, y + Math.cos(sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.hexMapData.size, y + Math.cos(sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.fill();
      this.ctx.stroke();
   }

}