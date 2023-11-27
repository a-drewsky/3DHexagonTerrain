import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import HexMapViewTableClass from "./HexMapViewTable"
import SpriteObjectViewClass from "./SpriteObjectView"
import TileStackViewClass from './TileStackView'

import { INIT_CAMERA_POSITION } from '../constants/HexMapConstants'

export default class HexMapViewClass {

   constructor(ctx, canvas, hexMapData, userConstants, images, uiInterface) {
      this.ctx = ctx
      this.canvas = canvas
      this.cameraData = hexMapData.cameraData
      this.mapData = hexMapData.mapData
      this.tileData = hexMapData.tileData
      this.unitData = hexMapData.unitData
      this.strucutreData = hexMapData.strucutreData

      this.tableView = new HexMapViewTableClass(hexMapData)
      this.tileView = new TileStackViewClass(hexMapData, canvas)
      this.spriteView = new SpriteObjectViewClass(hexMapData, canvas)

      this.hexmapCanvas = null
      this.hexmapCtx = null

      this.uiInterface = uiInterface

      //Debug Settings
      this.DEBUG = userConstants.DEBUG

      this.images = images

      this.commonUtils = new CommonHexMapUtilsClass()

   }

   draw = () => {

      this.drawTable()

      this.hexmapCtx.clearRect(0, 0, this.hexmapCanvas.width, this.hexmapCanvas.height)

      this.tileView.draw(this.hexmapCtx)

      this.spriteView.draw(this.hexmapCtx)

      if (this.DEBUG) this.hexmapCtx.strokeRect(0, 0, this.hexmapCanvas.width, this.hexmapCanvas.height)

      this.ctx.drawImage(
         this.hexmapCanvas,
         this.cameraData.position.x, this.cameraData.position.y,
         this.canvas.width + this.cameraData.zoom * this.cameraData.zoomAmount, this.canvas.height + this.cameraData.zoom * this.cameraData.zoomAmount * (this.canvas.height / this.canvas.width),
         0, 0, this.canvas.width, this.canvas.height
      )

      if (this.DEBUG) {
         this.ctx.fillStyle = 'black'
         this.ctx.fillRect(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1, 2, 2)
      }
   }

   drawTable = () => {
      if (this.mapData.renderBackground === true) {
         let tempCanvas = this.tableView.render()
         this.uiInterface.setBgCanvasImage(tempCanvas)
         this.mapData.renderBackground = false
      }
   }

   initializeCanvas = () => {

      //Set render canvas size
      let keys = this.tileData.getKeys()

      let mapWidth = Math.max(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r)) - Math.min(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r))
      let mapHeight = Math.max(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish)) - Math.min(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish))
      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight)

      this.hexmapCanvas = document.createElement('canvas')
      this.hexmapCanvas.width = mapHyp / this.mapData.squish
      this.hexmapCanvas.height = mapHyp
      this.hexmapCanvas.style.imageRendering = 'pixelated'
      this.hexmapCtx = this.hexmapCanvas.getContext("2d")

      this.uiInterface.setBgCanvasSize(this.hexmapCanvas.width, this.hexmapCanvas.height)
      this.uiInterface.setBgCanvasZoom(this.hexmapCanvas.width, this.hexmapCanvas.height)

      this.tableView.prerender(this.hexmapCanvas)

      return this.hexmapCanvas
   }

   initializeCamera = () => {

      let keys = this.tileData.getKeys()

      //set cameraData rotation
      this.cameraData.rotation = this.cameraData.initCameraRotation


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
            break
         case 'middle':
            camQ = medQ
            camR = medR
            break
         case 'bottom':
            camQ = medQ - scalar / 2
            camR = medR + scalar
            break
         default:
            break
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
