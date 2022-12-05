import HexMapViewSpritesRendererClass from "./HexMapViewSpritesRenderer"

export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas, settings) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.shadowSize = settings.SHADOW_SIZE
      this.treeSpriteChance = settings.MODIFIER_SECOND_SPRITE_CHANCE
      this.treeSpriteChanceIncrement = settings.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT

      this.renderer = new HexMapViewSpritesRendererClass(hexMapData, camera, images, utils, settings);

      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
      }

   }

   draw = (drawctx) => {

      let spriteList = []

      //rotate terrain objects
      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {
         let terrainObject = this.hexMapData.terrainList[i]
         if (terrainObject == null) continue

         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         let height = this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height

         spriteList.push({
            id: i,
            q: keyObj.q,
            r: keyObj.r,
            height: height,
            type: terrainObject.type
         })
      }

      for (let i = 0; i < this.hexMapData.unitList.length; i++) {
         let unitObject = this.hexMapData.unitList[i]
         if (unitObject == null) continue

         let keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)

         let height = this.hexMapData.getEntry(unitObject.position.q, unitObject.position.r).height

         spriteList.push({
            id: i,
            q: keyObj.q,
            r: keyObj.r,
            height: height,
            type: unitObject.type
         })
      }

      //sort terrain object list
      spriteList.sort((a, b) => { return a.r - b.r || a.q - b.q })

      this.drawShadows(drawctx, spriteList)
      this.drawSprites(drawctx, spriteList)

   }

   drawSprites = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {
         switch (spriteList[i].type) {
            case 'structures':
               this.drawStructure(drawctx, spriteList[i])
               break
            case 'modifiers':
               this.drawModifier(drawctx, spriteList[i])
               break
            case 'units':
               this.drawUnit(drawctx, spriteList[i])
               break
         }
         
      }
   }

   drawShadows = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {

         let spriteObject

         if (spriteList[i].type == 'unit') continue
         else spriteObject = this.hexMapData.terrainList[spriteList[i].id]

         let keyObj = {
            q: spriteList[i].q,
            r: spriteList[i].r
         }
         let sprite = this.images[spriteObject.type][spriteObject.sprite]


         let shadowSize

         let shadowPos = this.utils.hexPositionToXYPosition(keyObj, spriteList[i].height)


         shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
         }

         shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
         shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


         if (this.utils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) continue

         if (spriteObject.shadowImages) {
            drawctx.drawImage(
               spriteObject.shadowImages[spriteObject.state][this.camera.rotation],
               shadowPos.x,
               shadowPos.y,
               shadowSize.width,
               shadowSize.height
            )
         }

      }
   }

   drawStructure = (drawctx, spriteReference) => {
      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawModifier = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * this.images.modifiers.size.width,
         height: this.hexMapData.size * 2 * this.images.modifiers.size.height
      }

      spritePos.x -= this.hexMapData.size + this.images.modifiers.offset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifiers.offset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawUnit = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.unitList[spriteReference.id]

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

      drawctx.drawImage(
         this.images.units[spriteObject.sprite][spriteObject.state].images[spriteObject.frame][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   prerender = () => {

      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {

         let terrainObject = this.hexMapData.terrainList[i]

         if (terrainObject == null) continue

         if (terrainObject.type == 'modifiers') this.renderer.renderModifier(terrainObject)
         if (terrainObject.type == 'structures') this.renderer.renderStructure(terrainObject)

      }

   }

}