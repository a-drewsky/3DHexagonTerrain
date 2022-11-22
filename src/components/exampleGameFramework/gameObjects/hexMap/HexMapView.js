import HexMapViewMapClass from "./HexMapViewMap";
import HexMapViewSpritesClass from "./HexMapViewSprites";
import HexMapViewUtilsClass from "./HexMapViewUtils";
import HexMapViewTableClass from "./HexMapViewTable";

export default class HexMapViewClass {

   constructor(ctx, canvas, camera, hexMapData, lineWidth, shadowSize, tableHeight, initCameraPosition, colors, sideColorMultiplier, elevationRanges, treeSpriteChance, treeSpriteChanceIncrement, debug, geometricTilesDebug, images) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.camera = camera;
      this.hexMapData = hexMapData;

      this.drawCanvas = null;
      this.drawctx = null;

      //Settings
      this.lineWidth = lineWidth;
      this.tableHeight = tableHeight;
      this.initCameraPosition = initCameraPosition;
      this.colors = colors;
      this.sideColorMultiplier = sideColorMultiplier;
      this.elevationRanges = elevationRanges;

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

      //take out unneccessary this.
      this.utils = new HexMapViewUtilsClass(this.hexMapData, this.camera);
      this.tableView = new HexMapViewTableClass(this.hexMapData, this.camera, this.colors.table, this.sideColorMultiplier, this.tableHeight, this.shadowRotationDims, this.utils);
      this.mapView = new HexMapViewMapClass(this.hexMapData, this.camera, this.lineWidth, this.colors, this.sideColorMultiplier, this.elevationRanges, this.geometricTilesDebug, this.shadowRotationDims, this.images, this.utils, this.canvas);
      this.spriteView = new HexMapViewSpritesClass(this.hexMapData, this.camera, this.images, this.utils, this.canvas, shadowSize, treeSpriteChance, treeSpriteChanceIncrement);

   }

   draw = () => {

      this.drawctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.tableView.draw(this.drawctx)

      this.mapView.draw(this.drawctx)


      //draw highlight for selected tile
      let rotatedMap = this.utils.rotateMap()
      for (let [key, value] of rotatedMap) {
         if (value.selected) {
            let keyObj = this.hexMapData.split(key);

            let tilePos = this.utils.hexPositionToXYPosition(keyObj, value.height)

            this.drawctx.fillStyle = 'black'
            this.drawctx.fillRect(tilePos.x - 10, tilePos.y - 10, 20, 20)
            console.log("TEST")

         }
      }


      this.spriteView.draw(this.drawctx)


      if (this.debug) this.drawctx.strokeRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)
      this.ctx.drawImage(this.drawCanvas, this.camera.position.x, this.camera.position.y, this.canvas.width + this.camera.zoom * this.camera.zoomAmount, this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width), 0, 0, this.canvas.width, this.canvas.height)

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

      //render trees
      this.spriteView.prerender();


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
