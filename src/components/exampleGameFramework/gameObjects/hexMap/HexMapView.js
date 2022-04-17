export default class HexMapViewClass {

   constructor(ctx, camera, hexMapData) {
      this.ctx = ctx;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.sideLength = Math.PI / 3;

      this.renderCanvas = document.createElement('canvas');
      this.renderctx = this.renderCanvas.getContext('2d');

      this.rotatedMap = null;


      //starts at top position and rotates clockwise
      this.shadowRotationDims = {
         0: { q: 0.25, r: -0.5, left: 0.9, right: 0.9, offset: 0.7 },
         1: { q: 0.5, r: -0.5, left: 1, right: 0.8, offset: 0.6 },
         2: { q: 0.5, r: -0.25, left: 0.9, right: 0.7, offset: 0.5 },
         3: { q: 0.5, r: 0, left: 0.8, right: 0.6, offset: 0.4 },
         4: { q: 0.25, r: 0.25, left: 0.7, right: 0.5, offset: 0.5 },
         5: { q: 0, r: 0.5, left: 0.6, right: 0.4, offset: 0.6 },
         6: { q: -0.25, r: 0.5, left: 0.5, right: 0.5, offset: 0.7 },
         7: { q: -0.5, r: 0.5, left: 0.4, right: 0.6, offset: 0.8 },
         8: { q: -0.5, r: 0.25, left: 0.5, right: 0.7, offset: 0.9 },
         9: { q: -0.5, r: 0, left: 0.6, right: 0.8, offset: 1 },
         10: { q: -0.25, r: -0.25, left: 0.7, right: 0.9, offset: 0.9 },
         11: { q: 0, r: -0.5, left: 0.8, right: 1, offset: 0.8 },
      }
   }

   draw = () => {
      this.ctx.drawImage(this.renderCanvas, -this.camera.position.x, -this.camera.position.y)
   }

   render = () => {


      let sortedArr = this.hexMapData.getKeys();

      console.log(this.hexMapData.getMap());

      for(let i=0; i<sortedArr.length; i++){
         sortedArr[i] = {
            value: this.hexMapData.getEntry(sortedArr[i].q, sortedArr[i].r),
            position: this.rotateTile(sortedArr[i].q, sortedArr[i].r, this.camera.rotation)
         };
      }

      sortedArr.sort((a, b) => {return a.position.r - b.position.r || a.position.q - b.position.q});

      this.rotatedMap = new Map();

      for(let i=0; i<sortedArr.length; i++){
         this.rotatedMap.set(this.hexMapData.join(sortedArr[i].position.q, sortedArr[i].position.r), sortedArr[i].value)
      }

      console.log(this.rotatedMap)

      let keys = this.hexMapData.getKeys();

      let canvasX = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let canvasY = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));

      this.renderCanvas.width = (canvasY + this.hexMapData.maxHeight * this.hexMapData.VecQ.y + this.hexMapData.maxHeight * this.hexMapData.VecR.y) * 3
      this.renderCanvas.height = (canvasY + this.hexMapData.maxHeight * this.hexMapData.VecQ.y + this.hexMapData.maxHeight * this.hexMapData.VecR.y) * 2

      // this.hexMapData.setDimensions(
      //    (this.hexMapData.maxHeight * this.hexMapData.VecQ.x + this.hexMapData.maxHeight * this.hexMapData.VecR.x) / 2,
      //    (this.hexMapData.maxHeight * this.hexMapData.VecQ.y + this.hexMapData.maxHeight * this.hexMapData.VecR.y) / 2
      // )

      this.renderctx.fillStyle = 'rosybrown'
      this.renderctx.fillRect(0, 0, this.renderCanvas.width, this.renderCanvas.height)

      this.drawGroundShadowLayer();

      for (let i = 1; i <= this.hexMapData.maxHeight; i++) {
         this.drawTileLayer(i);

         if (i < this.hexMapData.maxHeight) this.drawShadowLayer(i);

      }

   }

   rotateTile = (q, r, rotation) => {


      let s = -q - r;
      let angle = rotation * 15;
      if (rotation % 2 == 1) angle -= 15;

      let newQ = q;
      let newR = r;
      let newS = s;

      for (let i = 0; i < angle; i += 30) {
         q = -newR;
         r = -newS;
         s = -newQ;

         newQ = q;
         newR = r;
         newS = s;
      }

      return {
         q: newQ,
         r: newR
      }

   }

   drawTileLayer = (height) => {

      let shadowRotation;

      if (this.camera.rotation % 2 == 0) {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation;
      } else {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation - 1;
      }

      if (shadowRotation > 11) shadowRotation -= 12;



      for (let [key, value] of this.rotatedMap) {

         let keyObj = this.hexMapData.split(key);

         //keyObj = this.rotateTile(keyObj.q, keyObj.r, this.camera.rotation);

         let xOffset;
         let yOffset;

         if (this.camera.rotation % 2 == 1) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
         }

         //draw hexagon if at height
         if (value.height == height) {

            if (this.camera.rotation % 2 == 1) {
               this.drawFlatHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? 'hsl(210, 100%, 90%)' : height >= 4 ? 'hsl(30, 60%, 50%)' : height >= 2 ? 'hsl(120, 100%, 25%)' : 'hsl(190, 90%, 50%)',
                  height >= 6 ? 'hsl(210, 100%, 80%)' : height >= 4 ? 'hsl(30, 60%, 40%)' : height >= 2 ? 'hsl(120, 100%, 20%)' : 'hsl(190, 90%, 70%)'
               );
            } else {
               this.drawPointyHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? 'hsl(210, 100%, 90%)' : height >= 4 ? 'hsl(30, 60%, 50%)' : height >= 2 ? 'hsl(120, 100%, 25%)' : 'hsl(190, 90%, 50%)',
                  height >= 6 ? 'hsl(210, 100%, 80%)' : height >= 4 ? 'hsl(30, 60%, 40%)' : height >= 2 ? 'hsl(120, 100%, 20%)' : 'hsl(190, 90%, 70%)'
               );
            }

         }

         //draw hexagon wall
         if (value.height >= height) {

            if (this.camera.rotation % 2 == 1) {
               this.drawFlatHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[shadowRotation].left}%)`,


                  height >= 6 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[shadowRotation].right}%)`,

                  height >= 6 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[shadowRotation].right}%)`,


                  height >= 6 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[shadowRotation].offset}%)`
                     : height >= 4 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[shadowRotation].offset}%)`
                        : height >= 2 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[shadowRotation].offset}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[shadowRotation].offset}%)`,

                  height >= 6 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[shadowRotation].offset}%)`
                     : height >= 4 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[shadowRotation].offset}%)`
                        : height >= 2 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[shadowRotation].offset}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[shadowRotation].offset}%)`,
               );
            } else {
               this.drawPointyHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(180, 20%, ${95 * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(30, 60%, ${55 * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(120, 100%, ${30 * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(190, 90%, ${55 * this.shadowRotationDims[shadowRotation].right}%)`,

                  height >= 6 ? `hsl(180, 20%, ${85 * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(30, 60%, ${45 * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(120, 100%, ${25 * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(190, 90%, ${75 * this.shadowRotationDims[shadowRotation].right}%)`
               );
            }


         }
      }

   }

   drawShadowLayer = (height) => {

      let shadowDims;

      let shadowRotation;

      if (this.camera.rotation % 2 == 0) {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation;
      } else {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation - 1;
      }

      if (shadowRotation > 11) shadowRotation -= 12;

      if (this.camera.rotation % 2 == 1) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[shadowRotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

         }
      } else {
         shadowDims = {
            x: (this.hexMapData.VecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[shadowRotation].r),
            y: (this.hexMapData.VecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

         }
      }

      //clip current layer
      this.renderctx.beginPath();

      for (let [key, value] of this.rotatedMap) {

         if (value.height == height) {

            let keyObj = this.hexMapData.split(key);

            //keyObj = this.rotateTile(keyObj.q, keyObj.r, this.camera.rotation);

            let xOffset;
            let yOffset;

            if (this.camera.rotation % 2 == 1) {
               xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
               yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;

            } else {
               xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
               yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
            }


            if (this.camera.rotation % 2 == 1) {
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
      for (let [key, value] of this.rotatedMap) {

         let keyObj = this.hexMapData.split(key);

         //keyObj = this.rotateTile(keyObj.q, keyObj.r, this.camera.rotation);

         let xOffset;
         let yOffset;

         if (this.camera.rotation % 2 == 1) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
         }

         if (value.height > height) {

            this.clipHexagonShadowPath(
               this.hexMapData.x + xOffset,
               this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
               this.hexMapData.x + xOffset + shadowDims.x * (value.height - height),
               this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (value.height - height),
               shadowRotation,
               this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
            );

         }

      }
      this.renderctx.fillStyle = 'rgba(25,25,25,0.3)';
      this.renderctx.fill();
      this.renderctx.restore();

   }

   drawGroundShadowLayer = () => {

      let shadowDims;

      let shadowRotation;

      if (this.camera.rotation % 2 == 0) {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation;
      } else {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation - 1;
      }

      if (shadowRotation > 11) shadowRotation -= 12;

      if (this.camera.rotation % 2 == 1) {
         shadowDims = {
            x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[shadowRotation].r),
            y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

         }
      } else {
         shadowDims = {
            x: (this.hexMapData.VecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[shadowRotation].r),
            y: (this.hexMapData.VecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

         }
      }

      this.renderctx.beginPath();

      for (let [key, value] of this.rotatedMap) {

         let keyObj = this.hexMapData.split(key);

         //keyObj = this.rotateTile(keyObj.q, keyObj.r, this.camera.rotation);

         let xOffset;
         let yOffset;

         if (this.camera.rotation % 2 == 1) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
         } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

         }

         this.clipHexagonShadowPath(
            this.hexMapData.x + xOffset,
            this.hexMapData.y + yOffset,
            this.hexMapData.x + xOffset + shadowDims.x * value.height,
            this.hexMapData.y + yOffset + shadowDims.y * value.height,
            shadowRotation,
            this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
         );
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

   clipHexagonShadowPath = (x, y, shadowX, shadowY, rotation, orientation) => {

      if (orientation == 'pointy') {
         if (rotation % 2 == 0) {
            this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 2 - this.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 2 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 3 - this.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 3 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 4 - this.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 4 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
         } else {
            this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 2 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 2 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 3 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 3 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
         }
      } else {
         if (rotation % 2 == 0) {
            this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 2 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 2 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 3 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 3 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 4 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 4 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2 * rotation - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2 * rotation - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
         } else {
            this.renderctx.moveTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 1 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 2 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 2 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 3 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 3 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(shadowX + Math.sin(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 4 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            this.renderctx.lineTo(x + Math.sin(this.sideLength * 6 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 6 - this.sideLength / 2 * (rotation - 1) - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
         }
      }

   }

   clipPointyHexagonPath = (x, y) => {
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 0) * this.hexMapData.size, y + Math.cos(this.sideLength * 0) * (this.hexMapData.size * this.hexMapData.squish));
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

