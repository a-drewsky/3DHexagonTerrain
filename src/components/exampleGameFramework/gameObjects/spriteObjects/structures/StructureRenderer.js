import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureRendererClass{

    constructor(structureData, hexMapData, tileData, camera, images){
        this.structureData = structureData
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.camera = camera
        this.utils = new CommonRendererUtilsClass(hexMapData, tileData, camera, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    render = (structure) => {

        let initRotation = this.camera.rotation

        let canvasSize = {
            width: this.hexMapData.size * 2 * structure.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * structure.imageObject.spriteSize.height
        }


        let imageList = []

        if (structure.type == 'bunker' || structure.type == 'resource' || structure.type == 'prop' || structure.type == 'flag') {

            for (let i = 0; i < structure.imageObject[structure.state.current.name].images.length; i++) {
                let imageList = []
                for (let rotation = 0; rotation < 12; rotation++) {
                    if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

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
                            tempCanvas = this.utils.addResourceBar(tempCanvas, structure.imageObject.spriteSize, structure)
                        }

                        if (structure.type == 'bunker') {
                            tempCanvas = this.utils.addHealthBar(tempCanvas, structure.imageObject.spriteSize, structure)
                        }

                        imageList[rotation] = tempCanvas

                    } else {
                        imageList[rotation] = null
                    }
                }

                structure.images[i] = imageList
            }
        } else {

            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')
                    console.log(structure)
                    tempctx.drawImage(structure.imageObject[structure.state.current.name][rotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    if (structure.type == 'resource') {
                        tempCanvas = this.utils.addResourceBar(tempCanvas, structure.imageObject.spriteSize, structure)
                    }

                    if (structure.type == 'bunker') {
                        tempCanvas = this.utils.addHealthBar(tempCanvas, structure.imageObject.spriteSize, structure)
                    }

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }
            structure.images[0] = imageList
        }

        this.renderShadow(structure)


        //crop and darken
        for (let i = 0; i < structure.images[0].length; i++) {

            if (structure.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.camera.rotation)

            let croppedImage = this.utils.cropOutTiles(structure.images[0][i], structure.imageObject.spriteSize, structure.imageObject.spriteOffset, keyObj, rotatedMap)
            let darkenedImage = this.utils.darkenSprite(croppedImage, structure)
            structure.images[0][i] = darkenedImage

        }

        this.camera.rotation = initRotation
    }

    renderShadow = (structure) => {

        let initRotation = this.camera.rotation

        //prerender shadow images
        if (structure.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(structure.imageObject.shadowImages[rotation], structure.imageObject.shadowSize, structure.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            structure.shadowImages[0] = imageList

        }
        
        this.camera.rotation = initRotation

    }

}