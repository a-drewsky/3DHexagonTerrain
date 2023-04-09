import HexMapViewSpritesModifiersClass from "./HexMapViewSpritesModifiers"
import HexMapViewSpritesStructuresClass from "./HexMapViewSpritesStructures"
import HexMapViewSpritesUnitsClass from "./HexMapViewSpritesUnits"
import HexMapCommonUtilsClass from "../../../commonUtils/HexMapCommonUtils"
import HexMapViewUtilsClass from "../../utils/HexMapViewUtils"

export default class HexMapViewSpritesClass {

   constructor(hexMapData, spriteManager, camera, images, canvas, settings) {

      this.hexMapData = hexMapData
      this.spriteManager = spriteManager
      this.camera = camera
      this.images = images
      this.commonUtils = new HexMapCommonUtilsClass()
      this.viewUtils = new HexMapViewUtilsClass(camera)

      this.shadowSize = settings.SHADOW_SIZE

      this.travelTime = settings.TRAVEL_TIME
      this.jumpAmount = settings.JUMP_AMOUNT

      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
      }

      this.modifiers = new HexMapViewSpritesModifiersClass(hexMapData, spriteManager, camera, images, this.canvasDims)
      this.structures = new HexMapViewSpritesStructuresClass(hexMapData, spriteManager, camera, images, this.canvasDims)
      this.units = new HexMapViewSpritesUnitsClass(hexMapData, spriteManager, camera, settings, images, this.canvasDims, this.travelTime, this.jumpAmount)

   }

   draw = (drawctx) => {

      let spriteList = []

      //terrain objects
      for (let [key, value] of this.spriteManager.structures.data.getStructureMap()){
         let keyObj = this.commonUtils.rotateTile(value.position.q, value.position.r, this.camera.rotation)
         let height = this.spriteManager.tiles.data.getEntry(value.position.q, value.position.r).height

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
      for (let i = 0; i < this.spriteManager.units.data.unitList.length; i++) {
         let unitObject = this.spriteManager.units.data.unitList[i]
         if (unitObject == null) continue

         let keyObj
         let height

         if (unitObject.destination != null && (unitObject.destinationCurTime - unitObject.destinationStartTime) / this.travelTime > 0.5) {
            keyObj = this.commonUtils.rotateTile(unitObject.destination.q, unitObject.destination.r, this.camera.rotation)
         } else {
            keyObj = this.commonUtils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)
         }

         height = this.spriteManager.tiles.data.getEntry(unitObject.position.q, unitObject.position.r).height
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
         let spriteObject = this.spriteManager.structures.data.getStructure(spriteList[i].id.q, spriteList[i].id.r)

         if (!spriteObject.shadowImages || spriteObject.shadowImages.length == 0) continue

         let keyObj = {
            q: spriteList[i].q,
            r: spriteList[i].r
         }
         let sprite = spriteObject.imageObject


         let shadowSize

         let shadowPos = this.spriteManager.tiles.data.hexPositionToXYPosition(keyObj, spriteList[i].height, this.camera.rotation)

         if (spriteObject.type == 'modifier') {
            shadowSize = {
               width: this.hexMapData.size * 2 * sprite.shadowSize.width,
               height: this.hexMapData.size * 2 * sprite.shadowSize.height
            }

            shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
            shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2
         } else {
            shadowSize = {
               width: this.hexMapData.size * 2 * sprite.shadowSize.width,
               height: this.hexMapData.size * 2 * sprite.shadowSize.height
            }

            shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
            shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2
         }

         if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) continue

         drawctx.drawImage(
            spriteObject.shadowImages[0][this.camera.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
         )

      }
   }

}