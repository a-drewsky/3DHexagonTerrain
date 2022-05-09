export default class HexMapViewClass {

   constructor(ctx, camera, hexMapData, lineWidth, shadowSize, tableHeight, initCameraPosition, colors, sideColorMultiplier) {
      this.ctx = ctx;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.renderCanvasDims = null;
      this.renderctx = null;
      this.renderMap = new Map();
      this.rotatedMap = null;
      this.tablePosition = null;

      //Settings
      this.sideLength = Math.PI / 3;
      this.lineWidth = lineWidth;
      this.tableHeight = tableHeight;
      this.initCameraPosition = initCameraPosition;
      this.colors = colors;
      this.sideColorMultiplier = sideColorMultiplier;

      //starts at top position and rotates clockwise
      this.shadowRotationDims = {
         0: { q: 0.25 * shadowSize, r: -0.5 * shadowSize, left: 0.9, right: 0.9, offset: 0.7, wallBot: 1 },
         1: { q: 0.5 * shadowSize, r: -0.5 * shadowSize, left: 1, right: 0.8, offset: 0.6, wallBot: 0.9 },
         2: { q: 0.5 * shadowSize, r: -0.25 * shadowSize, left: 0.9, right: 0.7, offset: 0.5, wallBot: 0.8 },
         3: { q: 0.5 * shadowSize, r: 0 * shadowSize, left: 0.8, right: 0.6, offset: 0.4, wallBot: 0.7 },
         4: { q: 0.25 * shadowSize, r: 0.25 * shadowSize, left: 0.7, right: 0.5, offset: 0.5, wallBot: 0.6 },
         5: { q: 0 * shadowSize, r: 0.5 * shadowSize, left: 0.6, right: 0.4, offset: 0.6, wallBot: 0.5 },
         6: { q: -0.25 * shadowSize, r: 0.5 * shadowSize, left: 0.5, right: 0.5, offset: 0.7, wallBot: 0.4 },
         7: { q: -0.5 * shadowSize, r: 0.5 * shadowSize, left: 0.4, right: 0.6, offset: 0.8, wallBot: 0.5 },
         8: { q: -0.5 * shadowSize, r: 0.25 * shadowSize, left: 0.5, right: 0.7, offset: 0.9, wallBot: 0.6 },
         9: { q: -0.5 * shadowSize, r: 0 * shadowSize, left: 0.6, right: 0.8, offset: 1, wallBot: 0.7 },
         10: { q: -0.25 * shadowSize, r: -0.25 * shadowSize, left: 0.7, right: 0.9, offset: 0.9, wallBot: 0.8 },
         11: { q: 0 * shadowSize, r: -0.5 * shadowSize, left: 0.8, right: 1, offset: 0.8, wallBot: 0.9 },
      }
   }

   setRender = (shadowRotation, cameraRotation, canvas) => {
      this.renderMap.set(shadowRotation + ',' + cameraRotation, canvas);
   }

   getRender = (shadowRotation, cameraRotation) => {
      return this.renderMap.get(shadowRotation + ',' + cameraRotation);
   }

   draw = () => {

      if(!this.renderMap.has(this.hexMapData.rotation + ',' + this.camera.rotation)) this.render();

      let render = this.getRender(this.hexMapData.rotation, this.camera.rotation);

      console.log(this.camera.zoom)

      this.ctx.drawImage(render, -this.camera.position.x, -this.camera.position.y, render.width + (this.camera.zoom * 100), render.height + (this.camera.zoom * 100))
   }

   initialize = () => {

      //set hexmap size to highest zoom level to calculate render size
      let newSize = this.hexMapData.baseSize + this.camera.maxZoom;

      console.log(newSize)

      this.hexMapData.size = newSize;

      this.hexMapData.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
      this.hexMapData.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }

      this.hexMapData.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
      this.hexMapData.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }

      //Set render canvas size
      let keys = this.hexMapData.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      this.renderCanvasDims = {
         width: mapHyp * 2 / this.hexMapData.squish + 100,
         height: mapHyp * 2 + 100
      }

      //set the camera position (move to camera init function)
      this.camera.setPosition(this.renderCanvasDims.width * this.initCameraPosition.x, this.renderCanvasDims.height * this.initCameraPosition.y)

      //Set the hexmap position to the center of the canvas
      this.hexMapData.setDimensions(this.renderCanvasDims.width / 2, this.renderCanvasDims.height / 2); //causing zooming issue

      //reset hexmap size
      newSize = this.hexMapData.baseSize;
      this.hexMapData.size = newSize;

      this.hexMapData.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
      this.hexMapData.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }

      this.hexMapData.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
      this.hexMapData.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }

   }

   render = () => {

      this.setRender(this.hexMapData.rotation, this.camera.rotation, document.createElement('canvas'));
      this.getRender(this.hexMapData.rotation, this.camera.rotation).width = this.renderCanvasDims.width;
      this.getRender(this.hexMapData.rotation, this.camera.rotation).height = this.renderCanvasDims.height;
      this.renderctx = this.getRender(this.hexMapData.rotation, this.camera.rotation).getContext("2d");

      //set renderctx properties
      this.renderctx.lineWidth = this.lineWidth;
      this.renderctx.lineJoin = 'round';
      this.renderctx.lineCap = 'round';
      this.renderctx.textAlign = 'center';
      this.renderctx.textBaseline = 'middle'
      this.renderctx.clearRect(0, 0, this.renderCanvasDims.width, this.renderCanvasDims.height);

      //Rotate the hexmap and set the rotatedMap object
      let sortedArr = this.hexMapData.getKeys();

      for (let i = 0; i < sortedArr.length; i++) {
         sortedArr[i] = {
            value: this.hexMapData.getEntry(sortedArr[i].q, sortedArr[i].r),
            position: this.rotateTile(sortedArr[i].q, sortedArr[i].r, this.camera.rotation)
         };
      }

      sortedArr.sort((a, b) => { return a.position.r - b.position.r || a.position.q - b.position.q });

      this.rotatedMap = new Map();

      for (let i = 0; i < sortedArr.length; i++) {
         this.rotatedMap.set(this.hexMapData.join(sortedArr[i].position.q, sortedArr[i].position.r), sortedArr[i].value);
      }


      //Draw the table
      this.drawTable();


      //draw the hex map

      this.drawGroundShadowLayer();

      for (let i = 1; i <= this.hexMapData.maxHeight; i++) {
         this.drawTileLayer(i);

         if (i < this.hexMapData.maxHeight) this.drawShadowLayer(i);

      }

   }

   drawTable = () => {
      
      let keys = this.hexMapData.getKeys();
      
      let minR = Math.min(...keys.map(key => key.r));
      let maxR = Math.max(...keys.map(key => key.r));
      let minRminQ = Math.min(...keys.filter(key => key.r == minR).map(key => key.q));
      let minRmaxQ = Math.max(...keys.filter(key => key.r == minR).map(key => key.q));
      let maxRminQ = Math.min(...keys.filter(key => key.r == maxR).map(key => key.q));
      let maxRmaxQ = Math.max(...keys.filter(key => key.r == maxR).map(key => key.q));

      let tableDims = {
         q1: this.rotateTile(minRminQ - 1, minR - 2, this.camera.rotation).q,
         r1: this.rotateTile(minRminQ - 1, minR - 2, this.camera.rotation).r,

         q2: this.rotateTile(minRmaxQ + 3, minR - 2, this.camera.rotation).q,
         r2: this.rotateTile(minRmaxQ + 3, minR - 2, this.camera.rotation).r,

         q3: this.rotateTile(maxRmaxQ + 1, maxR + 2, this.camera.rotation).q,
         r3: this.rotateTile(maxRmaxQ + 1, maxR + 2, this.camera.rotation).r,

         q4: this.rotateTile(maxRminQ - 3, maxR + 2, this.camera.rotation).q,
         r4: this.rotateTile(maxRminQ - 3, maxR + 2, this.camera.rotation).r
      }

      let hexVecQ = this.camera.rotation % 2 == 0 ? this.hexMapData.VecQ : this.hexMapData.flatTopVecQ
      let hexVecR = this.camera.rotation % 2 == 0 ? this.hexMapData.VecR : this.hexMapData.flatTopVecR

      let tablePosition = [
         {
            x: this.hexMapData.x + hexVecQ.x * tableDims.q1 + hexVecR.x * tableDims.r1,
            y: this.hexMapData.y + hexVecQ.y * tableDims.q1 * this.hexMapData.squish + hexVecR.y * tableDims.r1 * this.hexMapData.squish
         },

         {
            x: this.hexMapData.x + hexVecQ.x * tableDims.q2 + hexVecR.x * tableDims.r2,
            y: this.hexMapData.y + hexVecQ.y * tableDims.q2 * this.hexMapData.squish + hexVecR.y * tableDims.r2 * this.hexMapData.squish
         },

         {
            x: this.hexMapData.x + hexVecQ.x * tableDims.q3 + hexVecR.x * tableDims.r3,
            y: this.hexMapData.y + hexVecQ.y * tableDims.q3 * this.hexMapData.squish + hexVecR.y * tableDims.r3 * this.hexMapData.squish
         },

         {
            x: this.hexMapData.x + hexVecQ.x * tableDims.q4 + hexVecR.x * tableDims.r4,
            y: this.hexMapData.y + hexVecQ.y * tableDims.q4 * this.hexMapData.squish + hexVecR.y * tableDims.r4 * this.hexMapData.squish
         }
      ]

      this.tablePosition = [...tablePosition];

      this.renderctx.fillStyle = `hsl(${this.colors.TABLE_FILL.h}, ${this.colors.TABLE_FILL.s}%, ${this.colors.TABLE_FILL.l}%)`
      this.renderctx.strokeStyle = `hsl(${this.colors.TABLE_STROKE.h}, ${this.colors.TABLE_STROKE.s}%, ${this.colors.TABLE_STROKE.l}%)`
      this.renderctx.beginPath();
      this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
      this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
      this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y);
      this.renderctx.lineTo(tablePosition[3].x, tablePosition[3].y);
      this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw table legs

      tablePosition.sort((a, b) => a.y - b.y)


      let shadowRotation = this.hexMapData.rotation + this.camera.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.camera.rotation % 3 == 0) {

         tablePosition.shift();
         tablePosition.shift();

         this.renderctx.fillStyle = `hsl(${this.colors.TABLE_FILL.h}, ${this.colors.TABLE_FILL.s}%, ${this.colors.TABLE_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.TABLE_STROKE.h}, ${this.colors.TABLE_STROKE.s}%, ${this.colors.TABLE_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`



         this.renderctx.beginPath();
         this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);
         this.renderctx.fill();
         this.renderctx.stroke();

      } else {

         tablePosition.shift();

         tablePosition.sort((a, b) => a.x - b.x)


         let shiftedShadowRotation = this.hexMapData.rotation + Math.floor(this.camera.rotation / 3) * 3;

         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;


         this.renderctx.fillStyle = `hsl(${this.colors.TABLE_FILL.h}, ${this.colors.TABLE_FILL.s}%, ${this.colors.TABLE_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.TABLE_STROKE.h}, ${this.colors.TABLE_STROKE.s}%, ${this.colors.TABLE_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         this.renderctx.beginPath();
         this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);
         this.renderctx.fill();
         this.renderctx.stroke();

         shiftedShadowRotation += 3;
         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;

         this.renderctx.fillStyle = `hsl(${this.colors.TABLE_FILL.h}, ${this.colors.TABLE_FILL.s}%, ${this.colors.TABLE_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.TABLE_STROKE.h}, ${this.colors.TABLE_STROKE.s}%, ${this.colors.TABLE_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         this.renderctx.beginPath();
         this.renderctx.moveTo(tablePosition[2].x, tablePosition[2].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
         this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y + this.tableHeight);
         this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y);
         this.renderctx.fill();
         this.renderctx.stroke();

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
                  
                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l}%)` 
                  : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l}%)` 
                  : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l}%)` 
                  : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l}%)` 
                  : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l}%)` 
                  : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l}%)` 
                  : `hsl(${this.colors.WATER_STROKE.h}, ${this.colors.WATER_STROKE.s}%, ${this.colors.WATER_STROKE.l}%)`
               );
            } else {
               this.drawPointyHexagon(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,

                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l}%)` 
                  : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l}%)` 
                  : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l}%)` 
                  : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l}%)` 
                  : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l}%)` 
                  : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l}%)` 
                  : `hsl(${this.colors.WATER_STROKE.h}, ${this.colors.WATER_STROKE.s}%, ${this.colors.WATER_STROKE.l}%)`
               );
            }

         }

         //draw hexagon wall
         if (value.height >= height) {

            if (this.camera.rotation % 2 == 1) {
               this.drawFlatHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,


                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,


                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,
               );
            } else {
               this.drawPointyHexagonWall(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_FILL.h}, ${this.colors.SNOW_FILL.s}%, ${this.colors.SNOW_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_FILL.h}, ${this.colors.ROCKS_FILL.s}%, ${this.colors.ROCKS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_FILL.h}, ${this.colors.GRASS_FILL.s}%, ${this.colors.GRASS_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_FILL.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,

                  height >= 6 ? `hsl(${this.colors.SNOW_STROKE.h}, ${this.colors.SNOW_STROKE.s}%, ${this.colors.SNOW_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                     : height >= 4 ? `hsl(${this.colors.ROCKS_STROKE.h}, ${this.colors.ROCKS_STROKE.s}%, ${this.colors.ROCKS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                        : height >= 2 ? `hsl(${this.colors.GRASS_STROKE.h}, ${this.colors.GRASS_STROKE.s}%, ${this.colors.GRASS_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                           : `hsl(${this.colors.WATER_FILL.h}, ${this.colors.WATER_FILL.s}%, ${this.colors.WATER_STROKE.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
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

      //clip table
      this.renderctx.beginPath();

      this.renderctx.moveTo(this.tablePosition[0].x, this.tablePosition[0].y);
      this.renderctx.lineTo(this.tablePosition[1].x, this.tablePosition[1].y);
      this.renderctx.lineTo(this.tablePosition[2].x, this.tablePosition[2].y);
      this.renderctx.lineTo(this.tablePosition[3].x, this.tablePosition[3].y);
      this.renderctx.lineTo(this.tablePosition[0].x, this.tablePosition[0].y);

      this.renderctx.save();
      this.renderctx.clip();

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
      this.renderctx.restore();

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

