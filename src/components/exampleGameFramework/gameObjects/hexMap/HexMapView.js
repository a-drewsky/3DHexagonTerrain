export default class HexMapViewClass {

   constructor(ctx, camera, hexMapData) {
      this.ctx = ctx;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.sideLength = Math.PI / 3;

      this.renderCanvas = document.createElement('canvas');
      this.renderctx = this.renderCanvas.getContext('2d');


      //starts at top position and rotates clockwise
      this.shadowRotationDims = {
         0: { q: 0.25, r: -0.5, left: 0.9, right: 0.9 },
         1: { q: 0.5, r: -0.5, left: 1, right: 0.8 },
         2: { q: 0.5, r: -0.25, left: 0.9, right: 0.7 },
         3: { q: 0.5, r: 0, left: 0.8, right: 0.6 },
         4: { q: 0.25, r: 0.25, left: 0.7, right: 0.5 },
         5: { q: 0, r: 0.5, left: 0.6, right: 0.4 },
         6: { q: -0.25, r: 0.5, left: 0.5, right: 0.5 },
         7: { q: -0.5, r: 0.5, left: 0.4, right: 0.6 },
         8: { q: -0.5, r: 0.25, left: 0.5, right: 0.7 },
         9: { q: -0.5, r: 0, left: 0.6, right: 0.8 },
         10: { q: -0.25, r: -0.25, left: 0.7, right: 0.9 },
         11: { q: 0, r: -0.5, left: 0.8, right: 1 },
      }
   }

   draw = () => {
      this.ctx.drawImage(this.renderCanvas, this.camera.position.x, this.camera.position.y)
   }

   render = () => {

      let keys = this.hexMapData.getKeys();

      let canvasX = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let canvasY = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));

      this.renderCanvas.width = canvasX + this.hexMapData.maxHeight * this.hexMapData.VecQ.x + this.hexMapData.maxHeight * this.hexMapData.VecR.x
      this.renderCanvas.height = canvasY + this.hexMapData.maxHeight * this.hexMapData.VecQ.y + this.hexMapData.maxHeight * this.hexMapData.VecR.y

      this.hexMapData.setDimensions(
         (this.hexMapData.maxHeight * this.hexMapData.VecQ.x + this.hexMapData.maxHeight * this.hexMapData.VecR.x) / 2,
         (this.hexMapData.maxHeight * this.hexMapData.VecQ.y + this.hexMapData.maxHeight * this.hexMapData.VecR.y) / 2
      )

      this.renderctx.fillStyle = 'rosybrown'
      this.renderctx.fillRect(0, 0, this.renderCanvas.width, this.renderCanvas.height)

      this.drawGroundShadowLayer();

      for (let i = 0; i <= this.hexMapData.maxHeight; i++) {
         this.drawTileLayer(i);

         this.drawShadowLayer(i);

      }

      

   }

   drawTileLayer = (height) => {

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset;
         let yOffset;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
         }

         //draw hexagon if at height
         if (value.height == height) {

            if (this.hexMapData.flipped) {
               this.drawFlatHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'hsl(210, 100%, 90%)' : height >= 3 ? 'hsl(30, 60%, 50%)' : height >= 1 ? 'hsl(120, 100%, 25%)' : 'hsl(190, 90%, 50%)',
                  height >= 5 ? 'hsl(210, 100%, 80%)' : height >= 3 ? 'hsl(30, 60%, 40%)' : height >= 1 ? 'hsl(120, 100%, 20%)' : 'hsl(190, 90%, 70%)'
               );
            } else {
               this.drawPointyHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? 'hsl(210, 100%, 90%)' : height >= 3 ? 'hsl(30, 60%, 50%)' : height >= 1 ? 'hsl(120, 100%, 25%)' : 'hsl(190, 90%, 50%)',
                  height >= 5 ? 'hsl(210, 100%, 80%)' : height >= 3 ? 'hsl(30, 60%, 40%)' : height >= 1 ? 'hsl(120, 100%, 20%)' : 'hsl(190, 90%, 70%)'
               );
            }

         }

         //draw hexagon wall
         if (value.height >= height &&
            (
               !this.hexMapData.hasEntry(keyObj.q - 1, keyObj.r + 1)
               || !this.hexMapData.hasEntry(keyObj.q, keyObj.r + 1)
               || this.hexMapData.getEntry(keyObj.q - 1, keyObj.r + 1).height < height
               || this.hexMapData.getEntry(keyObj.q, keyObj.r + 1).height < height
            )
         ) {

            if (this.hexMapData.flipped) {
               this.drawFlatHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? `hsl(210, 100%, 95%)` : height >= 3 ? `hsl(30, 60%, 55%)` : height >= 1 ? `hsl(120, 100%, 30%)` : `hsl(190, 90%, 55%)`,
                  height >= 5 ? `hsl(210, 100%, 85%)` : height >= 3 ? `hsl(30, 60%, 45%)` : height >= 1 ? `hsl(120, 100%, 25%)` : `hsl(190, 90%, 75%)`
               );
            } else {
               this.drawPointyHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 5 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                     : height >= 3 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                        : height >= 1 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`,

                  height >= 5 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                     : height >= 3 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                        : height >= 1 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[this.hexMapData.rotation].left}%)`,

                  height >= 5 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                     : height >= 3 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                        : height >= 1 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`,

                  height >= 5 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                     : height >= 3 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                        : height >= 1 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[this.hexMapData.rotation].right}%)`
               );
            }


         }
      }

   }

   drawShadowLayer = (height) => {

      let shadowDims;

      if (this.hexMapData.flipped) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      } else {
         shadowDims = {
            x: (this.hexMapData.VecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.VecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      }

      //clip current layer
      this.renderctx.beginPath();

      for (let [key, value] of this.hexMapData.getMap()) {

         if (value.height == height) {

            let keyObj = this.hexMapData.split(key);

            let xOffset;
            let yOffset;

            if (this.hexMapData.flipped) {
               xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
               yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

            } else {
               xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
               yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
            }


            if (this.hexMapData.flipped) {
               this.clipFlatHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight
               );
            } else {
               this.clipPointyHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight
               );
            }

         }

      }

      this.renderctx.save();
      this.renderctx.clip();

      //draw shadow
      this.renderctx.beginPath();
      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset;
         let yOffset;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
         }

         for (let i = height + 1; i <= value.height; i++) {
            if (this.hexMapData.flipped) {
               this.clipFlatHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i - height),
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (i - height)
               );
            } else {
               this.clipPointyHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i - height),
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (i - height)
               );
            }

         }

      }
      this.renderctx.fillStyle = 'rgba(25,25,25,0.3)';
      this.renderctx.fill();
      this.renderctx.restore();

   }

   drawGroundShadowLayer = () => {

      let shadowDims;

      if (this.hexMapData.flipped) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      } else {
         shadowDims = {
            x: (this.hexMapData.VecQ.x * this.shadowRotationDims[this.hexMapData.rotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[this.hexMapData.rotation].r),
            y: (this.hexMapData.VecQ.y * this.shadowRotationDims[this.hexMapData.rotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[this.hexMapData.rotation].r * this.hexMapData.squish)

         }
      }

      this.renderctx.beginPath();

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let xOffset;
         let yOffset;

         if (this.hexMapData.flipped) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         }

         for (let i = 0; i <= value.height; i++) {
            if (this.hexMapData.flipped) {
               this.clipFlatHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i + 1),
                  this.hexMapData.y + yOffset + this.hexMapData.tileHeight + shadowDims.y * (i + 1)
               );
            } else {
               this.clipPointyHexagonPath(
                  this.hexMapData.x + xOffset + shadowDims.x * (i + 1),
                  this.hexMapData.y + yOffset + this.hexMapData.tileHeight + shadowDims.y * (i + 1)
               );
            }
         }
      }

      this.renderctx.fillStyle = 'rgba(25,25,25,0.3)';
      this.renderctx.fill();

   }

   drawPointyHexagonWall = (x, y, leftFillColor, leftLineColor, rightFillColor, rightLineColor) => {

      //draw left side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = leftFillColor;
      this.renderctx.strokeStyle = leftLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw right side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = rightFillColor;
      this.renderctx.strokeStyle = rightLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

   }

   drawFlatHexagonWall = (x, y, leftFillColor, leftLineColor, centerFillColor, centerLineColor, rightFillColor, rightLineColor) => {

      //draw left side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = leftFillColor;
      this.renderctx.strokeStyle = leftLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw center side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = centerFillColor;
      this.renderctx.strokeStyle = centerLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw right side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = rightFillColor;
      this.renderctx.strokeStyle = rightLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

   }

   drawPointyHexagon = (x, y, fillColor, lineColor) => {
      this.renderctx.fillStyle = fillColor;
      this.renderctx.strokeStyle = lineColor;

      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 3) * this.hexMapData.size, y + Math.cos(this.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 4) * this.hexMapData.size, y + Math.cos(this.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 6) * this.hexMapData.size, y + Math.cos(this.sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.fill();
      if (lineColor) this.renderctx.stroke();
   }

   drawFlatHexagon = (x, y, fillColor, lineColor) => {
      this.renderctx.fillStyle = fillColor;
      this.renderctx.strokeStyle = lineColor;

      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 3 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 3 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 4 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 4 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.fill();
      if (lineColor) this.renderctx.stroke();
   }

   clipPointyHexagonPath = (x, y) => {
      this.renderctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 3) * this.hexMapData.size, y + Math.cos(this.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 4) * this.hexMapData.size, y + Math.cos(this.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 6) * this.hexMapData.size, y + Math.cos(this.sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));
   }

   clipFlatHexagonPath = (x, y) => {
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 3 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 3 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 4 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 4 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
   }

}

