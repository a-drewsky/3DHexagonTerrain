import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils";
import HexMapViewTableClass from "./HexMapViewTable";

import { INIT_CAMERA_POSITION } from './HexMapConstants'

export default class HexMapViewClass {

   constructor(ctx, canvas, cameraData, hexMapData, tileManager, spriteManager, userConstants, images, uiController) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.cameraData = cameraData;
      this.hexMapData = hexMapData;
      this.tileManager = tileManager
      this.spriteManager = spriteManager

      this.drawCanvas = null;
      this.drawctx = null;

      this.uiController = uiController

      this.tableView = new HexMapViewTableClass(hexMapData, tileManager, cameraData)

      //Debug Settings
      this.DEBUG = userConstants.DEBUG;

      this.images = images;

      this.commonUtils = new CommonHexMapUtilsClass()

   }

   draw = () => {

      this.drawctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.checkAndRenderBackground()

      this.tileManager.view.draw(this.drawctx)

      this.spriteManager.view.draw(this.drawctx)


      if (this.DEBUG) this.drawctx.strokeRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.ctx.drawImage(this.drawCanvas, this.cameraData.position.x, this.cameraData.position.y, this.canvas.width + this.cameraData.zoom * this.cameraData.zoomAmount, this.canvas.height + this.cameraData.zoom * this.cameraData.zoomAmount * (this.canvas.height / this.canvas.width), 0, 0, this.canvas.width, this.canvas.height)

      if (this.DEBUG) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   checkAndRenderBackground = () => {
      if (this.hexMapData.renderBackground == true) {
         let tempCanvas = this.tableView.render()
         this.uiController.setBgCanvasImage(tempCanvas)
         this.hexMapData.renderBackground = false
      }
   }

   initializeCanvas = () => {

      //Set render canvas size
      let keys = this.tileManager.data.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)) - Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)) - Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      this.drawCanvas = document.createElement('canvas')
      this.drawCanvas.width = mapHyp / this.hexMapData.squish;
      this.drawCanvas.height = mapHyp;
      this.drawctx = this.drawCanvas.getContext("2d");

      this.uiController.setBgCanvasSize(this.drawCanvas.width, this.drawCanvas.height)
      this.uiController.setBgCanvasZoom(this.drawCanvas.width, this.drawCanvas.height)

      this.tableView.prerender(this.drawCanvas)

      return this.drawCanvas
   }

   initializeCamera = () => {

      let keys = this.tileManager.data.getKeys();

      //set cameraData rotation
      this.cameraData.rotation = this.cameraData.initCameraRotation;


      //set cameraData position (top, middle or bottom)
      let maxQ = Math.max(...keys.map(key => key.q))
      let minQ = Math.min(...keys.map(key => key.q))
      let medQ = (maxQ + minQ) / 2

      let maxR = Math.max(...keys.map(key => key.r))
      let minR = Math.min(...keys.map(key => key.r))
      let medR = (maxR + minR) / 2

      let scalar = maxR / 4

      let camQ
      let camR

      switch (INIT_CAMERA_POSITION) {
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

      let camPos = this.commonUtils.rotateTile(camQ, camR, this.cameraData.rotation)

      let mappos = this.tileManager.data.posMap.get(this.cameraData.rotation)

      //set the cameraData position
      let vecQ, vecR
      if (this.cameraData.rotation % 2 == 0) {
         vecQ = this.hexMapData.VecQ
         vecR = this.hexMapData.VecR
      } else {
         vecQ = this.hexMapData.flatTopVecQ
         vecR = this.hexMapData.flatTopVecR
      }
      this.cameraData.setPosition(
         mappos.x + (camPos.q * vecQ.x + camPos.r * vecR.x) - this.canvas.width / 2,
         mappos.y + (camPos.q * vecQ.y * this.hexMapData.squish + camPos.r * vecR.y * this.hexMapData.squish) - this.canvas.height / 2
      )
   }

}
