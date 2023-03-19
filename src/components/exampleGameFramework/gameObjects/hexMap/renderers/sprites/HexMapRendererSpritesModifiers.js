export default class HexMapRendererSpritesModifiersClass {

    constructor(hexMapData, camera, settings, images, utils){
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils

        this.modifierSettings = settings.MODIFIERS
    }

    render = (terrainObject) => {

        let initCameraRotation = this.camera.rotation

        let sprites = this.images[terrainObject.type][terrainObject.sprite]

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.size.width,
            height: this.hexMapData.size * 2 * this.images.modifier.size.height
        }

        let shadowCanvasSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.shadowSize.width,
            height: this.hexMapData.size * 2 * this.images.modifier.shadowSize.height
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

        let chance = this.modifierSettings[terrainObject.sprite].secondSpriteChance
        let roll = Math.random()
        while (roll > chance && positions.length > 0) {
            currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * sprites.modifierImages.length) })
            positions.splice(currentIndex, 1)

            chance += this.modifierSettings[terrainObject.sprite].spriteIncrementChance
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
                    if (filteredPositionsList[i].y > 0) {
                        tempctxBottom.drawImage(
                            sprites.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifier.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifier.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.images.modifier.modifierSize.width,
                            this.hexMapData.size * 2 * this.images.modifier.modifierSize.height
                        )
                    } else {
                        tempctxTop.drawImage(
                            sprites.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifier.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifier.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.images.modifier.modifierSize.width,
                            this.hexMapData.size * 2 * this.images.modifier.modifierSize.height
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
                            shadowCanvasSize.width / 2 - this.hexMapData.size * 2 * this.images.modifier.shadowSpriteSize.width / 2 + filteredPositionsList[i].x,
                            shadowCanvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.images.modifier.shadowSpriteSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.images.modifier.shadowSpriteSize.width,
                            this.hexMapData.size * 2 * this.images.modifier.shadowSpriteSize.height
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
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)


            let shadowImage = this.utils.cropStructureShadow(terrainObject.shadowImages[0][i], this.images.modifier.shadowSize, this.images.modifier.shadowOffset, keyObj, rotatedMap, true)
            terrainObject.shadowImages[0][i] = shadowImage
        }


        //crop and darken sprites
        for (let i = 0; i < terrainObject.images[0].length; i++) {
            if (terrainObject.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(terrainObject.images[0][i].top, this.images.modifier.size, this.images.modifier.offset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, terrainObject)
            terrainObject.images[0][i].top = darkenedImageTop

            let croppedImageBottom = this.utils.cropOutTiles(terrainObject.images[0][i].bottom, this.images.modifier.size, this.images.modifier.offset, keyObj, rotatedMap, true)
            let darkenedImageBottom = this.utils.darkenSprite(croppedImageBottom, terrainObject)
            terrainObject.images[0][i].bottom = darkenedImageBottom
        }
        this.camera.rotation = initCameraRotation
    }

    renderSingleImage = (terrainObject) => {

        let initRotation = this.camera.rotation

        let sprites = this.images[terrainObject.type][terrainObject.sprite]

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * this.images.modifier.singleImageSize.width,
            height: this.hexMapData.size * 2 * this.images.modifier.singleImageSize.height
        }

        let imageList = []

        for (let rotation = 0; rotation < 12; rotation++) {

            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = canvasSize.width
                tempCanvas.height = canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(sprites.modifierImages[0], 0, 0, tempCanvas.width, tempCanvas.height)

                imageList[rotation] = {
                    top: tempCanvas,
                    bottom: null
                }

            } else {
                imageList[rotation] = null
            }

        }

        terrainObject.images[0] = imageList


        terrainObject.shadowImages = null


        //crop and darken sprites
        for (let i = 0; i < terrainObject.images[0].length; i++) {
            if (terrainObject.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.utils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(terrainObject.images[0][i].top, this.images.modifier.singleImageSize, this.images.modifier.singleImageOffset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, terrainObject)
            terrainObject.images[0][i].top = darkenedImageTop
        }

        this.camera.rotation = initRotation
    }

}