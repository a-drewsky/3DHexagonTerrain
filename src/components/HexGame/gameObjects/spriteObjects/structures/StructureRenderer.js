import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureRendererClass {

    constructor(hexMapData, images) {
        this.structureData = hexMapData.structureData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData
        this.utils = new CommonRendererUtilsClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    renderAll = (structure) => {
        this.renderSprite(structure)
        this.renderShadow(structure)
    }

    renderSprite = (structure) => {

        let initRotation = this.cameraData.rotation

        let canvasSize = {
            width: this.mapData.size * 2 * structure.imageObject.spriteSize.width,
            height: this.mapData.size * 2 * structure.imageObject.spriteSize.height
        }

        for (let i = 0; i < structure.imageObject[structure.state.current.name].images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {

                this.cameraData.rotation = rotation;
                let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
                let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.cameraData.rotation)

                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount == 0) {

                    let spriteRotation = structure.spriteRotation(rotation)

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(structure.imageObject[structure.state.current.name].images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)
                    imageList[rotation] = tempCanvas

                    if (structure.type == 'resource') {
                        this.utils.addResourceBar(imageList[rotation], structure)
                    }

                    if (structure.type == 'bunker') {
                        this.utils.addHealthBar(imageList[rotation], structure)
                    }


                    this.utils.cropOutTiles(imageList[rotation], structure.imageObject.spriteOffset, keyObj, rotatedMap)
                    this.utils.darkenSprite(imageList[rotation], structure)

                } else {
                    imageList[rotation] = null
                }
            }

            structure.images[i] = imageList
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