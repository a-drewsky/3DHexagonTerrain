export default class HexMapViewClass {

   constructor(ctx, hexMapData) {
      this.ctx = ctx;
      this.hexMapData = hexMapData;

      //starts at top position and rotates clockwise
      this.shadowRotations = {
         0: {q: 0.25, r: -0.5, left: 0.1, right: 0.1},
         1: {q: 0.5, r: -0.5, left: 0, right: 0.2},
         2: {q: 0.5, r: -0.25, left: 0.1, right: 0.3},
         3: {q: 0.5, r: 0, left: 0.2, right: 0.4},
         4: {q: 0.25, r: 0.25, left: 0.3, right: 0.5},
         5: {q: 0, r: 0.5, left: 0.4, right: 0.6},
         6: {q: -0.25, r: 0.5, left: 0.5, right: 0.5},
         7: {q: -0.5, r: 0.5, left: 0.6, right: 0.4},
         8: {q: -0.5, r: 0.25, left: 0.5, right: 0.3},
         9: {q: -0.5, r: 0, left: 0.4, right: 0.2},
         10: {q: -0.25, r: -0.25, left: 0.3, right: 0.1},
         11: {q: 0, r: -0.5, left: 0.2, right: 0},
      }
   }

   draw = () => {

      let shadowDims = {
         x: (this.hexMapData.VecQ.x * this.shadowRotations[this.hexMapData.rotation].q + this.hexMapData.VecR.x * this.shadowRotations[this.hexMapData.rotation].r),
         y: (this.hexMapData.VecQ.y * this.shadowRotations[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotations[this.hexMapData.rotation].r * this.hexMapData.squish)

      }


      let maxHeight = Math.max(...this.hexMapData.getValues().map(value => value.height));


      //draw water
      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         this.drawHexagon(
            this.hexMapData.x + xOffset,
            this.hexMapData.y + yOffset,
            'deepskyblue',
            '#99e6ff'
         );

      }

      //draw water shadow
      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         if (value.height > 0) {
            this.drawHexagon(
               this.hexMapData.x + xOffset + shadowDims.x,
               this.hexMapData.y + yOffset + shadowDims.y,
               'rgba(25,25,25,0.2)',
               null
            );

         }


      }



      for (let i = 1; i <= maxHeight; i++) {


         for (let [key, value] of this.hexMapData.getMap()) {

            let keyObj = this.hexMapData.split(key);

            let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

            //draw hexagon
            if (value.height == i) {
               this.drawHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - i * 10,
                  i >= 5 ? 'aliceblue' : i >= 3 ? 'peru' : i >= 1 ? 'green' : 'deepskyblue',
                  i >= 5 ? '#b3dbff' : i >= 3 ? '#b6732f' : i >= 1 ? '#006b00' : '#99e6ff'
               );

            }


            //draw hexagon wall
            if (value.height >= i) {
               this.drawFullHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - i * 10,
                  i >= 5 ? 'aliceblue' : i >= 3 ? 'peru' : i >= 1 ? 'green' : 'deepskyblue',
                  i >= 5 ? '#b3dbff' : i >= 3 ? '#b6732f' : i >= 1 ? '#006b00' : '#99e6ff'
               );
            }
         }

         //Testing clip
         this.ctx.beginPath();

         for (let [key, value] of this.hexMapData.getMap()) {

            if (value.height == i) {

               let keyObj = this.hexMapData.split(key);

               let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
               let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

               this.testHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - i * 10
               );

            }

         }

         this.ctx.save();
         this.ctx.clip();

         //draw shadow
         for (let [key, value] of this.hexMapData.getMap()) {

            let keyObj = this.hexMapData.split(key);

            let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

            if (value.height > i) {
               this.drawHexagon(
                  this.hexMapData.x + xOffset + shadowDims.x,
                  this.hexMapData.y + yOffset - i * 10 + shadowDims.y,
                  'rgba(25,25,25,0.3)',
                  null, true
               );

            }


         }


         this.ctx.restore();

      }

   }

   drawFullHexagonWall = (x, y, fillColor, lineColor) => {

      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'gray';
      if (fillColor) this.ctx.fillStyle = fillColor;
      if (lineColor) this.ctx.strokeStyle = lineColor;
      let sideLength = Math.PI / 3;

      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fill();
      this.ctx.stroke();


      //draw left shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotations[this.hexMapData.rotation].left})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotations[this.hexMapData.rotation].left})`;
      this.ctx.fill();
      this.ctx.stroke();


      //draw right shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + 10);
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotations[this.hexMapData.rotation].right})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotations[this.hexMapData.rotation].right})`;
      this.ctx.fill();
      this.ctx.stroke();

   }

   drawHexagon = (x, y, fillColor, lineColor, noshadow) => {

      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'gray';
      if (fillColor) this.ctx.fillStyle = fillColor;
      if (lineColor) this.ctx.strokeStyle = lineColor;
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
      if (lineColor != null) this.ctx.stroke(); 

      if(noshadow) return;

      //draw shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.hexMapData.size, y + Math.cos(sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.hexMapData.size, y + Math.cos(sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.hexMapData.size, y + Math.cos(sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.hexMapData.size, y + Math.cos(sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = 'rgba(25,25,25,0.1)';
      this.ctx.strokeStyle = 'rgba(25,25,25,0.1)';
      this.ctx.fill();
      if (lineColor != null) this.ctx.stroke();
   }

   testHexagonPath = (x, y) => {
      let sideLength = Math.PI / 3;

      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.hexMapData.size, y + Math.cos(sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.hexMapData.size, y + Math.cos(sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.hexMapData.size, y + Math.cos(sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.hexMapData.size, y + Math.cos(sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));

   }

}

