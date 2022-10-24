export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas, shadowSize, treeSpriteChance, treeSpriteChanceIncrement) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.shadowSize = shadowSize
      this.treeSpriteChance = treeSpriteChance
      this.treeSpriteChanceIncrement = treeSpriteChanceIncrement

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

      let rotatedMap = this.utils.rotateMap()

      let terrainList = []

      //rotate terrain objects
      for (let i = 0; i < this.hexMapData.terrainList.length; i++) {
         let terrainObject = this.hexMapData.terrainList[i]

         let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

         terrainList.push({
            id: i,
            q: keyObj.q,
            r: keyObj.r
         })
      }

      //sort terrain object list
      terrainList.sort((a, b) => { return a.r - b.r || a.q - b.q })

      for (let i = 0; i < terrainList.length; i++) {

         let terrainObject = this.hexMapData.terrainList[terrainList[i].id]

         let keyObj = {
            q: terrainList[i].q,
            r: terrainList[i].r
         }

         let sprite

         if(terrainObject.type == 'modifier') {
            sprite = this.images.modifiers[terrainObject.sprite]
         }  else if(terrainObject.type == 'structure') {
            sprite = this.images[terrainObject.sprite]
         }

         

         let spriteSize
         
         let spritePos = this.utils.hexPositionToXYPosition(keyObj, terrainObject.height)

         if(terrainObject.type == 'modifier') {

            spriteSize = {
               width: this.hexMapData.size * 2 * this.images.modifiers.size.width,
               height: this.hexMapData.size * 2 * this.images.modifiers.size.height
            }

            spritePos.x -= this.hexMapData.size + this.images.modifiers.offset.x * this.hexMapData.size * 2
            spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.images.modifiers.offset.y * this.hexMapData.size * 2

         } else if(terrainObject.type == 'structure') {

            spriteSize = {
               width: this.hexMapData.size * 2 * sprite.spriteSize.width,
               height: this.hexMapData.size * 2 * sprite.spriteSize.height
            }

            spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
            spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2
            
         }

         if (this.onScreenCheck(spritePos, spriteSize) == false) continue

         let croppedImage

         if(terrainObject.type == 'modifier') {
            croppedImage = this.utils.cropOutTiles(sprite.images[terrainObject.state][this.camera.rotation], this.images.modifiers.size, this.images.modifiers.offset, keyObj, rotatedMap)
         } else if(terrainObject.type == 'structure') {
            croppedImage = this.utils.cropOutTiles(sprite.images[terrainObject.state][this.camera.rotation], sprite.spriteSize, sprite.spriteOffset, keyObj, rotatedMap)

         }

         //crop image
         croppedImage = this.darkenSprite(croppedImage, terrainObject)


         drawctx.drawImage(
            croppedImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
         )
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

   prerender = () => {

      for(let modifier in  this.images.modifiers){

         if(modifier == 'size' || modifier == 'modifierSize' || modifier == 'offset') continue;

         let sprites = this.images.modifiers[modifier]

         //set canvas size
         let canvasSize = {
            width: this.hexMapData.size * 2 * this.images.modifiers.size.width,
            height: this.hexMapData.size * 2 * this.images.modifiers.size.height
         }
   
   
         let imageDistnceDivisor = 2;
   
         //need setting for loops
         for (let i = 0; i < 64; i++) {
   
            //set positions
            let positionsList = [
               {
                  listPos: 5,
                  x: Math.sin(this.hexMapData.sideLength * 0) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 0) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
               {
                  listPos: 3,
                  x: Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
               {
                  listPos: 1,
                  x: Math.sin(this.hexMapData.sideLength * 2) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
               {
                  listPos: 0,
                  x: Math.sin(this.hexMapData.sideLength * 3) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
               {
                  listPos: 2,
                  x: Math.sin(this.hexMapData.sideLength * 4) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
               {
                  listPos: 4,
                  x: Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size / imageDistnceDivisor,
                  y: Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) / imageDistnceDivisor
               },
            ]
   
            let positions = [0, 1, 2, 3, 4, 5]
   
            //create pos list
            let filteredPositions = []
   
            let currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * sprites.modifierImages.length) })
            positions.splice(currentIndex, 1)
   
            let chance = this.treeSpriteChance[modifier]
            let roll = Math.random()
            while (roll > chance && positions.length > 0) {
               currentIndex = Math.floor(Math.random() * positions.length)
               filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * sprites.modifierImages.length) })
               positions.splice(currentIndex, 1)
   
               chance += this.treeSpriteChanceIncrement[modifier]
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
                     console.log(filteredPositionsList[i].imageNum)
                     tempctx.drawImage(sprites.modifierImages[filteredPositionsList[i].imageNum], canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width / 2 + filteredPositionsList[i].x, canvasSize.height - this.hexMapData.size * 2 * this.images.modifiers.modifierSize.height + filteredPositionsList[i].y, this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width, this.hexMapData.size * 2 * this.images.modifiers.modifierSize.height)
                  }
   
                  imageList[rotation] = tempCanvas
   
               } else {
                  imageList[rotation] = null
               }
   
   
               sprites.images[i] = imageList
            }
   
         }

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