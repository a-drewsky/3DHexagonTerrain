export default class HexMapViewSpritesRendererClass {

    constructor(hexMapData, camera, images, utils, settings) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils
        this.treeSpriteChance = settings.MODIFIER_SECOND_SPRITE_CHANCE
        this.treeSpriteChanceIncrement = settings.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT

    }

    //break this up
    renderModifier = (terrainObject) => {

        let sprites = this.images[terrainObject.type][terrainObject.sprite]

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
                let tempCanvasTop = document.createElement('canvas')
                tempCanvasTop.width = canvasSize.width
                tempCanvasTop.height = canvasSize.height
                let tempctxTop = tempCanvasTop.getContext('2d')
                
                let tempCanvasBottom = document.createElement('canvas')
                tempCanvasBottom.width = canvasSize.width
                tempCanvasBottom.height = canvasSize.height
                let tempctxBottom = tempCanvasBottom.getContext('2d')

                for (let i = 0; i < filteredPositionsList.length; i++) {
                    if(filteredPositionsList[i].y > 0){
                        tempctxBottom.drawImage(
                            sprites.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifiers.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width,
                            this.hexMapData.size * 2 * this.images.modifiers.modifierSize.height
                        )
                    } else {
                        tempctxTop.drawImage(
                            sprites.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifiers.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.images.modifiers.modifierSize.width,
                            this.hexMapData.size * 2 * this.images.modifiers.modifierSize.height
                        )
                    }
                }

                imageList[rotation] = {
                    top: tempCanvasTop,
                    bottom: tempCanvasBottom
                }

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


            let shadowImage = this.utils.cropStructureShadow(terrainObject.shadowImages[0][i], sprites.shadowSize, sprites.shadowOffset, keyObj, rotatedMap, true)
            terrainObject.shadowImages[0][i] = shadowImage
        }


        //crop and darken sprites
        for (let i = 0; i < terrainObject.images[0].length; i++) {
            if (terrainObject.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.utils.rotateMap()
            let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(terrainObject.images[0][i].top, this.images.modifiers.size, this.images.modifiers.offset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, terrainObject)
            terrainObject.images[0][i].top = darkenedImageTop
            
            let croppedImageBottom = this.utils.cropOutTiles(terrainObject.images[0][i].bottom, this.images.modifiers.size, this.images.modifiers.offset, keyObj, rotatedMap, true)
            let darkenedImageBottom = this.utils.darkenSprite(croppedImageBottom, terrainObject)
            terrainObject.images[0][i].bottom = darkenedImageBottom
        }
    }

    renderStructure = (terrainObject) => {

        let initRotation = this.camera.rotation

        let sprite = this.images[terrainObject.type][terrainObject.sprite]

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

                    tempctx.drawImage(sprite.images[i][rotation], 0, 0, tempCanvas.width, tempCanvas.height)


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
                let darkenedImage = this.utils.darkenSprite(croppedImage, terrainObject)
                terrainObject.images[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation
    }

    renderUnit = (unitObject) => {

        let initRotation = this.camera.rotation

        let sprite = this.images[unitObject.type][unitObject.sprite]

        let canvasSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        for (let i = 0; i < sprite.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    let spriteRotation = unitObject.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(sprite.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)


                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            unitObject.renderImages[i] = imageList
        }

        //prerender shadow images
        if (sprite.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.utils.rotateMap()
                    let keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(sprite.shadowImages[rotation], sprite.shadowSize, sprite.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            unitObject.renderShadowImages = imageList

        }


        //crop and darken
        for (let i = 0; i < unitObject.renderImages[0].length; i++) {
            if (unitObject.renderImages[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.utils.rotateMap()
            let keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)

            for (let j = 0; j < sprite.idle.images.length; j++) {
                let croppedImage = this.utils.cropOutTiles(unitObject.renderImages[j][i], sprite.spriteSize, sprite.spriteOffset, keyObj, rotatedMap)
                let darkenedImage = this.utils.darkenSprite(croppedImage, unitObject)
                unitObject.renderImages[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation

    }

}