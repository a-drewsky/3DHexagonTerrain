import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureRendererClass {

    constructor(structureData, hexMapData, tileData, cameraData, images) {
        this.structureData = structureData
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.cameraData = cameraData
        this.utils = new CommonRendererUtilsClass(hexMapData, tileData, cameraData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    renderAll = (structure) => {
        this.renderSprite(structure)
        this.renderShadow(structure)
    }

    renderSprite = (structure) => {

        let initRotation = this.cameraData.rotation

        let canvasSize = {
            width: this.hexMapData.size * 2 * structure.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * structure.imageObject.spriteSize.height
        }

        for (let i = 0; i < structure.imageObject[structure.state.current.name].images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount == 0) {

                    let spriteRotation = structure.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(structure.imageObject[structure.state.current.name].images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    if (structure.type == 'resource') {
                        this.utils.addResourceBar(tempCanvas, structure)
                    }

                    if (structure.type == 'bunker') {
                        this.utils.addHealthBar(tempCanvas, structure)
                    }

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            structure.images[i] = imageList
        }

        // this.renderShadow(structure)


        //crop and darken
        for (let i = 0; i < structure.images[0].length; i++) {

            if (structure.images[0][i] == null) continue

            this.cameraData.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.cameraData.rotation)

            this.utils.cropOutTiles(structure.images[0][i], structure.imageObject.spriteOffset, keyObj, rotatedMap)
            this.utils.darkenSprite(structure.images[0][i], structure)

        }

        this.cameraData.rotation = initRotation
    }

    renderShadow = (structure) => {

        let initRotation = this.cameraData.rotation

        //prerender shadow images
        if (structure.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount == 0) {

                    this.cameraData.rotation = rotation;
                    let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
                    let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.cameraData.rotation)


                    let shadowImage = this.utils.cropStructureShadow(structure.imageObject.shadowImages[rotation], structure.imageObject.shadowSize, structure.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            structure.shadowImages[0] = imageList

        }

        this.cameraData.rotation = initRotation

    }

}