import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import HexMapViewTableClass from "./HexMapViewTable"
import SpriteObjectViewClass from "../spriteObjects/SpriteObjectView"
import TileStackViewClass from '../tileStack/TileStackView'

import { INIT_CAMERA_POSITION } from './HexMapConstants'

export default class HexMapViewClass {

   constructor(ctx, canvas, hexMapData, userConstants, images, uiController) {
      this.ctx = ctx
      this.canvas = canvas
      this.cameraData = hexMapData.cameraData
      this.mapData = hexMapData.mapData
      this.tileData = hexMapData.tileData
      this.unitData = hexMapData.unitData
      this.strucutreData = hexMapData.strucutreData

      this.tileView = new TileStackViewClass(hexMapData, canvas)
      this.spriteView = new SpriteObjectViewClass(hexMapData, canvas)

      this.drawCanvas = null
      this.drawctx = null

      this.uiController = uiController

      this.tableView = new HexMapViewTableClass(hexMapData)

      //Debug Settings
      this.DEBUG = userConstants.DEBUG

      this.images = images

      this.commonUtils = new CommonHexMapUtilsClass()

   }

   draw = () => {

      this.drawctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.checkAndRenderBackground()

      this.tileView.draw(this.drawctx)

      this.spriteView.draw(this.drawctx)


      if (this.DEBUG) this.drawctx.strokeRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

      this.ctx.drawImage(this.drawCanvas, this.cameraData.position.x, this.cameraData.position.y, this.canvas.width + this.cameraData.zoom * this.cameraData.zoomAmount, this.canvas.height + this.cameraData.zoom * this.cameraData.zoomAmount * (this.canvas.height / this.canvas.width), 0, 0, this.canvas.width, this.canvas.height)

      if (this.DEBUG) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   checkAndRenderBackground = () => {
      if (this.mapData.renderBackground == true) {
         let tempCanvas = this.tableView.render()
         this.uiController.setBgCanvasImage(tempCanvas)
         this.mapData.renderBackground = false
      }
   }

   initializeCanvas = () => {

      //Set render canvas size
      let keys = this.tileData.getKeys();

      let mapWidth = Math.max(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r)) - Math.min(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r));
      let mapHeight = Math.max(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish)) - Math.min(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish));
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);

      this.drawCanvas = document.createElement('canvas')
      this.drawCanvas.width = mapHyp / this.mapData.squish
      this.drawCanvas.height = mapHyp;
      this.drawCanvas.style.imageRendering = 'pixelated'
      this.drawctx = this.drawCanvas.getContext("2d")

      this.uiController.setBgCanvasSize(this.drawCanvas.width, this.drawCanvas.height)
      this.uiController.setBgCanvasZoom(this.drawCanvas.width, this.drawCanvas.height)

      this.tableView.prerender(this.drawCanvas)

      return this.drawCanvas
   }

   initializeCamera = () => {

      let keys = this.tileData.getKeys();

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

      let camPos = this.commonUtils.rotateTile({ q: camQ, r: camR }, this.cameraData.rotation)

      let mappos = this.tileData.posMap.get(this.cameraData.rotation)

      //set the cameraData position
      let vecQ, vecR
      vecQ = this.mapData.vecQ
      vecR = this.mapData.vecR
      
      this.cameraData.setPosition(
         mappos.x + (camPos.q * vecQ.x + camPos.r * vecR.x) - this.canvas.width / 2,
         mappos.y + (camPos.q * vecQ.y * this.mapData.squish + camPos.r * vecR.y * this.mapData.squish) - this.canvas.height / 2
      )
   }

}
