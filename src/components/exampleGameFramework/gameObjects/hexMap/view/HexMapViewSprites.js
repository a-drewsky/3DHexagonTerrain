import HexMapViewSpritesRendererClass from "./HexMapViewSpritesRenderer"

export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas, settings) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.shadowSize = settings.SHADOW_SIZE

      this.travelTime = settings.TRAVEL_TIME
      this.jumpAmount = settings.JUMP_AMOUNT

      this.renderer = new HexMapViewSpritesRendererClass(hexMapData, camera, images, settings);

      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
      }

   }

   draw = (drawctx) => {

      let spriteList = []

      //terrain objects
      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {
         let terrainObject = this.hexMapData.terrainList[i]
         if (terrainObject == null) continue

         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         let height = this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height

         //modifier top or bottom
         if (terrainObject.type == 'modifier') {

            spriteList.push({
               id: i,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: terrainObject.type,
               modifierPos: 'top'
            })

            spriteList.push({
               id: i,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: terrainObject.type,
               modifierPos: 'bottom'
            })

         } else {

            spriteList.push({
               id: i,
               q: keyObj.q,
               r: keyObj.r,
               height: height,
               type: terrainObject.type,
               modifierPos: null
            })

         }
      }

      //units
      for (let i = 0; i < this.hexMapData.unitList.length; i++) {
         let unitObject = this.hexMapData.unitList[i]
         if (unitObject == null) continue

         let keyObj
         let height

         if (unitObject.destination != null && (unitObject.destinationCurTime - unitObject.destinationStartTime) / this.travelTime > 0.5) {
            keyObj = this.utils.rotateTile(unitObject.destination.q, unitObject.destination.r, this.camera.rotation)
         } else {
            keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)
         }

         height = this.hexMapData.getEntry(unitObject.position.q, unitObject.position.r).height

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
            case 'base':
            case 'prop':
            case 'resource':
            case 'flag':
               this.drawStructure(drawctx, spriteList[i])
               break
            case 'modifier':
               if (spriteList[i].modifierPos == 'top') this.drawModifierTop(drawctx, spriteList[i])
               if (spriteList[i].modifierPos == 'bottom') this.drawModifierBottom(drawctx, spriteList[i])
               break
            case 'unit':
               this.drawUnit(drawctx, spriteList[i])
               break
         }

      }
   }

   drawShadows = (drawctx, spriteList) => {
      for (let i = 0; i < spriteList.length; i++) {

         if (spriteList[i].modifierPos == 'bottom') continue

         let spriteObject

         if (spriteList[i].type == 'unit') {
            this.drawUnitShadow(drawctx, spriteList[i])
            continue
         }
         else spriteObject = this.hexMapData.terrainList[spriteList[i].id]

         if (!spriteObject.shadowImages || spriteObject.shadowImages.length == 0) continue

         let keyObj = {
            q: spriteList[i].q,
            r: spriteList[i].r
         }
         let sprite = this.images[spriteObject.type][spriteObject.sprite]


         let shadowSize

         let shadowPos = this.utils.hexPositionToXYPosition(keyObj, spriteList[i].height)

         if (spriteObject.type == 'modifier') {
            shadowSize = {
               width: this.hexMapData.size * 2 * this.images.modifier.shadowSize.width,
               height: this.hexMapData.size * 2 * this.images.modifier.shadowSize.height
            }

            shadowPos.x -= this.hexMapData.size + this.images.modifier.shadowOffset.x * this.hexMapData.size * 2
            shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.shadowOffset.y * this.hexMapData.size * 2
         } else {
            shadowSize = {
               width: this.hexMapData.size * 2 * sprite.shadowSize.width,
               height: this.hexMapData.size * 2 * sprite.shadowSize.height
            }

            shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
            shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2
         }

         if (this.utils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) continue

         drawctx.drawImage(
            spriteObject.shadowImages[0][this.camera.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
         )

      }
   }

   drawStructure = (drawctx, spriteReference) => {
      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

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
         spriteObject.images[0][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

   drawModifierTop = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

      if (spriteObject.modifierType == 'fullImage') {
         this.drawFullImageModifierTop(drawctx, spriteReference)
         return
      }
      if (spriteObject.modifierType == 'singleImage') {
         this.drawFullImageModifierTop(drawctx, spriteReference)
         return
      }

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * this.images.modifier.size.width,
         height: this.hexMapData.size * 2 * this.images.modifier.size.height
      }

      spritePos.x -= this.hexMapData.size + this.images.modifier.offset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.offset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation].top,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawModifierBottom = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

      if (spriteObject.modifierType == 'fullImage') {
         this.drawFullImageModifierBottom(drawctx, spriteReference)
         return
      }
      if (spriteObject.modifierType == 'singleImage') {
         return
      }

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * this.images.modifier.size.width,
         height: this.hexMapData.size * 2 * this.images.modifier.size.height
      }

      spritePos.x -= this.hexMapData.size + this.images.modifier.offset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.offset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation].bottom,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawFullImageModifierTop = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * this.images.modifier.fullImageSize.width,
         height: this.hexMapData.size * 2 * this.images.modifier.fullImageSize.height
      }

      spritePos.x -= this.hexMapData.size + this.images.modifier.fullImageOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.fullImageOffset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation].top,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawFullImageModifierBottom = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.terrainList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(keyObj, spriteReference.height)

      spriteSize = {
         width: this.hexMapData.size * 2 * this.images.modifier.fullImageSize.width,
         height: this.hexMapData.size * 2 * this.images.modifier.fullImageSize.height
      }

      spritePos.x -= this.hexMapData.size + this.images.modifier.fullImageOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifier.fullImageOffset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.images[spriteObject.state][this.camera.rotation].bottom,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawStaticUnitShadow = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.unitList[spriteReference.id]

      if (!spriteObject.renderShadowImages || spriteObject.renderShadowImages.length == 0) return

      let keyObj = {
         q: spriteReference.q,
         r: spriteReference.r
      }
      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let tileHeight = spriteReference.height

      let shadowSize

      let shadowPos = this.utils.hexPositionToXYPosition(keyObj, tileHeight)


      shadowSize = {
         width: this.hexMapData.size * 2 * sprite.shadowSize.width,
         height: this.hexMapData.size * 2 * sprite.shadowSize.height
      }

      shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
      shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


      if (this.utils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return
      drawctx.drawImage(
         spriteObject.renderShadowImages[this.camera.rotation],
         shadowPos.x,
         shadowPos.y,
         shadowSize.width,
         shadowSize.height
      )
   }

   drawUnitShadow = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.unitList[spriteReference.id]

      if (!spriteObject.images || spriteObject.images.length == 0) return

      if (spriteObject.destination == null) {
         this.drawStaticUnitShadow(drawctx, spriteReference)
         return
      }

      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      if (!sprite.shadowImages) return

      let pos = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let closestTile = {
         q: spriteObject.position.q,
         r: spriteObject.position.r
      }

      if (spriteObject.destination != null) {
         let point1 = spriteObject.position
         let point2 = spriteObject.destination
         let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / this.travelTime
         let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
         }
         pos = this.utils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
         if (percent > 0.5) {
            closestTile = {
               q: spriteObject.destination.q,
               r: spriteObject.destination.r
            }
         }
      }

      let shadowSize
      let tileHeight = this.hexMapData.getEntry(closestTile.q, closestTile.r).height

      let shadowPos = this.utils.hexPositionToXYPosition(pos, tileHeight)

      shadowSize = {
         width: this.hexMapData.size * 2 * sprite.shadowSize.width,
         height: this.hexMapData.size * 2 * sprite.shadowSize.height
      }

      shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
      shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return

      let shadowImage = this.images.unit[spriteObject.sprite].shadowImages[this.camera.rotation]

      shadowImage = this.utils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation])

      drawctx.drawImage(
         shadowImage,
         shadowPos.x,
         shadowPos.y,
         shadowSize.width,
         shadowSize.height
      )

   }

   drawStaticUnit = (drawctx, spriteReference) => {
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
         spriteObject.renderImages[spriteObject.frame][this.camera.rotation],
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawActionUnit = (drawctx, spriteReference, spriteObject) => {

      let pos = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let height = spriteReference.height

      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let spritePos = this.utils.hexPositionToXYPosition(pos, height)

      let spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

      let spriteRotation = spriteObject.rotation + this.camera.rotation

      if (this.camera.rotation % 2 == 1) spriteRotation--

      if (spriteRotation > 11) spriteRotation -= 12

      let spriteImage = this.images.unit[spriteObject.sprite][spriteObject.state].images[spriteObject.frame][spriteRotation]

      spriteImage = this.utils.addHealthBar(spriteImage, sprite.spriteSize, spriteObject)
      spriteImage = this.utils.cropOutTiles(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation])
      spriteImage = this.utils.darkenSpriteJump(spriteImage, spriteObject, pos, height)
      drawctx.drawImage(
         spriteImage,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )

   }

   drawMovingUnit = (drawctx, spriteReference, spriteObject) => {

      let pos = {
         q: spriteReference.q,
         r: spriteReference.r
      }

      let closestTile = {
         q: spriteObject.position.q,
         r: spriteObject.position.r
      }

      let height = spriteReference.height

      if (spriteObject.destination != null) {
         //set pos
         let point1 = spriteObject.position
         let point2 = spriteObject.destination
         let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / this.travelTime
         let lerpPos = {
            q: point1.q + (point2.q - point1.q) * percent,
            r: point1.r + (point2.r - point1.r) * percent
         }
         pos = this.utils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
         if (percent > 0.5) {
            closestTile = {
               q: spriteObject.destination.q,
               r: spriteObject.destination.r
            }
         }

         //set height
         let newHeight = this.hexMapData.getEntry(spriteObject.destination.q, spriteObject.destination.r).height

         if (newHeight != height) {
            let extraHeight = Math.sin(percent * Math.PI) * this.jumpAmount

            height = height + (newHeight - height) * percent + extraHeight
         }
      }


      let sprite = this.images[spriteObject.type][spriteObject.sprite]

      let spriteSize

      let spritePos = this.utils.hexPositionToXYPosition(pos, height)

      spriteSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }

      spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
      spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

      if (this.utils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

      let spriteRotation = spriteObject.rotation + this.camera.rotation

      if (this.camera.rotation % 2 == 1) spriteRotation--

      if (spriteRotation > 11) spriteRotation -= 12

      let spriteImage = this.images.unit[spriteObject.sprite][spriteObject.state].images[spriteObject.frame][spriteRotation]

      spriteImage = this.utils.cropOutTilesJump(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation], height)
      spriteImage = this.utils.darkenSpriteJump(spriteImage, spriteObject, closestTile, height)

      drawctx.drawImage(
         spriteImage,
         spritePos.x,
         spritePos.y,
         spriteSize.width,
         spriteSize.height
      )
   }

   drawUnit = (drawctx, spriteReference) => {

      let spriteObject = this.hexMapData.unitList[spriteReference.id]

      if (spriteObject.stateConfig[spriteObject.state].type == 'moving') {
         this.drawMovingUnit(drawctx, spriteReference, spriteObject)
         return
      }

      if (spriteObject.stateConfig[spriteObject.state].type == 'action') {
         this.drawActionUnit(drawctx, spriteReference, spriteObject)
         return
      }

      this.drawStaticUnit(drawctx, spriteReference)

   }

   prerenderTerrain = (terrainObject) => {

      if (terrainObject == null) return

      if (terrainObject.type == 'modifier') this.renderer.renderModifier(terrainObject)
      else this.renderer.renderStructure(terrainObject)

   }

   prerenderUnits = () => {
      for (let i = 0; i < this.hexMapData.unitList.length; i++) {

         let unitObject = this.hexMapData.unitList[i]

         if (unitObject == null) continue

         this.renderer.renderUnit(unitObject)

      }
   }

}