export default class HexMapRendererTableClass {

   constructor(hexMapData, tileManager, camera, settings) {

      this.hexMapData = hexMapData;
      this.tileManager = tileManager
      this.camera = camera;
      this.drawCanvas = null

      this.tableColors = settings.TEMP_TABLE_COLORS;
      this.sideColorMultiplier = settings.HEXMAP_SIDE_COLOR_MULTIPLIER
      this.tableHeight = settings.TABLE_HEIGHT

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
      let tablePosition = this.tileManager.data.getTablePosition(this.camera.rotation);

      tempctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l}%)`
      tempctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l}%)`
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


      let shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.camera.rotation % 3 == 0) {

         tempTablePosition.shift();
         tempTablePosition.shift();

         tempctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.rotationAlpha[shadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.rotationAlpha[shadowRotation]}%)`



         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.fill();
         tempctx.stroke();

      } else {

         tempTablePosition.shift();

         tempTablePosition.sort((a, b) => a.x - b.x)


         let shiftedShadowRotation = this.hexMapData.shadowRotation + Math.floor(this.camera.rotation / 3) * 3;

         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;


         tempctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.rotationAlpha[shiftedShadowRotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         tempctx.fill();
         tempctx.stroke();

         shiftedShadowRotation += 3;
         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;

         tempctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.rotationAlpha[shiftedShadowRotation]}%)`
         tempctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.rotationAlpha[shiftedShadowRotation]}%)`

         tempctx.beginPath();
         tempctx.moveTo(tempTablePosition[2].x, tempTablePosition[2].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         tempctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y + this.tableHeight);
         tempctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y);
         tempctx.fill();
         tempctx.stroke();

      }

      return tempCanvas

   }

}