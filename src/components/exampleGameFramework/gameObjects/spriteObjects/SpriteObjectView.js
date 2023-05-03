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

   draw = (drawctx) => {

      let spriteList = []

      //terrain objects
      for (let [key, value] of this.structureData.getStructureMap()) {
         let keyObj = this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation)
         let height = this.tileData.getEntry(value.position.q, value.position.r).height

         //modifier top or bottom
         if (value.type == 'modifier') {

            spriteList.push({
               id: value.position,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: value.type,
               modifierPos: 'top'
            })

            spriteList.push({
               id: value.position,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: value.type,
               modifierPos: 'bottom'
            })

         } else {

            spriteList.push({
               id: value.position,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: value.type,
               modifierPos: null
            })

         }

      }

      //units
      for (let i = 0; i < this.unitData.unitList.length; i++) {
         let unitObject = this.unitData.unitList[i]
         if (unitObject == null) continue

         let keyObj
         let height

         if (unitObject.destination != null && (unitObject.destinationCurTime - unitObject.destinationStartTime) / unitObject.travelTime > 0.5) {
            keyObj = this.commonUtils.rotateTile(unitObject.destination.q, unitObject.destination.r, this.cameraData.rotation)
         } else {
            keyObj = this.commonUtils.rotateTile(unitObject.position.q, unitObject.position.r, this.cameraData.rotation)
         }

         height = this.tileData.getEntry(unitObject.position.q, unitObject.position.r).height
         spriteList.push({
            id: i,
            q: keyObj.q,
            r: keyObj.r,
            height: height,
            type: unitObject.type,
            modifierPos: 'unit'
         })
      }

      let modifierPosList = ['top', 'unit', 'bottom']

      //sort terrain object list
      spriteList.sort((a, b) => { return a.r - b.r || a.q - b.q || modifierPosList.indexOf(a.modifierPos) - modifierPosList.indexOf(b.modifierPos) })

      this.drawShadows(drawctx, spriteList)
      this.drawSprites(drawctx, spriteList)

   }

   drawSprites = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {
         switch (spriteList[i].type) {
            case 'bunker':
            case 'prop':
            case 'resource':
            case 'flag':
               this.structures.draw(drawctx, spriteList[i])
               break
            case 'modifier':
               if (spriteList[i].modifierPos == 'top') this.modifiers.drawTop(drawctx, spriteList[i])
               if (spriteList[i].modifierPos == 'bottom') this.modifiers.drawBottom(drawctx, spriteList[i])
               break
            case 'unit':
               this.units.draw(drawctx, spriteList[i])
               break
         }

      }
   }

   drawShadows = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {
         if (spriteList[i].modifierPos == 'bottom') continue

         if (spriteList[i].type == 'unit') {
            this.units.drawShadow(drawctx, spriteList[i])
            continue
         }
         let spriteObject = this.structureData.getStructure(spriteList[i].id.q, spriteList[i].id.r)

         if (!spriteObject.shadowImages || spriteObject.shadowImages.length == 0) continue

         let keyObj = {
            q: spriteList[i].q,
            r: spriteList[i].r
         }
         let sprite = spriteObject.imageObject


         let shadowSize

         let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, spriteList[i].height, this.cameraData.rotation)

         shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
         }

         shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
         shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


         if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) continue

         drawctx.drawImage(
            spriteObject.shadowImages[0][this.cameraData.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
         )

      }
   }

}