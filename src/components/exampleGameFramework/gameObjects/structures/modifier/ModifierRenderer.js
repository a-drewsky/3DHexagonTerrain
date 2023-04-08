import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils"
import HexMapRendererUtilsClass from "../../commonUtils/HexMapRendererUtils"

export default class ModifierRendererClass{

    constructor(data, hexMapData, tileManager, camera, settings, images){
        this.data = data
        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.camera = camera
        this.images = images
        this.utils = new HexMapRendererUtilsClass(hexMapData, tileManager, camera, settings, images)

        this.modifierSettings = settings.MODIFIERS
        this.commonUtils = new HexMapCommonUtilsClass()
    }

    render = () => {

        if(this.data.modifierType == 'singleImage'){
            this.renderSingleImage()
            return
        }

        let initCameraRotation = this.camera.rotation

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * this.data.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * this.data.imageObject.spriteSize.height
        }

        let shadowCanvasSize = {
            width: this.hexMapData.size * 2 * this.data.imageObject.shadowSize.width,
            height: this.hexMapData.size * 2 * this.data.imageObject.shadowSize.height
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
        filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * this.data.imageObject.modifierImages.length) })
        positions.splice(currentIndex, 1)

        let chance = this.modifierSettings[this.data.sprite].secondSpriteChance
        let roll = Math.random()
        while (roll > chance && positions.length > 0) {
            currentIndex = Math.floor(Math.random() * positions.length)
            filteredPositions.push({ position: positions[currentIndex], imageNum: Math.floor(Math.random() * this.data.imageObject.modifierImages.length) })
            positions.splice(currentIndex, 1)

            chance += this.modifierSettings[this.data.sprite].spriteIncrementChance
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
                            this.data.imageObject.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.data.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.data.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.data.imageObject.modifierSize.width,
                            this.hexMapData.size * 2 * this.data.imageObject.modifierSize.height
                        )
                    } else {
                        tempctxTop.drawImage(
                            this.data.imageObject.modifierImages[filteredPositionsList[i].imageNum],
                            canvasSize.width / 2 - this.hexMapData.size * 2 * this.data.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                            canvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.data.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.data.imageObject.modifierSize.width,
                            this.hexMapData.size * 2 * this.data.imageObject.modifierSize.height
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

        this.data.images[0] = imageList


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
                    if (this.data.imageObject.shadowImages[filteredPositionsList[i].imageNum][rotation] != null) {
                        tempctx.drawImage(
                            this.data.imageObject.shadowImages[filteredPositionsList[i].imageNum][rotation],
                            shadowCanvasSize.width / 2 - this.hexMapData.size * 2 * this.data.imageObject.shadowSpriteSize.width / 2 + filteredPositionsList[i].x,
                            shadowCanvasSize.height / 2 - this.hexMapData.size * 2 * this.hexMapData.squish * this.data.imageObject.shadowSpriteSize.height / 2 + filteredPositionsList[i].y,
                            this.hexMapData.size * 2 * this.data.imageObject.shadowSpriteSize.width,
                            this.hexMapData.size * 2 * this.data.imageObject.shadowSpriteSize.height
                        )
                    }
                }


                shadowImageList[rotation] = tempCanvas

            } else {
                shadowImageList[rotation] = null
            }

        }

        this.data.shadowImages[0] = shadowImageList


        // prerender shadow images
        for (let i = 0; i < this.data.shadowImages[0].length; i++) {
            if (this.data.shadowImages[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileManager.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)


            let shadowImage = this.utils.cropStructureShadow(this.data.shadowImages[0][i], this.data.imageObject.shadowSize, this.data.imageObject.shadowOffset, keyObj, rotatedMap, true)
            this.data.shadowImages[0][i] = shadowImage
        }


        //crop and darken sprites
        for (let i = 0; i < this.data.images[0].length; i++) {
            if (this.data.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileManager.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(this.data.images[0][i].top, this.data.imageObject.spriteSize, this.data.imageObject.offset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, this.data)
            this.data.images[0][i].top = darkenedImageTop

            let croppedImageBottom = this.utils.cropOutTiles(this.data.images[0][i].bottom, this.data.imageObject.spriteSize, this.data.imageObject.offset, keyObj, rotatedMap, true)
            let darkenedImageBottom = this.utils.darkenSprite(croppedImageBottom, this.data)
            this.data.images[0][i].bottom = darkenedImageBottom
        }
        this.camera.rotation = initCameraRotation
    }

    renderSingleImage = () => {


        let initRotation = this.camera.rotation

        //set canvas size
        let canvasSize = {
            width: this.hexMapData.size * 2 * this.data.imageObject.singleImageSize.width,
            height: this.hexMapData.size * 2 * this.data.imageObject.singleImageSize.height
        }

        let imageList = []

        for (let rotation = 0; rotation < 12; rotation++) {

            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = canvasSize.width
                tempCanvas.height = canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(this.data.imageObject.modifierImages[0], 0, 0, tempCanvas.width, tempCanvas.height)

                imageList[rotation] = {
                    top: tempCanvas,
                    bottom: null
                }

            } else {
                imageList[rotation] = null
            }

        }

        this.data.images[0] = imageList


        this.data.shadowImages = null


        //crop and darken sprites
        for (let i = 0; i < this.data.images[0].length; i++) {
            if (this.data.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileManager.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)


            let croppedImageTop = this.utils.cropOutTiles(this.data.images[0][i].top, this.data.imageObject.singleImageSize, this.data.imageObject.singleImageOffset, keyObj, rotatedMap, true)
            let darkenedImageTop = this.utils.darkenSprite(croppedImageTop, this.data)
            this.data.images[0][i].top = darkenedImageTop
        }

        this.camera.rotation = initRotation
    }

}