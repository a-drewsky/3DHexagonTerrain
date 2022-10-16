export default class HexMapViewSpritesClass {

   constructor(hexMapData, camera, images, utils, canvas, shadowSize) {

      this.hexMapData = hexMapData
      this.camera = camera
      this.images = images
      this.utils = utils

      this.shadowSize = shadowSize

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
         let image = this.images[terrainObject.image]


         let spritePos = this.utils.hexPositionToXYPosition(keyObj, terrainObject.height)
         spritePos.x -= this.hexMapData.size
         spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.size

         let spriteSize = {
            width: this.hexMapData.size * 2 * image.size.width,
            height: this.hexMapData.size * 2 * image.size.height
         }

         if (this.onScreenCheck(spritePos, spriteSize) == false) continue

         //crop image
         let croppedImage = this.utils.cropOutTiles(image, keyObj, rotatedMap)

         //darken image
         let shadowHeight = terrainObject.tileHeight + 1

         let distance = 0
         let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

         let cropped = false;
         while (shadowHeight < this.hexMapData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
               let startingPoint = shadowPosition.startingPoints[i]

               //console.log(this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3), this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight)

               if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
                  if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                     && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3)) {
                     console.log(
                        "A ACT",
                        "distance: " + distance,
                        "tile pos: q:" + terrainObject.position.q + " r:" + terrainObject.position.r,
                        "compare pos: q:" + (terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance) + " r:" + (terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance),
                        "tile height: " + this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height,
                        "shadow height: " + (this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3)),
                        "compare height: " + this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height
                     )
                     croppedImage = this.utils.darkenSprite(croppedImage)
                     cropped = true
                     break;
                  }
               } else {
                  if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                     && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight) {
                        console.log(
                           "B ACT",
                           "distance: " + distance,
                           "tile pos: q:" + terrainObject.position.q + " r:" + terrainObject.position.r,
                           "compare pos: q:" + (terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance) + " r:" + (terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance),
                           "tile height: " + this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height,
                           "shadow height: " + (this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight),
                           "compare height: " + this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height
                        )
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


         drawctx.drawImage(
            croppedImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
         )
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