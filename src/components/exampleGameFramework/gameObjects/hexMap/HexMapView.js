export default class HexMapViewClass {

   constructor(ctx, camera, hexMapData) {
      this.ctx = ctx;
      this.camera = camera;
      this.hexMapData = hexMapData;

      //starts at top position and rotates clockwise
      this.shadowRotationDims = {
         0: { q: 0.25, r: -0.5, left: 0.1, right: 0.1 },
         1: { q: 0.5, r: -0.5, left: 0, right: 0.2 },
         2: { q: 0.5, r: -0.25, left: 0.1, right: 0.3 },
         3: { q: 0.5, r: 0, left: 0.2, right: 0.4 },
         4: { q: 0.25, r: 0.25, left: 0.3, right: 0.5 },
         5: { q: 0, r: 0.5, left: 0.4, right: 0.6 },
         6: { q: -0.25, r: 0.5, left: 0.5, right: 0.5, offAxis: 0.4 },
         7: { q: -0.5, r: 0.5, left: 0.6, right: 0.4 },
         8: { q: -0.5, r: 0.25, left: 0.5, right: 0.3 },
         9: { q: -0.5, r: 0, left: 0.4, right: 0.2 },
         10: { q: -0.25, r: -0.25, left: 0.3, right: 0.1 },
         11: { q: 0, r: -0.5, left: 0.2, right: 0 },
      }
   }

   draw = () => {

      this.drawGroundShadowLayer();

      let maxHeight = Math.max(...this.hexMapData.getValues().map(value => value.height));

      for (let i = 0; i <= maxHeight; i++) {

         this.drawTileLayer(i);

         this.drawShadowLayer(i);

      }

   }

   drawTileLayer = (height) => {

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

         }

         //draw hexagon if at height
         if (value.height == height) {

            if (this.hexMapData.flipped) {
               this.drawFlippedHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'aliceblue' : height >= 3 ? 'peru' : height >= 1 ? 'green' : 'deepskyblue',
                  height >= 5 ? '#b3dbff' : height >= 3 ? '#b6732f' : height >= 1 ? '#006b00' : '#99e6ff'
               );
            } else {
               this.drawHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'aliceblue' : height >= 3 ? 'peru' : height >= 1 ? 'green' : 'deepskyblue',
                  height >= 5 ? '#b3dbff' : height >= 3 ? '#b6732f' : height >= 1 ? '#006b00' : '#99e6ff'
               );
            }

         }

         //draw hexagon wall
         if (value.height >= height) {

            if (this.hexMapData.flipped) {
               this.drawFlippedFullHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'aliceblue' : height >= 3 ? 'peru' : height >= 1 ? 'green' : 'deepskyblue',
                  height >= 5 ? '#b3dbff' : height >= 3 ? '#b6732f' : height >= 1 ? '#006b00' : '#99e6ff'
               );
            } else {
               this.drawFullHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'aliceblue' : height >= 3 ? 'peru' : height >= 1 ? 'green' : 'deepskyblue',
                  height >= 5 ? '#b3dbff' : height >= 3 ? '#b6732f' : height >= 1 ? '#006b00' : '#99e6ff'
               );
            }


         }
      }

   }

   drawShadowLayer = (height) => {

      let shadowDims = {
         x: (this.hexMapData.VecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
         y: (this.hexMapData.VecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

      }

      if (this.hexMapData.flipped) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      }

      this.ctx.beginPath();

      for (let [key, value] of this.hexMapData.getMap()) {

         if (value.height == height) {

            let keyObj = this.hexMapData.split(key);

            let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

            if (this.hexMapData.flipped) {
               xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
               yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

            }
            if (this.hexMapData.flipped) {
               this.clipFlippedHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight
               );
            } else {
               this.clipHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight
               );
            }

         }

      }

      this.ctx.save();
      this.ctx.clip();

      this.ctx.fillStyle =  'rgba(25,25,25,0.3)';

      this.ctx.beginPath();
      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

         }

         for (let i = height+1; i <= value.height; i++) {
            if (this.hexMapData.flipped) {
               this.clipFlippedHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i-height),
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (i-height)
               );
            } else {
               this.clipHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i-height),
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (i-height)
               );
            }

         }

      }
      this.ctx.fill();

      this.ctx.restore();

   }

   drawGroundShadowLayer = () => {

      let shadowDims = {
         x: (this.hexMapData.VecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
         y: (this.hexMapData.VecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

      }

      if (this.hexMapData.flipped) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      }

      //Do this for all shadows
      this.ctx.fillStyle =  'rgba(25,25,25,0.3)';

      this.ctx.beginPath();

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
         let yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

         }

         for (let i = 0; i <= value.height; i++) {


            if (this.hexMapData.flipped) {
               this.clipFlippedHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i+1),
                  this.hexMapData.y + yOffset + this.hexMapData.tileHeight + shadowDims.y * (i+1)
               );
            } else {
               this.clipHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i+1),
                  this.hexMapData.y + yOffset + this.hexMapData.tileHeight + shadowDims.y * (i+1)
               );
            }
         }


      }

      this.ctx.fill();

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
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fill();
      this.ctx.stroke();


      //draw left shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].left})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].left})`;
      this.ctx.fill();
      this.ctx.stroke();


      //draw right shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].right})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].right})`;
      this.ctx.fill();
      this.ctx.stroke();

   }

   drawFlippedFullHexagonWall = (x, y, fillColor, lineColor) => {

      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'gray';
      if (fillColor) this.ctx.fillStyle = fillColor;
      if (lineColor) this.ctx.strokeStyle = lineColor;
      let sideLength = Math.PI / 3;

      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fill();
      this.ctx.stroke();


      //draw left shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].left})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].left})`;
      this.ctx.fill();
      this.ctx.stroke();


      //draw right shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].offAxis})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].offAxis})`;
      this.ctx.fill();
      this.ctx.stroke();

      //draw center shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.ctx.lineTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].right})`;
      this.ctx.strokeStyle = `rgba(25,25,25,${this.shadowRotationDims[this.hexMapData.rotation].right})`;
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

      if (noshadow) return;

      //draw shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.hexMapData.size, y + Math.cos(sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.hexMapData.size, y + Math.cos(sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.hexMapData.size, y + Math.cos(sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.hexMapData.size, y + Math.cos(sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = 'rgba(25,25,25,0.05)';
      this.ctx.strokeStyle = 'rgba(25,25,25,0.05)';
      this.ctx.fill();
      if (lineColor != null) this.ctx.stroke();
   }

   drawFlippedHexagon = (x, y, fillColor, lineColor, noshadow) => {


      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'gray';
      if (fillColor) this.ctx.fillStyle = fillColor;
      if (lineColor) this.ctx.strokeStyle = lineColor;
      let sideLength = Math.PI / 3;

      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 3 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 4 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 6 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.fill();
      if (lineColor != null) this.ctx.stroke();

      if (noshadow) return;

      //draw shadow
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 3 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 4 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 6 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.ctx.fillStyle = 'rgba(25,25,25,0.05)';
      this.ctx.strokeStyle = 'rgba(25,25,25,0.05)';
      this.ctx.fill();
      if (lineColor != null) this.ctx.stroke();
   }

   clipHexagonPath = (x, y) => {
      let sideLength = Math.PI / 3;

      this.ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.hexMapData.size, y + Math.cos(sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.hexMapData.size, y + Math.cos(sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.hexMapData.size, y + Math.cos(sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.hexMapData.size, y + Math.cos(sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.hexMapData.size, y + Math.cos(sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.hexMapData.size, y + Math.cos(sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));

   }

   clipFlippedHexagonPath = (x, y) => {
      let sideLength = Math.PI / 3;

      this.ctx.moveTo(x + Math.sin(sideLength * 0 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 0 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 1 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 2 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 3 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 4 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 5 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6 - sideLength / 2) * this.hexMapData.size, y + Math.cos(sideLength * 6 - sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

   }

}

