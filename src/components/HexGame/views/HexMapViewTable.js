
import { TABLE_SIDE_COLOR_MULTIPLIER } from '../constants/HexMapConstants'

const TABLE_HEIGHT = 40

const TABLE_COLORS = {
   fill: {h: 150, s: 30, l: 65},
   stroke: {h: 150, s: 30, l: 55}
}

export default class HexMapViewTableClass {

   constructor(gameData) {

      this.mapData = gameData.mapData
      this.tileData = gameData.tileData
      this.cameraData = gameData.cameraData
      
      this.hexmapCanvas = null

      this.rotationAlpha = {
         0: 0.5,
         1: 0.5,
         2: 0.5,
         3: 0.5,
         4: 0.5,
         5: 0.5,
      }

   }

   prerender = (hexmapCanvas) => {
      this.hexmapCanvas = hexmapCanvas
   }

   render = () => {

      let tempCanvas = document.createElement('canvas')
      tempCanvas.width = this.hexmapCanvas.width
      tempCanvas.height = this.hexmapCanvas.height
      let tempctx = tempCanvas.getContext('2d')

      //get table position
      let tablePosition = this.tileData.getTablePosition(this.cameraData.rotation);

      tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l}%)`
      tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l}%)`
      tempctx.beginPath();
      tempctx.moveTo(tablePosition[0].x, tablePosition[0].y);
      tempctx.lineTo(tablePosition[1].x, tablePosition[1].y);
      tempctx.lineTo(tablePosition[2].x, tablePosition[2].y);
      tempctx.lineTo(tablePosition[3].x, tablePosition[3].y);
      tempctx.lineTo(tablePosition[0].x, tablePosition[0].y);
      tempctx.fill();
      tempctx.stroke();

      //draw table sides

      let tempTablePosition = [...tablePosition].sort((a, b) => a.y - b.y)



      if (this.cameraData.rotation === 1 || this.cameraData.rotation === 4) {

         tempTablePosition.shift();
         tempTablePosition.shift();

         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[this.cameraData.rotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[this.cameraData.rotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.fill();
         tempctx.stroke();

      } else {

         tempTablePosition.shift();

         tempTablePosition.sort((a, b) => a.x - b.x)


         let shiftedShadowRotation = Math.floor(this.cameraData.rotation);

         if (shiftedShadowRotation >= 6) shiftedShadowRotation -= 6;


         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.fill();
         tempctx.stroke();

         shiftedShadowRotation += 2;
         if (shiftedShadowRotation >= 6) shiftedShadowRotation -= 6

         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * TABLE_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[2].x, tempTablePosition[2].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y);
         tempctx.fill();
         tempctx.stroke();

      }

      return tempCanvas

   }

}