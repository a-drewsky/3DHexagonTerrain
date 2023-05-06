import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import ModifierViewClass from "./structures/ModifierView"
import StructureViewClass from "./structures/StructureView"
import UnitViewClass from "./unit/UnitView"

export default class SpriteObjectViewClass {

   constructor(hexMapData, tileData, unitData, structureData, cameraData, images, canvas) {

      this.hexMapData = hexMapData
      this.tileData = tileData
      this.unitData = unitData
      this.structureData = structureData
      this.cameraData = cameraData
      this.images = images
      this.commonUtils = new CommonHexMapUtilsClass()

      this.canvas = canvas

      this.modifiers = new ModifierViewClass(hexMapData, tileData, structureData, cameraData, images, canvas)
      this.structures = new StructureViewClass(hexMapData, tileData, structureData, cameraData, images, canvas)
      this.units = new UnitViewClass(hexMapData, tileData, unitData, cameraData, images, canvas)

   }

   buildSpriteList = () => {

      let spriteList = []
      //terrain objects
      for (let [key, value] of this.structureData.getStructureMap()) {

         //modifier top or bottom
         if (value.type == 'modifier') {

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation),
               layer: 1
            })

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation),
               layer: -1
            })

         } else {

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation),
               layer: 0
            })

         }

      }

      //units
      for (let i = 0; i < this.unitData.unitList.length; i++) {
         let unitObject = this.unitData.unitList[i]

         spriteList.push({
            spriteObject: unitObject,
            rotatedTile: this.commonUtils.rotateTile(unitObject.position.q, unitObject.position.r, this.cameraData.rotation),
            layer: 0
         })
      }

      

      //sort terrain object list
      spriteList.sort((a, b) => { return a.rotatedTile.r - b.rotatedTile.r || a.rotatedTile.q - b.rotatedTile.q || a.layer - b.layer })

      return spriteList
   }

   draw = (drawctx) => {

      let spriteList = this.buildSpriteList()

      this.drawShadows(drawctx, spriteList)
      this.drawSprites(drawctx, spriteList)

   }

   drawShadows = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {
         if (spriteList[i].layer == -1) continue

         let spriteObject = spriteList[i].spriteObject

         switch (spriteObject.type) {
            case 'unit':
               this.units.drawShadow(drawctx, spriteObject)
               continue
            case 'bunker':
            case 'prop':
            case 'resource':
            case 'flag':
            case 'modifier':
            case 'unit':
               this.structures.drawShadow(drawctx, spriteObject)
               continue
         }

      }
   }

   drawSprites = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {

         let spriteObject = spriteList[i].spriteObject

         switch (spriteObject.type) {
            case 'bunker':
            case 'prop':
            case 'resource':
            case 'flag':
               this.structures.draw(drawctx, spriteObject)
               continue
            case 'modifier':
               if (spriteList[i].layer == 1) this.modifiers.drawTop(drawctx, spriteObject)
               if (spriteList[i].layer == -1) this.modifiers.drawBottom(drawctx, spriteObject)
               continue
            case 'unit':
               this.units.draw(drawctx, spriteObject)
               continue
         }

      }
   }

}