import HexMapViewMapClass from "./HexMapViewMap";
import HexMapViewSpritesClass from "./HexMapViewSprites";
import HexMapViewUtilsClass from "./HexMapViewUtils";
import HexMapViewTableClass from "./HexMapViewTable";
import HexMapViewSelectionClass from "./HexMapViewSelection";

export default class HexMapViewClass {

   constructor(ctx, canvas, camera, hexMapData, settings, images) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.drawCanvas = null;
      this.drawctx = null;

      //Settings
      this.lineWidth = settings.HEXMAP_LINE_WIDTH;
      this.shadowSize = settings.SHADOW_SIZE
      this.tableHeight = settings.TABLE_HEIGHT;
      this.initCameraPosition = settings.INIT_CAMERA_POSITION;
      this.sideColorMultiplier = settings.HEXMAP_SIDE_COLOR_MULTIPLIER;
      this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES;

      //Debug Settings
      this.debug = settings.DEBUG;

      this.images = images;

      //starts at top position and rotates clockwise
      this.shadowRotationDims = {
         0: { q: 0.25 * this.shadowSize, r: -0.5 * this.shadowSize, left: 0.9, right: 0.9, offset: 0.7, wallBot: 1 },
         1: { q: 0.5 * this.shadowSize, r: -0.5 * this.shadowSize, left: 1, right: 0.8, offset: 0.6, wallBot: 0.9 },
         2: { q: 0.5 * this.shadowSize, r: -0.25 * this.shadowSize, left: 0.9, right: 0.7, offset: 0.5, wallBot: 0.8 },
         3: { q: 0.5 * this.shadowSize, r: 0 * this.shadowSize, left: 0.8, right: 0.6, offset: 0.4, wallBot: 0.7 },
         4: { q: 0.25 * this.shadowSize, r: 0.25 * this.shadowSize, left: 0.7, right: 0.5, offset: 0.5, wallBot: 0.6 },
         5: { q: 0 * this.shadowSize, r: 0.5 * this.shadowSize, left: 0.6, right: 0.4, offset: 0.6, wallBot: 0.5 },
         6: { q: -0.25 * this.shadowSize, r: 0.5 * this.shadowSize, left: 0.5, right: 0.5, offset: 0.7, wallBot: 0.4 },
         7: { q: -0.5 * this.shadowSize, r: 0.5 * this.shadowSize, left: 0.4, right: 0.6, offset: 0.8, wallBot: 0.5 },
         8: { q: -0.5 * this.shadowSize, r: 0.25 * this.shadowSize, left: 0.5, right: 0.7, offset: 0.9, wallBot: 0.6 },
         9: { q: -0.5 * this.shadowSize, r: 0 * this.shadowSize, left: 0.6, right: 0.8, offset: 1, wallBot: 0.7 },
         10: { q: -0.25 * this.shadowSize, r: -0.25 * this.shadowSize, left: 0.7, right: 0.9, offset: 0.9, wallBot: 0.8 },
         11: { q: 0 * this.shadowSize, r: -0.5 * this.shadowSize, left: 0.8, right: 1, offset: 0.8, wallBot: 0.9 },
      }

      this.utils = new HexMapViewUtilsClass(hexMapData, camera, settings, images);
      this.tableView = new HexMapViewTableClass(hexMapData, camera, settings, this.shadowRotationDims, this.utils);
      this.mapView = new HexMapViewMapClass(hexMapData, camera, settings, this.shadowRotationDims, this.images, this.utils, canvas);
      this.spriteView = new HexMapViewSpritesClass(hexMapData, camera, images, this.utils, canvas, settings);
      this.selectionView = new HexMapViewSelectionClass(hexMapData, camera, images, this.utils);

   }

   draw = () => {

      this.drawctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.tableView.draw(this.drawctx)

      this.mapView.draw(this.drawctx)

      this.selectionView.draw(this.drawctx)

      this.spriteView.draw(this.drawctx)


      if (this.debug) this.drawctx.strokeRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.ctx.drawImage(this.drawCanvas, this.camera.position.x, this.camera.position.y, this.canvas.width + this.camera.zoom * this.camera.zoomAmount, this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width), 0, 0, this.canvas.width, this.canvas.height)

      if (this.debug) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   update = () => {
      let zoom = this.camera.zoom * this.camera.zoomAmount
      if (this.camera.position.x + zoom/2 < 0 - this.canvas.width / 2) this.camera.position.x = 0 - this.canvas.width / 2 - zoom/2
      if (this.camera.position.x + zoom/2 > this.drawCanvas.width - this.canvas.width / 2) this.camera.position.x = this.drawCanvas.width - this.canvas.width / 2  - zoom/2
      if (this.camera.position.y + zoom/2*this.hexMapData.squish < 0 - this.canvas.height / 2) this.camera.position.y = 0 - this.canvas.height / 2 - zoom/2*this.hexMapData.squish
      if (this.camera.position.y + zoom/2*this.hexMapData.squish > this.drawCanvas.height - this.canvas.height / 2) this.camera.position.y = this.drawCanvas.height - this.canvas.height / 2 - zoom/2*this.hexMapData.squish
   }

   clear = () => {
      this.mapView.stackMap.clear();
      this.mapView.shadowMap.clear();
   }

   prerender = () => {

      console.log('prerender hexmap')

      //Set render canvas size
      let keys = this.hexMapData.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      let renderCanvasDims = {
         width: mapHyp / this.hexMapData.squish + 200,
         height: mapHyp + 200
      }

      this.drawCanvas = document.createElement('canvas')
      this.drawCanvas.width = renderCanvasDims.width;
      this.drawCanvas.height = renderCanvasDims.height;
      this.drawctx = this.drawCanvas.getContext("2d");

      //render map
      this.mapView.prerender(renderCanvasDims);
      console.log("map rendered")

      //render sprites
      let terrainList = this.hexMapData.terrainList

      let length = terrainList.length
      let terrainNum = 0

      while(terrainNum < length){

         console.log(terrainNum)

         this.spriteView.prerenderTerrain(this.hexMapData.terrainList[terrainNum]);

         terrainNum++
      }

      this.spriteView.prerenderUnits();
      console.log("sprites rendered")


      //set camera rotation
      this.camera.rotation = this.camera.initCameraRotation;


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

}
