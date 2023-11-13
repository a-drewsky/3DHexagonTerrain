import CommonHexMapUtilsClass from "../../../commonUtils/CommonHexMapUtils"
import CommonRendererUtilsClass from "../../../commonUtils/CommonRendererUtils"

export default class ModifierRendererClass {

    constructor(hexMapData, images) {
        this.structureData = hexMapData.structureData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.utils = new CommonRendererUtilsClass(hexMapData)

        this.commonUtils = new CommonHexMapUtilsClass()



        this.positionsList = [
            {
                listPos: 5,
                x: Math.sin(this.mapData.sideLength * 0) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 0) * (this.mapData.size * this.mapData.squish) / 2
            },
            {
                listPos: 3,
                x: Math.sin(this.mapData.sideLength * 1) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 1) * (this.mapData.size * this.mapData.squish) / 2
            },
            {
                listPos: 1,
                x: Math.sin(this.mapData.sideLength * 2) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 2) * (this.mapData.size * this.mapData.squish) / 2
            },
            {
                listPos: 0,
                x: Math.sin(this.mapData.sideLength * 3) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 3) * (this.mapData.size * this.mapData.squish) / 2
            },
            {
                listPos: 2,
                x: Math.sin(this.mapData.sideLength * 4) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 4) * (this.mapData.size * this.mapData.squish) / 2
            },
            {
                listPos: 4,
                x: Math.sin(this.mapData.sideLength * 5) * this.mapData.size / 2,
                y: Math.cos(this.mapData.sideLength * 5) * (this.mapData.size * this.mapData.squish) / 2
            },
        ]
    }

    renderAll = (modifier) => {
        this.renderSprite(modifier)
        this.renderShadows(modifier)
    }

    renderSprite = (modifier) => {

        if (modifier.modifierType === 'singleImage') {
            this.renderSingleImage(modifier)
            return
        }

        let initCameraRotation = this.cameraData.rotation

        //set canvas size
        let canvasSize = {
            width: this.mapData.size * 2 * modifier.imageObject.spriteSize.width,
            height: this.mapData.size * 2 * modifier.imageObject.spriteSize.height
        }

        let imageList = []

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)

            let filteredPositionsList = []
            for (let j = 0; j < modifier.spritePositions.length; j++) {

                let index = modifier.spritePositions[j].position - Math.floor(rotation / 2);
                if (index < 0) index += 6

                filteredPositionsList.push({ ...this.positionsList[index], image: modifier.spritePositions[j].image })
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
                        modifier.imageObject[filteredPositionsList[i].image].sprite,
                        canvasSize.width / 2 - this.mapData.size * 2 * modifier.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                        canvasSize.height / 2 - this.mapData.size * 2 * this.mapData.squish * modifier.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                        this.mapData.size * 2 * modifier.imageObject.modifierSize.width,
                        this.mapData.size * 2 * modifier.imageObject.modifierSize.height
                    )
                } else {
                    tempctxTop.drawImage(
                        modifier.imageObject[filteredPositionsList[i].image].sprite,
                        canvasSize.width / 2 - this.mapData.size * 2 * modifier.imageObject.modifierSize.width / 2 + filteredPositionsList[i].x,
                        canvasSize.height / 2 - this.mapData.size * 2 * this.mapData.squish * modifier.imageObject.modifierSize.height / 2 + filteredPositionsList[i].y,
                        this.mapData.size * 2 * modifier.imageObject.modifierSize.width,
                        this.mapData.size * 2 * modifier.imageObject.modifierSize.height
                    )
                }
            }

            imageList[rotation] = {
                top: tempCanvasTop,
                bottom: tempCanvasBottom
            }

            this.utils.cropOutTiles(imageList[rotation].top, modifier.imageObject.offset, keyObj, rotatedMap, true)
            this.utils.darkenSprite(imageList[rotation].top, modifier)

            this.utils.cropOutTiles(imageList[rotation].bottom, modifier.imageObject.offset, keyObj, rotatedMap, true)
            this.utils.darkenSprite(imageList[rotation].bottom, modifier)


        }

        modifier.images[0] = imageList

        this.cameraData.rotation = initCameraRotation
    }

    renderShadows = (modifier) => {

        let initCameraRotation = this.cameraData.rotation

        let shadowCanvasSize = {
            width: this.mapData.size * 2 * modifier.imageObject.shadowSize.width,
            height: this.mapData.size * 2 * modifier.imageObject.shadowSize.height
        }

        //construct shadow images
        let shadowImageList = []

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)

            let filteredPositionsList = []
            for (let j = 0; j < modifier.spritePositions.length; j++) {

                let index = modifier.spritePositions[j].position - Math.floor(rotation / 2);
                if (index < 0) index += 6

                filteredPositionsList.push({ ...this.positionsList[index], image: modifier.spritePositions[j].image })
            }

            //sort pos list
            filteredPositionsList.sort((a, b) => a.listPos - b.listPos)

            //create canvas
            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = shadowCanvasSize.width
            tempCanvas.height = shadowCanvasSize.height
            let tempctx = tempCanvas.getContext('2d')

            for (let i = 0; i < filteredPositionsList.length; i++) {

                if (modifier.imageObject[filteredPositionsList[i].image].shadow === null) continue

                let shadowImage = this.images.shadows[modifier.imageObject[filteredPositionsList[i].image].shadow][rotation]

                tempctx.drawImage(
                    shadowImage.image,
                    shadowCanvasSize.width / 2 - this.mapData.size * 2 * shadowImage.size.w / 2 + filteredPositionsList[i].x,
                    shadowCanvasSize.height / 2 - this.mapData.size * 2 * this.mapData.squish * shadowImage.size.h / 2 + filteredPositionsList[i].y,
                    this.mapData.size * 2 * shadowImage.size.w,
                    this.mapData.size * 2 * shadowImage.size.h
                )

            }

            shadowImageList[rotation] = tempCanvas

            let croppedImage = this.utils.cropShadow(shadowImageList[rotation], { w: modifier.imageObject.shadowSize.width, h: modifier.imageObject.shadowSize.height }, modifier.imageObject.shadowOffset, keyObj, rotatedMap)
            shadowImageList[rotation] = croppedImage


        }

        modifier.shadowImages = shadowImageList

        this.cameraData.rotation = initCameraRotation
    }

    renderSingleImage = (modifier) => {


        let initRotation = this.cameraData.rotation

        let canvasSize = {
            width: this.mapData.size * 2 * modifier.imageObject.singleImageSize.width,
            height: this.mapData.size * 2 * modifier.imageObject.singleImageSize.height
        }

        let imageList = []

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(modifier.position, this.cameraData.rotation)


            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvasSize.width
            tempCanvas.height = canvasSize.height
            let tempctx = tempCanvas.getContext('2d')

            console.log(modifier)

            tempctx.drawImage(modifier.imageObject[modifier.sprite].sprite, 0, 0, tempCanvas.width, tempCanvas.height)

            imageList[rotation] = {
                top: tempCanvas,
                bottom: null
            }

            this.utils.cropOutTiles(imageList[rotation].top, modifier.imageObject.singleImageOffset, keyObj, rotatedMap, true)
            this.utils.darkenSprite(imageList[rotation].top, modifier)


        }

        modifier.images[0] = imageList

        this.cameraData.rotation = initRotation
    }

}