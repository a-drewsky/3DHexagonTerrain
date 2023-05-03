
import { HEXMAP_SIDE_COLOR_MULTIPLIER } from '../commonConstants/CommonConstants'

const TABLE_HEIGHT = 40

const TABLE_COLORS = {
   fill: {h: 150, s: 30, l: 65},
   stroke: {h: 150, s: 30, l: 55}
}

export default class HexMapViewTableClass {

   constructor(hexMapData, tileManager, cameraData) {

      this.hexMapData = hexMapData;
      this.tileManager = tileManager
      this.cameraData = cameraData;
      this.drawCanvas = null

      this.rotationAlpha = {
         0: 1,
         1: 0.9,
         2: 0.8,
         3: 0.7,
         4: 0.6,
         5: 0.5,
         6: 0.4,
         7: 0.5,
         8: 0.6,
         9: 0.7,
         10: 0.8,
         11: 0.9,
      }

   }

   prerender = (drawCanvas) => {
      this.drawCanvas = drawCanvas
   }

   render = () => {

      let tempCanvas = document.createElement('canvas')
      tempCanvas.width = this.drawCanvas.width
      tempCanvas.height = this.drawCanvas.height
      let tempctx = tempCanvas.getContext('2d')

      //get table position
      let tablePosition = this.tileManager.data.getTablePosition(this.cameraData.rotation);

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


      let shadowRotation = this.hexMapData.shadowRotation + this.cameraData.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.cameraData.rotation % 3 == 0) {

         tempTablePosition.shift();
         tempTablePosition.shift();

         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shadowRotation]}%)`



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


         let shiftedShadowRotation = this.hexMapData.shadowRotation + Math.floor(this.cameraData.rotation / 3) * 3;

         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;


         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + TABLE_HEIGHT);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.fill();
         tempctx.stroke();

         shiftedShadowRotation += 3;
         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;

         tempctx.fillStyle = `hsl(${TABLE_COLORS.fill.h}, ${TABLE_COLORS.fill.s}%, ${TABLE_COLORS.fill.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${TABLE_COLORS.stroke.h}, ${TABLE_COLORS.stroke.s}%, ${TABLE_COLORS.stroke.l * HEXMAP_SIDE_COLOR_MULTIPLIER * this.rotationAlpha[shiftedShadowRotation]}%)`

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