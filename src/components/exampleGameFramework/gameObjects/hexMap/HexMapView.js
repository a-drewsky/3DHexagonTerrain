export default class HexMapViewClass {

   constructor(ctx, canvas, camera, hexMapData, lineWidth, shadowSize, tableHeight, initCameraPosition, initCameraRotation, colors, sideColorMultiplier, zoomMultiplier, elevationRanges, rotationPattern, debug, geometricTilesDebug, images) {
      this.ctx = ctx;
      this.canvas = canvas;
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
      this.initCameraRotation = initCameraRotation;
      this.colors = colors;
      this.sideColorMultiplier = sideColorMultiplier;
      this.zoomMultiplier = zoomMultiplier;
      this.renderTileHeight = null;
      this.elevationRanges = elevationRanges;
      this.rotationPattern = rotationPattern

      //Debug Settings
      this.debug = debug;
      this.geometricTilesDebug = geometricTilesDebug;

      this.images = images;

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

   setRender = (cameraRotation, zoomLevel, canvas) => {
      this.renderMap.set(cameraRotation + ',' + zoomLevel, canvas);
   }

   getRender = (cameraRotation, zoomLevel) => {
      return this.renderMap.get(cameraRotation + ',' + zoomLevel);
   }

   draw = () => {

      let render = this.getRender(this.camera.rotation, this.camera.zoom)

      //this.ctx.drawImage(render, -this.camera.position.x, -this.camera.position.y)
      this.ctx.drawImage(render, this.camera.position.x, this.camera.position.y, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)

      if (this.debug) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   initialize = () => {

      console.log('initiate')

      //set hexmap size to highest zoom level to calculate render size
      let newSize = this.hexMapData.baseSize + this.zoomMultiplier * this.camera.maxZoom;

      console.log(this.hexMapData)

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
         width: mapHyp / this.hexMapData.squish + 200,
         height: mapHyp + 200
      }

      console.log(this.renderCanvasDims)

      //Set the hexmap position to the center of the canvas
      this.hexMapData.setDimensions((this.renderCanvasDims.width - mapWidth) / 2 + 50, (this.renderCanvasDims.height - mapHeight) / 2 + 50); //causing zooming issue

      //reset hexmap size
      newSize = this.hexMapData.baseSize;
      this.hexMapData.size = newSize;

      this.hexMapData.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
      this.hexMapData.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }

      this.hexMapData.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
      this.hexMapData.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }

      //render all configs
      let renderConfig = (zoomLevel, cameraRotation) => {
         this.camera.zoom = zoomLevel;



         this.camera.rotation = cameraRotation;

         this.render();
         this.count++;
      }

      let renderZoomLevels = (cameraRotation) => {
         for (let i = -1 * this.camera.maxZoom; i <= this.camera.maxZoom; i++) {
            renderConfig(i, cameraRotation);
         }
      }

      let renderCameraRotations = () => {
         for (let i = 0; i < 12; i++) {
            renderZoomLevels(i);
         }
      }
      this.count = 0;
      renderCameraRotations();
      console.log(this.count)

      //set the camera position (move to camera init function)
      this.camera.setPosition(this.renderCanvasDims.width * this.initCameraPosition.x, this.renderCanvasDims.height * this.initCameraPosition.y)
      this.camera.rotation = this.initCameraRotation[this.rotationPattern];
      this.camera.zoom = 0;

      //reset hexmap size
      newSize = this.hexMapData.baseSize;
      this.hexMapData.size = newSize;

      this.hexMapData.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
      this.hexMapData.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }

      this.hexMapData.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
      this.hexMapData.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }
   }

   render = () => {

      if (this.rotationPattern == 'all' || (this.camera.rotation%2==0 && this.rotationPattern == 'pointy') || (this.camera.rotation%2==1 && this.rotationPattern == 'flat')) {
         this.setRender(this.camera.rotation, this.camera.zoom, document.createElement('canvas'));
         this.getRender(this.camera.rotation, this.camera.zoom).width = this.renderCanvasDims.width;
         this.getRender(this.camera.rotation, this.camera.zoom).height = this.renderCanvasDims.height;
         this.renderctx = this.getRender(this.camera.rotation, this.camera.zoom).getContext("2d");
   
         //set renderctx properties
         this.renderctx.lineJoin = 'round';
         this.renderctx.lineCap = 'round';
         this.renderctx.textAlign = 'center';
         this.renderctx.textBaseline = 'middle'
         this.renderctx.clearRect(0, 0, this.renderCanvasDims.width, this.renderCanvasDims.height);
         this.renderctx.lineWidth = this.lineWidth * (1 - this.camera.zoom / this.hexMapData.tileHeight);
   
         this.renderTileHeight = this.hexMapData.tileHeight * ((this.hexMapData.baseSize - this.camera.zoom * this.zoomMultiplier) / this.hexMapData.baseSize)
   
         if (this.debug) this.renderctx.strokeRect(0, 0, this.renderCanvasDims.width, this.renderCanvasDims.height)
      }



      //set size based on zoom level
      let newSize = this.hexMapData.baseSize - this.camera.zoom * this.zoomMultiplier;
      this.hexMapData.size = newSize;
      this.hexMapData.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
      this.hexMapData.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }
      this.hexMapData.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
      this.hexMapData.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }

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



      //Set render canvas size
      let keys = [...this.rotatedMap.keys()].map(key => this.hexMapData.split(key))

      let mapWidthMax = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeightMax = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)));
      let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)));

      let mapWidth = Math.max(mapWidthMax, mapWidthMin)
      let mapHeight = Math.max(mapHeightMax, mapHeightMin)

      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      // this.renderCanvasDims = {
      //    width: mapHyp / this.hexMapData.squish + 100,
      //    height: mapHyp + 100
      // }

      console.log(this.camera.rotation)

      //Set the hexmap position to the center of the canvas

      let renderHexMapPos = {
         x: 0,
         y: 0
      }

      switch (this.camera.rotation) {
         case 0:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 8)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 4.5)
            break;
         case 1:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 13)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 3.5)
            break;
         case 2:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7.5)
            break;
         case 3:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9.5)
            break;
         case 4:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 12.5)
            break;
         case 5:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 15)
            break;
         case 6:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19.5)
            break;
         case 7:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 20.5)
            break;
         case 8:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 16.5)
            break;
         case 9:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 14.5)
            break;
         case 10:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11.5)
            break;
         case 11:
            renderHexMapPos.x = this.renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 5)
            renderHexMapPos.y = this.renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9)
            break;
      }


      this.hexMapData.setDimensions(renderHexMapPos.x, renderHexMapPos.y);
      this.hexMapData.posMap.set(this.camera.rotation + ',' + this.camera.zoom, {
         x: renderHexMapPos.x,
         y: renderHexMapPos.y
      })

      if (this.rotationPattern == 'all' || (this.camera.rotation%2==0 && this.rotationPattern == 'pointy') || (this.camera.rotation%2==1 && this.rotationPattern == 'flat')) {
         //Draw the table
         this.drawTable();


         //draw the hex map

         this.drawGroundShadowLayer();

         for (let i = 1; i <= this.hexMapData.maxHeight; i++) {
            this.drawTileLayer(i);

            if (i < this.hexMapData.maxHeight) this.drawShadowLayer(i);

         }
      }

      console.log("render")

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

      console.log(this.colors)

      this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l}%)`
      this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l}%)`
      this.renderctx.beginPath();
      this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
      this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
      this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y);
      this.renderctx.lineTo(tablePosition[3].x, tablePosition[3].y);
      this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw table sides

      tablePosition.sort((a, b) => a.y - b.y)


      let shadowRotation = this.hexMapData.rotation + this.camera.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.camera.rotation % 3 == 0) {

         tablePosition.shift();
         tablePosition.shift();

         console.log("shadow rotation: " + this.hexMapData.rotation, this.camera.rotation)

         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`



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


         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

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

         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

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
               if (this.geometricTilesDebug) {
                  this.drawFlatHexagon(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsl(${this.colors[value.biome].fill.h}, ${this.colors[value.biome].fill.s}%, ${this.colors[value.biome].fill.l}%)`,
                     `hsl(${this.colors[value.biome].stroke.h}, ${this.colors[value.biome].stroke.s}%, ${this.colors[value.biome].stroke.l}%)`,
                     '' + keyObj.q + ',' + keyObj.r
                  );
               }
            } else {
               if (this.geometricTilesDebug) {
                  this.drawPointyHexagon(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsl(${this.colors[value.biome].fill.h}, ${this.colors[value.biome].fill.s}%, ${this.colors[value.biome].fill.l}%)`,
                     `hsl(${this.colors[value.biome].stroke.h}, ${this.colors[value.biome].stroke.s}%, ${this.colors[value.biome].stroke.l}%)`,
                     '' + keyObj.q + ',' + keyObj.r
                  );
               }
            }

         }

         //draw hexagon wall
         if (value.height >= height) {

            let tileBiome = value.verylowBiome;

            if (height >= this.elevationRanges['low']) {
               tileBiome = value.lowBiome
            }
            if (height >= this.elevationRanges['mid']) {
               tileBiome = value.midBiome
            }
            if (height >= this.elevationRanges['high']) {
               tileBiome = value.highBiome
            }
            if (height >= this.elevationRanges['veryhigh']) {
               tileBiome = value.veryhighBiome
            }

            if (this.camera.rotation % 2 == 1) {

               if (this.geometricTilesDebug) {
                  this.drawFlatHexagonWall(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,
                  );
               } else {
                  this.renderctx.drawImage(
                     this.images['flat_' + tileBiome + '_hex'],
                     this.hexMapData.x + xOffset - this.hexMapData.size,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight - (this.hexMapData.size * this.hexMapData.squish),
                     this.hexMapData.size * 2,
                     this.hexMapData.size * 2
                  )

                  this.drawFlatHexagonWall(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`
                  );
               }



            } else {

               if (this.geometricTilesDebug) {
                  this.drawPointyHexagonWall(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                  );
               } else {
                  this.renderctx.drawImage(
                     this.images['pointy_' + tileBiome + '_hex'],
                     this.hexMapData.x + xOffset - this.hexMapData.size,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight - (this.hexMapData.size * this.hexMapData.squish),
                     this.hexMapData.size * 2,
                     this.hexMapData.size * 2
                  )

                  this.drawPointyHexagonWall(
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.renderTileHeight,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                     `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                  );
               }

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
                  this.hexMapData.y + yOffset - height * this.renderTileHeight
               );
            } else {
               this.clipPointyHexagonPath(
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.renderTileHeight
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
               this.hexMapData.y + yOffset - height * this.renderTileHeight,
               this.hexMapData.x + xOffset + shadowDims.x * (value.height - height),
               this.hexMapData.y + yOffset - height * this.renderTileHeight + shadowDims.y * (value.height - height),
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
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = leftFillColor;
      this.renderctx.strokeStyle = leftLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw right side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
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
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 5 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 5 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
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
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = centerFillColor;
      this.renderctx.strokeStyle = centerLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

      //draw right side
      this.renderctx.beginPath();
      this.renderctx.moveTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 2 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 2 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.renderTileHeight);
      this.renderctx.lineTo(x + Math.sin(this.sideLength * 1 - this.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.sideLength * 1 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

      this.renderctx.fillStyle = rightFillColor;
      this.renderctx.strokeStyle = rightLineColor;
      this.renderctx.fill();
      this.renderctx.stroke();

   }

   drawPointyHexagon = (x, y, fillColor, lineColor, tileGroup) => {
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
      if (lineColor) this.renderctx.stroke();

      if (this.debug) {
         this.renderctx.font = '10px serif';
         this.renderctx.fillStyle = 'black';
         this.renderctx.fillText(tileGroup, x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size + 12, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) - 18)
      }
   }

   drawFlatHexagon = (x, y, fillColor, lineColor, tileGroup) => {
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

      if (this.debug) {
         this.renderctx.font = '10px serif';
         this.renderctx.fillStyle = 'black';
         this.renderctx.fillText(tileGroup, x + Math.sin(this.sideLength * 0 - this.sideLength / 2) * this.hexMapData.size + 12, y + Math.cos(this.sideLength * 0 - this.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) - 18)
      }
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

