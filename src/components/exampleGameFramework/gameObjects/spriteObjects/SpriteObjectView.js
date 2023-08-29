import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import ModifierViewClass from "./structures/ModifierView"
import StructureViewClass from "./structures/StructureView"
import UnitViewClass from "./unit/UnitView"

export default class SpriteObjectViewClass {

   constructor(hexMapData, images, canvas) {

      this.unitData = hexMapData.unitData
      this.structureData = hexMapData.structureData
      this.cameraData = hexMapData.cameraData

      this.commonUtils = new CommonHexMapUtilsClass()

      this.canvas = canvas

      this.modifiers = new ModifierViewClass(hexMapData, images, canvas)
      this.structures = new StructureViewClass(hexMapData, images, canvas)
      this.units = new UnitViewClass(hexMapData, images, canvas)

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
               layer: 1,
               silhouette: false
            })

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation),
               layer: -1,
               silhouette: false
            })

         } else {

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position.q, value.position.r, this.cameraData.rotation),
               layer: 0,
               silhouette: false
            })

         }

      }

      //units
      for (let i = 0; i < this.unitData.unitList.length; i++) {
         let unitObject = this.unitData.unitList[i]

         spriteList.push({
            spriteObject: unitObject,
            rotatedTile: this.commonUtils.rotateTile(unitObject.position.q, unitObject.position.r, this.cameraData.rotation),
            layer: 0,
            silhouette: false
         })

         if (unitObject.destination != null) {
            this.setUnitPosition(spriteList[spriteList.length - 1])
            this.setUnitLayer(spriteList[spriteList.length - 1])
         }
      }
      if (this.unitData.placementUnit) {
         let unitObject = this.unitData.placementUnit
         spriteList.push({
            spriteObject: unitObject,
            rotatedTile: this.commonUtils.rotateTile(unitObject.position.q, unitObject.position.r, this.cameraData.rotation),
            layer: 0,
            silhouette: true
         })
      }

      //sort terrain object list
      spriteList.sort((a, b) => { return a.rotatedTile.r - b.rotatedTile.r || a.rotatedTile.q - b.rotatedTile.q || a.layer - b.layer })

      return spriteList
   }

   setUnitPosition = (spriteListEntry) => {

      let unit = spriteListEntry.spriteObject
      let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.travelTime

      let spriteRotation = unit.rotation + this.cameraData.rotation
      if (this.cameraData.rotation % 2 == 1) spriteRotation--
      if (spriteRotation > 11) spriteRotation -= 12

      if (percent >= 0.5) {
         switch (spriteRotation) {
            case 1:
               spriteListEntry.rotatedTile.r -= 1
               spriteListEntry.rotatedTile.q += 1
               return
            case 3:
               spriteListEntry.rotatedTile.q += 1
               return
            case 5:
               spriteListEntry.rotatedTile.r += 1
               return
            case 7:
               spriteListEntry.rotatedTile.q -= 1
               spriteListEntry.rotatedTile.r += 1
               return
            case 9:
               spriteListEntry.rotatedTile.q -= 1
               return
            case 11:
               spriteListEntry.rotatedTile.r -= 1
               return
         }
      }

   }

   setUnitLayer = (spriteListEntry) => {

      let unit = spriteListEntry.spriteObject
      let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.travelTime
      let rotationMap = {
         1: 'up',
         3: 'down',
         5: 'down',
         7: 'down',
         9: 'up',
         11: 'up',
      }

      let spriteRotation = unit.rotation + this.cameraData.rotation
      if (this.cameraData.rotation % 2 == 1) spriteRotation--
      if (spriteRotation > 11) spriteRotation -= 12
      let direction = rotationMap[spriteRotation]

      if (percent > 0.3 && percent < 0.5 && direction == 'up' || percent < 0.7 && percent >= 0.5 && direction == 'down') spriteListEntry.layer = -2
      if (percent > 0.3 && percent < 0.5 && direction == 'down' || percent < 0.7 && percent >= 0.5 && direction == 'up') spriteListEntry.layer = 2

   }

   draw = (drawctx) => {

      let spriteList = this.buildSpriteList()

      this.drawShadows(drawctx, spriteList)
      this.drawSprites(drawctx, spriteList)

   }

   drawShadows = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {
         if (spriteList[i].layer == -1) continue
         if (spriteList[i].silhouette) continue

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
               if (spriteList[i].layer == -1) this.modifiers.drawTop(drawctx, spriteObject)
               if (spriteList[i].layer == 1) this.modifiers.drawBottom(drawctx, spriteObject)
               continue
            case 'unit':
               if (spriteList[i].silhouette) this.units.drawSilhouette(drawctx, spriteObject)
               else this.units.draw(drawctx, spriteObject)
               continue
         }

      }
   }

}