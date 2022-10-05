import HexMapViewMapClass from "./HexMapViewMap";
import HexMapViewSpritesClass from "./HexMapViewSprites";
import HexMapViewUtilsClass from "./HexMapViewUtils";

export default class HexMapViewClass {

   constructor(ctx, canvas, camera, hexMapData, lineWidth, shadowSize, tableHeight, initCameraPosition, initCameraRotation, colors, sideColorMultiplier, zoomAmount, elevationRanges, rotationAmount, debug, geometricTilesDebug, images) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.renderCanvasDims = null;
      this.renderctx = null;
      this.renderMap = new Map();

      //Settings
      this.sideLength = Math.PI / 3;
      this.lineWidth = lineWidth;
      this.tableHeight = tableHeight;
      this.initCameraPosition = initCameraPosition;
      this.initCameraRotation = initCameraRotation;
      this.colors = colors;
      this.sideColorMultiplier = sideColorMultiplier;
      this.zoomAmount = zoomAmount;
      this.elevationRanges = elevationRanges;
      this.rotationAmount = rotationAmount

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

      this.utils = new HexMapViewUtilsClass(this.hexMapData, this.camera, this.sideLength);
      this.mapView = new HexMapViewMapClass();
      this.spriteView = new HexMapViewSpritesClass();

   }

   setRender = (cameraRotation, canvas) => {
      this.renderMap.set(cameraRotation, canvas);
   }

   getRender = (cameraRotation) => {
      return this.renderMap.get(cameraRotation);
   }

   draw = () => {

      let render = this.getRender(this.camera.rotation, this.camera.zoom)

      //this.ctx.drawImage(render, -this.camera.position.x, -this.camera.position.y)
      this.ctx.drawImage(render, this.camera.position.x, this.camera.position.y, this.canvas.width + this.camera.zoom * this.zoomAmount, this.canvas.height + this.camera.zoom * this.zoomAmount * this.hexMapData.squish, 0, 0, this.canvas.width, this.canvas.height)

      if (this.debug) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   prerender = () => {

      console.log('initiate')

      //Set render canvas size
      let keys = this.hexMapData.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      this.renderCanvasDims = {
         width: mapHyp / this.hexMapData.squish + 200,
         height: mapHyp + 200
      }

      //Set the hexmap position to the center of the canvas
      this.hexMapData.setDimensions((this.renderCanvasDims.width - mapWidth) / 2 + 50, (this.renderCanvasDims.height - mapHeight) / 2 + 50);

      //render all configs
      let renderConfig = (cameraRotation) => {
         this.camera.rotation = cameraRotation;
         let rotatedMap = this.utils.rotateMap();
         this.render(rotatedMap);
      }


      let mapPosConfig = (cameraRotation) => {
         this.camera.rotation = cameraRotation;
         let rotatedMap = this.utils.rotateMap();
         this.setMapPos(rotatedMap);
      }

      //render camera rotations
      for (let i = 0; i < 12; i++) {
         if ((i - this.initCameraRotation) % this.rotationAmount == 0) renderConfig(i);
         else mapPosConfig(i);
      }

      //reset
      this.camera.rotation = this.initCameraRotation;


      //set camera position (top, middle or bottom)

      let maxQ = Math.max(...keys.map(key => key.q))
      let minQ = Math.min(...keys.map(key => key.q))
      let medQ = (maxQ + minQ) / 2

      let maxR = Math.max(...keys.map(key => key.r))
      let minR = Math.min(...keys.map(key => key.r))
      let medR = (maxR + minR) / 2

      let scalar = maxR / 4

      let camQ
      let camR

      switch (this.initCameraPosition) {
         case 'top':
            camQ = medQ + scalar / 2
            camR = medR - scalar
            break;
         case 'middle':
            camQ = medQ
            camR = medR
            break;
         case 'bottom':
            camQ = medQ - scalar / 2
            camR = medR + scalar
            break;
      }

      let camPos = this.utils.rotateTile(camQ, camR, this.camera.rotation)

      let mappos = this.hexMapData.posMap.get(this.camera.rotation)

      //set the camera position
      let vecQ, vecR
      if (this.camera.rotation % 2 == 0) {
         vecQ = this.hexMapData.VecQ
         vecR = this.hexMapData.VecR
      } else {
         vecQ = this.hexMapData.flatTopVecQ
         vecR = this.hexMapData.flatTopVecR
      }
      this.camera.setPosition(
         mappos.x + (camPos.q * vecQ.x + camPos.r * vecR.x) - this.canvas.width / 2,
         mappos.y + (camPos.q * vecQ.y * this.hexMapData.squish + camPos.r * vecR.y * this.hexMapData.squish) - this.canvas.height / 2
      )
   }

   setMapPos = (rotatedMap) => {

      //Set map hyp
      let keys = [...rotatedMap.keys()].map(key => this.hexMapData.split(key))

      let mapWidthMax = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeightMax = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)));
      let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)));

      let mapWidth = Math.max(mapWidthMax, mapWidthMin)
      let mapHeight = Math.max(mapHeightMax, mapHeightMin)

      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);


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


      this.hexMapData.posMap.set(this.camera.rotation, {
         x: renderHexMapPos.x,
         y: renderHexMapPos.y
      })
   }

   render = (rotatedMap) => {

      this.setRender(this.camera.rotation, document.createElement('canvas'));
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

      if (this.debug) this.renderctx.strokeRect(0, 0, this.renderCanvasDims.width, this.renderCanvasDims.height)


      //Set map hyp
      let keys = [...rotatedMap.keys()].map(key => this.hexMapData.split(key))

      let mapWidthMax = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeightMax = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)));
      let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)));

      let mapWidth = Math.max(mapWidthMax, mapWidthMin)
      let mapHeight = Math.max(mapHeightMax, mapHeightMin)

      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);


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
      this.hexMapData.posMap.set(this.camera.rotation, {
         x: renderHexMapPos.x,
         y: renderHexMapPos.y
      })

      let tablePosition = this.utils.getTablePosition();

      //Draw the table
      this.drawTable(tablePosition);


      //draw the hex map

      this.drawGroundShadowLayer(rotatedMap, tablePosition);

      for (let i = 1; i <= this.hexMapData.maxHeight; i++) {
         this.drawTileLayer(i, rotatedMap);

         if (i < this.hexMapData.maxHeight) this.drawShadowLayer(i, rotatedMap);

      }

      this.drawFeatures(rotatedMap);


      console.log("render")

   }

   drawTable = (tablePosition) => {

      console.log(tablePosition)

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

      let tempTablePosition = [...tablePosition].sort((a, b) => a.y - b.y)


      let shadowRotation = this.hexMapData.rotation + this.camera.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.camera.rotation % 3 == 0) {

         tempTablePosition.shift();
         tempTablePosition.shift();

         console.log("shadow rotation: " + this.hexMapData.rotation, this.camera.rotation)

         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`



         this.renderctx.beginPath();
         this.renderctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         this.renderctx.fill();
         this.renderctx.stroke();

      } else {

         tempTablePosition.shift();

         tempTablePosition.sort((a, b) => a.x - b.x)


         let shiftedShadowRotation = this.hexMapData.rotation + Math.floor(this.camera.rotation / 3) * 3;

         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;


         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         this.renderctx.beginPath();
         this.renderctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         this.renderctx.fill();
         this.renderctx.stroke();

         shiftedShadowRotation += 3;
         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;

         this.renderctx.fillStyle = `hsl(${this.colors.table.fill.h}, ${this.colors.table.fill.s}%, ${this.colors.table.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         this.renderctx.strokeStyle = `hsl(${this.colors.table.stroke.h}, ${this.colors.table.stroke.s}%, ${this.colors.table.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         this.renderctx.beginPath();
         this.renderctx.moveTo(tempTablePosition[2].x, tempTablePosition[2].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         this.renderctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y + this.tableHeight);
         this.renderctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y);
         this.renderctx.fill();
         this.renderctx.stroke();

      }
   }

   drawFeatures = (rotatedMap) => {
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

            let tempCanvas = this.utils.cropOutTiles(this.images['woodlands_trees'], keyObj, rotatedMap)



            //draw the image to the screen

            this.renderctx.drawImage(
               tempCanvas,
               this.hexMapData.x + xOffset - this.hexMapData.size,
               this.hexMapData.y + yOffset - value.height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish) - this.hexMapData.size,
               this.hexMapData.size * 2,
               this.hexMapData.size * 3
            )

         }
      }
   }

   drawTileLayer = (height, rotatedMap) => {

      let shadowRotation;

      if (this.camera.rotation % 2 == 0) {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation;
      } else {
         shadowRotation = this.hexMapData.rotation + this.camera.rotation - 1;
      }

      if (shadowRotation > 11) shadowRotation -= 12;


      for (let [key, value] of rotatedMap) {

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
                  this.utils.drawFlatHexagon(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                     `hsl(${this.colors[value.biome].fill.h}, ${this.colors[value.biome].fill.s}%, ${this.colors[value.biome].fill.l}%)`,
                     `hsl(${this.colors[value.biome].stroke.h}, ${this.colors[value.biome].stroke.s}%, ${this.colors[value.biome].stroke.l}%)`,
                     '' + keyObj.q + ',' + keyObj.r
                  );
               }
            } else {
               if (this.geometricTilesDebug) {
                  this.utils.drawPointyHexagon(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
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
                  this.utils.drawFlatHexagonWall(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
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
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish),
                     this.hexMapData.size * 2,
                     this.hexMapData.size * 2
                  )

                  //shadow
                  this.utils.drawFlatHexagonWall(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
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
                  this.utils.drawPointyHexagonWall(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                     `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                     `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                  );
               } else {
                  this.renderctx.drawImage(
                     this.images['pointy_' + tileBiome + '_hex'],
                     this.hexMapData.x + xOffset - this.hexMapData.size,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish),
                     this.hexMapData.size * 2,
                     this.hexMapData.size * 2
                  )

                  //shadow
                  this.utils.drawPointyHexagonWall(
                     this.renderctx,
                     this.hexMapData.x + xOffset,
                     this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight,
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

   drawShadowLayer = (height, rotatedMap) => {

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

      for (let [key, value] of rotatedMap) {

         if (value.height == height) {

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


            if (this.camera.rotation % 2 == 1) {
               this.utils.clipFlatHexagonPath(
                  this.renderctx,
                  this.hexMapData.x + xOffset,
                  this.hexMapData.y + yOffset - height * this.hexMapData.tileHeight
               );
            } else {
               this.utils.clipPointyHexagonPath(
                  this.renderctx,
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
      for (let [key, value] of rotatedMap) {

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

         if (value.height > height) {

            this.utils.clipHexagonShadowPath(
               this.renderctx,
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

   drawGroundShadowLayer = (rotatedMap, tablePosition) => {

      console.log(tablePosition)

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

      this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
      this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
      this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y);
      this.renderctx.lineTo(tablePosition[3].x, tablePosition[3].y);
      this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);

      this.renderctx.save();
      this.renderctx.clip();

      this.renderctx.beginPath();

      for (let [key, value] of rotatedMap) {

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

         this.utils.clipHexagonShadowPath(
            this.renderctx,
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

}
