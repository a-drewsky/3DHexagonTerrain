import HexMapViewMapClass from "./HexMapViewMap";
import HexMapViewSpritesClass from "./sprites/HexMapViewSprites";
import HexMapViewSelectionClass from "./HexMapViewHighlights";
import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils";

export default class HexMapViewClass {

   constructor(ctx, canvas, camera, hexMapData, spriteManager, settings, images, renderer, uiController) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.camera = camera;
      this.hexMapData = hexMapData;
      this.spriteManager = spriteManager

      this.drawCanvas = null;
      this.drawctx = null;

      this.renderer = renderer
      this.uiController = uiController

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

      this.mapView = new HexMapViewMapClass(hexMapData, spriteManager, camera, this.images, canvas);
      this.spriteView = new HexMapViewSpritesClass(hexMapData, spriteManager, camera, images, canvas, settings);
      this.selectionView = new HexMapViewSelectionClass(hexMapData, spriteManager, camera, settings, images);
      this.commonUtils = new HexMapCommonUtilsClass()

   }

   draw = () => {

      this.drawctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      if (this.hexMapData.renderBackground == true) {
         let tempCanvas = this.renderer.tableRenderer.render()
         this.uiController.setBgCanvasImage(tempCanvas)
         this.hexMapData.renderBackground = false
      }

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

   initializeCanvas = () => {

      //Set render canvas size
      let keys = this.spriteManager.tiles.data.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)) - Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)) - Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      let renderCanvasDims = {
         width: mapHyp / this.hexMapData.squish,
         height: mapHyp
      }

      this.drawCanvas = document.createElement('canvas')
      this.drawCanvas.width = renderCanvasDims.width;
      this.drawCanvas.height = renderCanvasDims.height;
      this.drawctx = this.drawCanvas.getContext("2d");

      this.uiController.setBgCanvasSize(renderCanvasDims.width, renderCanvasDims.height)
      this.uiController.setBgCanvasZoom(renderCanvasDims.width, renderCanvasDims.height)
   }

   initializeCamera = () => {

      let keys = this.spriteManager.tiles.data.getKeys();

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

      let camPos = this.commonUtils.rotateTile(camQ, camR, this.camera.rotation)

      let mappos = this.spriteManager.tiles.data.posMap.get(this.camera.rotation)

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
