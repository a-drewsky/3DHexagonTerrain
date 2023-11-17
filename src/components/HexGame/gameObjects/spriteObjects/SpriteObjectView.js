import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import ModifierViewClass from "./structures/modifier/ModifierView"
import StructureViewClass from "./structures/StructureView"
import UnitViewClass from "./unit/UnitView"
import ProjectileViewClass from "./projectile/ProjectileView"

export default class SpriteObjectViewClass {

   constructor(hexMapData, canvas) {

      this.unitData = hexMapData.unitData
      this.structureData = hexMapData.structureData
      this.projectileData = hexMapData.projectileData
      this.cameraData = hexMapData.cameraData

      this.commonUtils = new CommonHexMapUtilsClass()

      this.canvas = canvas

      this.structures = new StructureViewClass(hexMapData)
      this.modifiers = new ModifierViewClass(hexMapData)
      this.units = new UnitViewClass(hexMapData)
      this.projectiles = new ProjectileViewClass(hexMapData)
   }

   buildSpriteList = () => {

      let spriteList = []
      //terrain objects
      for (let [key, value] of this.structureData.getStructureMap()) {

         //modifier top or bottom
         if (value.type === 'modifier') {

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position, this.cameraData.rotation),
               layer: 1,
               silhouette: false
            })

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position, this.cameraData.rotation),
               layer: -1,
               silhouette: false
            })

         } else {

            spriteList.push({
               spriteObject: value,
               rotatedTile: this.commonUtils.rotateTile(value.position, this.cameraData.rotation),
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
            rotatedTile: this.commonUtils.rotateTile(unitObject.position, this.cameraData.rotation),
            layer: 0,
            silhouette: false
         })

         if (unitObject.destination !== null) {
            this.setUnitPosition(spriteList[spriteList.length - 1])
            this.setUnitLayer(spriteList[spriteList.length - 1])
         }
      }
      if (this.unitData.placementUnit) {
         let unitObject = this.unitData.placementUnit
         spriteList.push({
            spriteObject: unitObject,
            rotatedTile: this.commonUtils.rotateTile(unitObject.position, this.cameraData.rotation),
            layer: 0,
            silhouette: true
         })
      }

      //projectiles
      for (let i = 0; i < this.projectileData.projectileList.length; i++) {
         let projectileObject = this.projectileData.projectileList[i]

         spriteList.push({
            spriteObject: projectileObject,
            rotatedTile: this.commonUtils.rotateTile(projectileObject.position, this.cameraData.rotation),
            layer: 0,
            silhouette: false
         })
      }

      //sort terrain object list
      spriteList.sort((a, b) => { return a.rotatedTile.r - b.rotatedTile.r || a.rotatedTile.q - b.rotatedTile.q || a.layer - b.layer })

      return spriteList
   }

   setUnitPosition = (spriteListEntry) => {

      let unit = spriteListEntry.spriteObject
      let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.tileTravelTime

      let spriteRotation = unit.spriteRotation(this.cameraData.rotation)

      if (percent >= 0.5) {
         switch (spriteRotation) {
            case 0:
               spriteListEntry.rotatedTile.r -= 1
               spriteListEntry.rotatedTile.q += 1
               return
            case 1:
               spriteListEntry.rotatedTile.q += 1
               return
            case 2:
               spriteListEntry.rotatedTile.r += 1
               return
            case 3:
               spriteListEntry.rotatedTile.q -= 1
               spriteListEntry.rotatedTile.r += 1
               return
            case 4:
               spriteListEntry.rotatedTile.q -= 1
               return
            case 5:
               spriteListEntry.rotatedTile.r -= 1
               return
            default:
               return
         }
      }

   }

   setUnitLayer = (spriteListEntry) => {

      let unit = spriteListEntry.spriteObject
      let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.tileTravelTime
      let rotationMap = {
         0: 'up',
         1: 'down',
         2: 'down',
         3: 'down',
         4: 'up',
         5: 'up',
      }

      let spriteRotation = unit.spriteRotation(this.cameraData.rotation)
      let direction = rotationMap[spriteRotation]

      if ((percent > 0.3 && percent < 0.5 && direction === 'up') || (percent < 0.7 && percent >= 0.5 && direction === 'down')) spriteListEntry.layer = -2
      if ((percent > 0.3 && percent < 0.5 && direction === 'down') || (percent < 0.7 && percent >= 0.5 && direction === 'up')) spriteListEntry.layer = 2

   }

   draw = (hexmapCtx) => {

      let spriteList = this.buildSpriteList()

      this.drawShadows(hexmapCtx, spriteList)
      this.drawSprites(hexmapCtx, spriteList)

   }

   drawShadows = (hexmapCtx, spriteList) => {
      for (let i in spriteList) {
         
         if (spriteList[i].layer === -1) continue
         if (spriteList[i].silhouette) continue

         let spriteObject = spriteList[i].spriteObject

         switch (spriteObject.type) {
            case 'unit':
               this.units.drawShadow(hexmapCtx, spriteObject)
               continue
            case 'projectile':
               this.projectiles.drawShadow(hexmapCtx, spriteObject)
               continue
            case 'bunker':
            case 'prop':
            case 'resource':
            case 'flag':
               this.structures.drawShadow(hexmapCtx, spriteObject)
               continue
            case 'modifier':
               this.modifiers.drawShadow(hexmapCtx, spriteObject)
               continue
            default:
               continue
         }

      }
   }

   drawSprites = (hexmapCtx, spriteList) => {
      for (let i in spriteList) {

         let spriteObject = spriteList[i].spriteObject

         switch (spriteObject.type) {
            case 'bunker':
            case 'prop':
            case 'resource':
            case 'flag':
               this.structures.draw(hexmapCtx, spriteObject)
               continue
            case 'modifier':
               if (spriteList[i].layer === -1) this.modifiers.drawTop(hexmapCtx, spriteObject)
               if (spriteList[i].layer === 1) this.modifiers.drawBottom(hexmapCtx, spriteObject)
               continue
            case 'unit':
               if (spriteList[i].silhouette) this.units.drawSilhouette(hexmapCtx, spriteObject)
               else this.units.draw(hexmapCtx, spriteObject)
               continue
            case 'projectile':
               this.projectiles.drawSprite(hexmapCtx, spriteObject)
               continue
            default:
               continue
         }

      }
   }

}