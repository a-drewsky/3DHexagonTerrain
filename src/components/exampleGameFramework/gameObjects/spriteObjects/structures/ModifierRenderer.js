import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"

export default class ModifierRendererClass{

    constructor(structureData, hexMapData, tileData, camera, images){
        this.structureData = structureData
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.camera = camera
        this.utils = new CommonRendererUtilsClass(hexMapData, tileData, camera, images)

        this.commonUtils = new CommonHexMapUtilsClass()
    }

    render = (modifier) => {

        if(modifier.modifierType == 'singleImage'){
            this.renderSingleImage(modifier)
            return
        }

        let initCameraRotation = this.camera.rotation

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * modifier.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * modifier.imageObject.spriteSize.height
        }

        let shadowCanvasSize = {
            width: this.hexMapData.size * 2 * modifier.imageObject.shadowSize.width,
            height: this.hexMapData.size * 2 * modifier.imageObject.shadowSize.height
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
        filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * modifier.imageObject.modifierImages.length) })
        positions.splice(currentIndex, 1)

        let chance = modifier.secondSpriteChance
        let roll = Math.random()
        while (roll > chance && positions.length > 0) {
            currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * modifier.imageObject.modifierImages.length) })
            positions.splice(currentIndex, 1)

            chance += modifier.spriteIncrementChance
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
                            modifier.imageObject.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * modifier.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * modifier.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * modifier.imageObject.modifierSize.width,
                            this.hexMapData.size * 2 * modifier.imageObject.modifierSize.height
                        )
                    } else {
                        tempctxTop.drawImage(
                            modifier.imageObject.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * modifier.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * modifier.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * modifier.imageObject.modifierSize.width,
                            this.hexMapData.size * 2 * modifier.imageObject.modifierSize.height
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

        modifier.images[0] = imageList


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
                    if (modifier.imageObject.shadowImages[filteredPositionsList[i].imageNum][rotation] != null) {
                        tempctx.drawImage(
                            modifier.imageObject.shadowImages[filteredPositionsList[i].imageNum][rotation],
                            shadowCanvasSize.width / 2 - this.hexMapData.size * 2 * modifier.imageObject.shadowSpriteSize.width / 2 + filteredPositionsList[i].x,
                            shadowCanvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * modifier.imageObject.shadowSpriteSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * modifier.imageObject.shadowSpriteSize.width,
                            this.hexMapData.size * 2 * modifier.imageObject.shadowSpriteSize.height
                        )
                    }
                }


                shadowImageList[rotation] = tempCanvas

            } else {
                shadowImageList[rotation] = null
            }

        }

        modifier.shadowImages[0] = shadowImageList


        // prerender shadow images
        for (let i = 0; i < modifier.shadowImages[0].length; i++) {
            if (modifier.shadowImages[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position.q, modifier.position.r, this.camera.rotation)


            let shadowImage = this.utils.cropStructureShadow(modifier.shadowImages[0][i], modifier.imageObject.shadowSize, modifier.imageObject.shadowOffset, keyObj, rotatedMap, true)
            modifier.shadowImages[0][i] = shadowImage
        }


        //crop and darken sprites
        for (let i = 0; i < modifier.images[0].length; i++) {
            if (modifier.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position.q, modifier.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(modifier.images[0][i].top, modifier.imageObject.spriteSize, modifier.imageObject.offset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, modifier)
            modifier.images[0][i].top = darkenedImageTop

            let croppedImageBottom = this.utils.cropOutTiles(modifier.images[0][i].bottom, modifier.imageObject.spriteSize, modifier.imageObject.offset, keyObj, rotatedMap, true)
            let darkenedImageBottom = this.utils.darkenSprite(croppedImageBottom, modifier)
            modifier.images[0][i].bottom = darkenedImageBottom
        }
        this.camera.rotation = initCameraRotation
    }

    renderSingleImage = (modifier) => {


        let initRotation = this.camera.rotation

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * modifier.imageObject.singleImageSize.width,
            height: this.hexMapData.size * 2 * modifier.imageObject.singleImageSize.height
        }

        let imageList = []

        for (let rotation = 0; rotation < 12; rotation++) {

            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = canvasSize.width
                tempCanvas.height = canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(modifier.imageObject.modifierImages[0], 0, 0, tempCanvas.width, tempCanvas.height)

                imageList[rotation] = {
                    top: tempCanvas,
                    bottom: null
                }

            } else {
                imageList[rotation] = null
            }

        }

        modifier.images[0] = imageList


        modifier.shadowImages = null


        //crop and darken sprites
        for (let i = 0; i < modifier.images[0].length; i++) {
            if (modifier.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position.q, modifier.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(modifier.images[0][i].top, modifier.imageObject.singleImageSize, modifier.imageObject.singleImageOffset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, modifier)
            modifier.images[0][i].top = darkenedImageTop
        }

        this.camera.rotation = initRotation
    }

}