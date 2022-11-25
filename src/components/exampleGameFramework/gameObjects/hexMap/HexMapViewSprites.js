export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas, settings) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.shadowSize = settings.SHADOW_SIZE
      this.treeSpriteChance = settings.MODIFIER_SECOND_SPRITE_CHANCE
      this.treeSpriteChanceIncrement = settings.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT

      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
      }

      this.shadowPositions = {
         0: {
            distance: { q: -1, r: 2 },
            startingPoints: [{ q: -1, r: 2 }, { q: -1, r: 1 }, { q: 0, r: 1 }]
         },
         1: {
            distance: { q: -1, r: 1 },
            startingPoints: [{ q: -1, r: 1 }]
         },
         2: {
            distance: { q: -2, r: 1 },
            startingPoints: [{ q: -2, r: 1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]
         },
         3: {
            distance: { q: -1, r: 0 },
            startingPoints: [{ q: -1, r: 0 }]
         },
         4: {
            distance: { q: -1, r: -1 },
            startingPoints: [{ q: -1, r: -1 }, { q: -1, r: 0 }, { q: 0, r: -1 }]
         },
         5: {
            distance: { q: 0, r: -1 },
            startingPoints: [{ q: 0, r: -1 }]
         },
         6: {
            distance: { q: 1, r: -2 },
            startingPoints: [{ q: 1, r: -2 }, { q: 0, r: -1 }, { q: 1, r: -1 }]
         },
         7: {
            distance: { q: 1, r: -1 },
            startingPoints: [{ q: 1, r: -1 }]
         },
         8: {
            distance: { q: 2, r: -1 },
            startingPoints: [{ q: 2, r: -1 }, { q: 1, r: -1 }, { q: 1, r: 0 }]
         },
         9: {
            distance: { q: 1, r: 0 },
            startingPoints: [{ q: 1, r: 0 }]
         },
         10: {
            distance: { q: 1, r: 1 },
            startingPoints: [{ q: 1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }]
         },
         11: {
            distance: { q: 0, r: 1 },
            startingPoints: [{ q: 0, r: 1 }]
         }
      }

   }

   draw = (drawctx) => {

      let terrainList = []

      //rotate terrain objects
      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {
         let terrainObject = this.hexMapData.terrainList[i]
         if(terrainObject == null) continue

         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         let height = this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height

         terrainList.push({
            id: i,
            q: keyObj.q,
            r: keyObj.r,
            height: height
         })
      }

      //sort terrain object list
      terrainList.sort((a, b) => { return a.r - b.r || a.q - b.q })

      this.drawShadows(drawctx, terrainList)
      this.drawSprites(drawctx, terrainList)

   }

   drawShadows = (drawctx, terrainList) => {
      for (let i = 0; i < terrainList.length; i++) {

         let terrainObject = this.hexMapData.terrainList[terrainList[i].id]

         let keyObj = {
            q: terrainList[i].q,
            r: terrainList[i].r
         }

         let sprite

         if (terrainObject.type == 'modifier') {
            sprite = this.images.modifiers[terrainObject.sprite]
         } else {
            sprite = this.images.structures[terrainObject.sprite]
         }


         let shadowSize

         let shadowPos = this.utils.hexPositionToXYPosition(keyObj, terrainList[i].height)


         shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
         }

         shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
         shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


         if (this.onScreenCheck(shadowPos, shadowSize) == false) continue

         if (terrainObject.shadowImages) {
            drawctx.drawImage(
               terrainObject.shadowImages[terrainObject.state][this.camera.rotation],
               shadowPos.x,
               shadowPos.y,
               shadowSize.width,
               shadowSize.height
            )
         }

      }
   }

   drawSprites = (drawctx, terrainList) => {
      for (let i = 0; i < terrainList.length; i++) {

         let terrainObject = this.hexMapData.terrainList[terrainList[i].id]

         let keyObj = {
            q: terrainList[i].q,
            r: terrainList[i].r
         }

         if(terrainObject.relativePos){
            keyObj.q -= terrainObject.relativePos.q
            keyObj.r -= terrainObject.relativePos.r
         }

         let sprite

         if (terrainObject.type == 'modifier') {
            sprite = this.images.modifiers[terrainObject.sprite]
         } else {
            sprite = this.images.structures[terrainObject.sprite]
         }


         let spriteSize

         let spritePos = this.utils.hexPositionToXYPosition(keyObj, terrainList[i].height)

         let ogpos = { ...spritePos }

         if (terrainObject.type == 'modifier') {

            spriteSize = {
               width: this.hexMapData.size * 2 * this.images.modifiers.size.width,
               height: this.hexMapData.size * 2 * this.images.modifiers.size.height
            }

            spritePos.x -= this.hexMapData.size + this.images.modifiers.offset.x * this.hexMapData.size * 2
            spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifiers.offset.y * this.hexMapData.size * 2

         } else {

            spriteSize = {
               width: this.hexMapData.size * 2 * sprite.spriteSize.width,
               height: this.hexMapData.size * 2 * sprite.spriteSize.height
            }

            spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
            spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

         }

         if (this.onScreenCheck(spritePos, spriteSize) == false) continue

         drawctx.drawImage(
            terrainObject.images[terrainObject.state][this.camera.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
         )
         // drawctx.fillStyle = 'black'
         // drawctx.fillRect(ogpos.x-2,ogpos.y-2,4,4)
      }
   }

   darkenSprite = (croppedImage, terrainObject) => {
      //darken image
      let shadowHeight = terrainObject.tileHeight + 1

      let distance = 0
      let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

      let cropped = false;
      while (shadowHeight < this.hexMapData.maxHeight && cropped == false) {


         for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
            let startingPoint = shadowPosition.startingPoints[i]

            if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
               if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                  && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3)) {

                  croppedImage = this.utils.darkenSprite(croppedImage)
                  cropped = true
                  break;
               }
            } else {
               if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                  && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight) {

                  croppedImage = this.utils.darkenSprite(croppedImage)
                  cropped = true
                  break;
               }
            }


         }

         distance += 1;

         if (this.hexMapData.shadowRotation % 2 == 0) {
            shadowHeight += 1 / (this.shadowSize / 2) * Math.sqrt(3);
         } else {
            shadowHeight += 1 / (this.shadowSize / 2);
         }

      }

      return croppedImage;
   }

   renderModifier = (terrainObject) => {

      let sprites = this.images.modifiers[terrainObject.sprite]

      //set canvas size
      let canvasSize = {
         width: this.hexMapData.size * 2 * this.images.modifiers.size.width,
         height: this.hexMapData.size * 2 * this.images.modifiers.size.height
      }

      let shadowCanvasSize = {
         width: this.hexMapData.size * 2 * sprites.shadowSize.width,
         height: this.hexMapData.size * 2 * sprites.shadowSize.height
      }

      //set positions
      let positionsList = [
         {
            listPos: 5,
            x: Math.sin(this.hexMapData.sideLength * 0) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 0) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
         {
            listPos: 3,
            x: Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
         {
            listPos: 1,
            x: Math.sin(this.hexMapData.sideLength * 2) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
         {
            listPos: 0,
            x: Math.sin(this.hexMapData.sideLength * 3) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
         {
            listPos: 2,
            x: Math.sin(this.hexMapData.sideLength * 4) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
         {
            listPos: 4,
            x: Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size / 2,
            y: Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) / 2
         },
      ]

      let positions = [0, 1, 2, 3, 4, 5]

      //create pos list
      let filteredPositions = []

      let currentIndex = Math.floor(Math.random() * positions.length)
      filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * sprites.modifierImages.length) })
      positions.splice(currentIndex, 1)

      let chance = this.treeSpriteChance[terrainObject.sprite]
      let roll = Math.random()
      while (roll > chance && positions.length > 0) {
         currentIndex = Math.floor(Math.random() * positions.length)
         filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * sprites.modifierImages.length) })
         positions.splice(currentIndex, 1)

         chance += this.treeSpriteChanceIncrement[terrainObject.sprite]
         roll = Math.random()
      }

      let imageList = []

      for (let rotation = 0; rotation < 12; rotation++) {

         if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {
            let filteredPositionsList = []
            for (let j = 0; j < filteredPositions.length; j++) {

               let index = filteredPositions[j].position - Math.floor(rotation / 2);
               if (index < 0) index += 6

               filteredPositionsList.push({ ...positionsList[index], imageNum: filteredPositions[j].imageNum })
            }

            //sort pos list
            filteredPositionsList.sort((a, b) => a.listPos - b.listPos)


            //create canvas
            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvasSize.width
            tempCanvas.height = canvasSize.height
            let tempctx = tempCanvas.getContext('2d')

            for (let i = 0; i < filteredPositionsList.length; i++) {
               tempctx.drawImage(
                  sprites.modifierImages[filteredPositionsList[i].imageNum], 
                  canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width / 2 + filteredPositionsList[i].x, 
                  canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifiers.modifierSize.height / 2 + filteredPositionsList[i].y, 
                  this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width, 
                  this.hexMapData.size * 2 * this.images.modifiers.modifierSize.height
                  )
            }

            imageList[rotation] = tempCanvas

         } else {
            imageList[rotation] = null
         }

      }

      terrainObject.images[0] = imageList


      //construct shadow images
      let shadowImageList = []

      for (let rotation = 0; rotation < 12; rotation++) {

         if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {
            let filteredPositionsList = []
            for (let j = 0; j < filteredPositions.length; j++) {

               let index = filteredPositions[j].position - Math.floor(rotation / 2);
               if (index < 0) index += 6

               filteredPositionsList.push({ ...positionsList[index], imageNum: filteredPositions[j].imageNum })
            }

            //sort pos list
            filteredPositionsList.sort((a, b) => a.listPos - b.listPos)

            //create canvas
            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = shadowCanvasSize.width
            tempCanvas.height = shadowCanvasSize.height
            let tempctx = tempCanvas.getContext('2d')

            for (let i = 0; i < filteredPositionsList.length; i++) {
               if (sprites.shadowImages[filteredPositionsList[i].imageNum][rotation] != null) {
                  tempctx.drawImage(
                     sprites.shadowImages[filteredPositionsList[i].imageNum][rotation], 
                     shadowCanvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifiers.shadowSpriteSize.width / 2 + filteredPositionsList[i].x, 
                     shadowCanvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifiers.shadowSpriteSize.height / 2 + filteredPositionsList[i].y, 
                     this.hexMapData.size * 2 * this.images.modifiers.shadowSpriteSize.width, 
                     this.hexMapData.size * 2 * this.images.modifiers.shadowSpriteSize.height
                     )
               }
            }


            shadowImageList[rotation] = tempCanvas

         } else {
            shadowImageList[rotation] = null
         }

      }

      terrainObject.shadowImages[0] = shadowImageList


      // prerender shadow images
      for (let i = 0; i < terrainObject.shadowImages[0].length; i++) {
         if (terrainObject.shadowImages[0][i] == null) continue

         this.camera.rotation = i;
         let rotatedMap = this.utils.rotateMap()
         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         console.log(terrainObject.shadowImages[0][i])

         let shadowImage = this.utils.cropStructureShadow(terrainObject.shadowImages[0][i], sprites.shadowSize, sprites.shadowOffset, keyObj, rotatedMap, true)
         terrainObject.shadowImages[0][i] = shadowImage
      }


      // if (sprites.shadowImages) {
      //    for (let i = 0; i < sprites.shadowImages.length; i++) {
      //       let imageList = []
      //       for (let rotation = 0; rotation < 12; rotation++) {
      //          if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

      //             this.camera.rotation = rotation;
      //             let rotatedMap = this.utils.rotateMap()
      //             let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

      //             let shadowImage = this.utils.cropStructureShadow(sprites.shadowImages[i][rotation], sprites.shadowSize, sprites.shadowOffset, keyObj, rotatedMap)

      //             imageList[rotation] = shadowImage

      //          } else {
      //             imageList[rotation] = null
      //          }
      //       }

      //       terrainObject.shadowImages[i] = imageList
      //    }

      // }



      //crop and darken sprites
      for (let i = 0; i < terrainObject.images[0].length; i++) {
         if (terrainObject.images[0][i] == null) continue

         this.camera.rotation = i;
         let rotatedMap = this.utils.rotateMap()
         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         console.log(terrainObject)

         let croppedImage = this.utils.cropOutTiles(terrainObject.images[0][i], this.images.modifiers.size, this.images.modifiers.offset, keyObj, rotatedMap, true)
         let darkenedImage = this.darkenSprite(croppedImage, terrainObject)
         terrainObject.images[0][i] = darkenedImage
      }
   }

   renderStructure = (terrainObject) => {

      let sprite = this.images.structures[terrainObject.sprite]

      let canvasSize = {
         width: this.hexMapData.size * 2 * sprite.spriteSize.width,
         height: this.hexMapData.size * 2 * sprite.spriteSize.height
      }


      for (let i = 0; i < sprite.images.length; i++) {
         let imageList = []
         for (let rotation = 0; rotation < 12; rotation++) {
            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

               //create canvas
               let tempCanvas = document.createElement('canvas')
               tempCanvas.width = canvasSize.width
               tempCanvas.height = canvasSize.height
               let tempctx = tempCanvas.getContext('2d')

               if(sprite.images[i][rotation][['0_0']]){
                  let relPos = {
                     q: terrainObject.relativePos.q,
                     r: terrainObject.relativePos.r
                  }
                  if(relPos.q == -1) relPos.q = 'm1'
                  if(relPos.r == -1) relPos.r = 'm1'
                  let relativePosStr = `${relPos.q}_${relPos.r}`
                  console.log(relativePosStr)
                  tempctx.drawImage(sprite.images[i][rotation][relativePosStr], 0, 0, tempCanvas.width, tempCanvas.height)
               } else {
                  tempctx.drawImage(sprite.images[i][rotation], 0, 0, tempCanvas.width, tempCanvas.height)
               }

               

               imageList[rotation] = tempCanvas

            } else {
               imageList[rotation] = null
            }
         }

         terrainObject.images[i] = imageList
      }

      //prerender shadow images
      if (sprite.shadowImages) {
         for (let i = 0; i < sprite.shadowImages.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
               if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                  this.camera.rotation = rotation;
                  let rotatedMap = this.utils.rotateMap()
                  let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)
                  
                  console.log(terrainObject, sprite)

                  let shadowImage = this.utils.cropStructureShadow(sprite.shadowImages[i][rotation], sprite.shadowSize, sprite.shadowOffset, keyObj, rotatedMap)

                  imageList[rotation] = shadowImage

               } else {
                  imageList[rotation] = null
               }
            }

            terrainObject.shadowImages[i] = imageList
         }

      }


      //crop and darken
      for (let i = 0; i < terrainObject.images[0].length; i++) {
         if (terrainObject.images[0][i] == null) continue

         this.camera.rotation = i;
         let rotatedMap = this.utils.rotateMap()
         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         for (let j = 0; j < sprite.images.length; j++) {
            let croppedImage = this.utils.cropOutTiles(terrainObject.images[j][i], sprite.spriteSize, sprite.spriteOffset, keyObj, rotatedMap)
            let darkenedImage = this.darkenSprite(croppedImage, terrainObject)
            terrainObject.images[j][i] = darkenedImage
         }

      }
   }

   prerender = () => {

      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {

         let terrainObject = this.hexMapData.terrainList[i]

         if(terrainObject == null) continue

         if (terrainObject.type == 'modifier') this.renderModifier(terrainObject)
         if (terrainObject.type == 'structure') this.renderStructure(terrainObject)

      }

   }

   onScreenCheck = (spritePos, spriteSize) => {

      let zoom = this.camera.zoomAmount * this.camera.zoom

      let position = this.camera.position

      let canvasDims = this.canvasDims

      //check if sprite is on screen
      if (spritePos.x < position.x - spriteSize.width
         || spritePos.y < position.y - spriteSize.height
         || spritePos.x > position.x + canvasDims.width + zoom
         || spritePos.y > position.y + canvasDims.height + zoom * (canvasDims.height / canvasDims.width)) return false;

      return true
   }

}