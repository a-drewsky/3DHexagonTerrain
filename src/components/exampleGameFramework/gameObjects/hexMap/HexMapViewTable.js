import HexMapViewUtilsClass from "./HexMapViewUtils";

export default class HexMapViewTableClass {

   constructor(hexMapData, camera, tableColors, sideColorMultiplier, tableHeight, shadowRotationDims, utils) {

      this.hexMapData = hexMapData;
      this.camera = camera;

      this.tableColors = tableColors;
      this.sideColorMultiplier = sideColorMultiplier
      this.tableHeight = tableHeight
      this.shadowRotationDims = shadowRotationDims

      this.utils = utils

   }

   draw = (drawctx) => {


      //get table position
      let tablePosition = this.utils.getTablePosition();

      drawctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l}%)`
      drawctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l}%)`
      drawctx.beginPath();
      drawctx.moveTo(tablePosition[0].x, tablePosition[0].y);
      drawctx.lineTo(tablePosition[1].x, tablePosition[1].y);
      drawctx.lineTo(tablePosition[2].x, tablePosition[2].y);
      drawctx.lineTo(tablePosition[3].x, tablePosition[3].y);
      drawctx.lineTo(tablePosition[0].x, tablePosition[0].y);
      drawctx.fill();
      drawctx.stroke();

      //draw table sides

      let tempTablePosition = [...tablePosition].sort((a, b) => a.y - b.y)


      let shadowRotation = this.hexMapData.rotation + this.camera.rotation;

      if (shadowRotation > 11) shadowRotation -= 12;



      if (this.camera.rotation % 3 == 0) {

         tempTablePosition.shift();
         tempTablePosition.shift();

         console.log("shadow rotation: " + this.hexMapData.rotation, this.camera.rotation)

         drawctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`
         drawctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].wallBot}%)`



         drawctx.beginPath();
         drawctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         drawctx.fill();
         drawctx.stroke();

      } else {

         tempTablePosition.shift();

         tempTablePosition.sort((a, b) => a.x - b.x)


         let shiftedShadowRotation = this.hexMapData.rotation + Math.floor(this.camera.rotation / 3) * 3;

         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;


         drawctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         drawctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         drawctx.beginPath();
         drawctx.moveTo(tempTablePosition[0].x, tempTablePosition[0].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[0].x, tempTablePosition[0].y);
         drawctx.fill();
         drawctx.stroke();

         shiftedShadowRotation += 3;
         if (shiftedShadowRotation > 11) shiftedShadowRotation -= 12;

         drawctx.fillStyle = `hsl(${this.tableColors.fill.h}, ${this.tableColors.fill.s}%, ${this.tableColors.fill.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`
         drawctx.strokeStyle = `hsl(${this.tableColors.stroke.h}, ${this.tableColors.stroke.s}%, ${this.tableColors.stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shiftedShadowRotation].wallBot}%)`

         drawctx.beginPath();
         drawctx.moveTo(tempTablePosition[2].x, tempTablePosition[2].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y);
         drawctx.lineTo(tempTablePosition[1].x, tempTablePosition[1].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y + this.tableHeight);
         drawctx.lineTo(tempTablePosition[2].x, tempTablePosition[2].y);
         drawctx.fill();
         drawctx.stroke();

      }

   }

}