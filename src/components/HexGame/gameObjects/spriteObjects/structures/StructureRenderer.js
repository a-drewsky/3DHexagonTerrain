import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class StructureRendererClass {

    constructor(hexMapData, images) {
        this.structureData = hexMapData.structureData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.utils = new CommonRendererUtilsClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    renderAll = (structure) => {
        this.renderSprite(structure)
        this.renderShadow(structure)
    }

    renderSprite = (structure) => {

        let initRotation = this.cameraData.rotation

        for (let i = 0; i < structure.imageObject[structure.state.current.name].images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 6; rotation++) {
                
                let sprite = structure.sprite(rotation)

                let canvasSize = {
                    width: this.mapData.size * 2 * sprite.size.w,
                    height: this.mapData.size * 2 * sprite.size.h
                }

                this.cameraData.rotation = rotation;
                let rotatedMap = this.tileData.rotatedMapList[rotation]
                let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.cameraData.rotation)

                //create canvas
                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = canvasSize.width
                tempCanvas.height = canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(sprite.image, 0, 0, tempCanvas.width, tempCanvas.height)
                imageList[rotation] = tempCanvas

                if (structure.type == 'resource') {
                    this.utils.addResourceBar(imageList[rotation], structure)
                }

                if (structure.type == 'bunker') {
                    this.utils.addHealthBar(imageList[rotation], structure)
                }


                this.utils.cropOutTiles(imageList[rotation], sprite.offset, keyObj, rotatedMap)
                this.utils.darkenSprite(imageList[rotation], structure)

            }

            structure.images[i] = imageList
        }

        this.cameraData.rotation = initRotation
    }

    renderShadow = (structure) => {

        let initRotation = this.cameraData.rotation

        if (!structure.imageObject.shadow) return

        //prerender shadow images
        let imageList = []
        for (let rotation = 0; rotation < 6; rotation++) {

            let shadowImage = this.images.shadows[structure.imageObject.shadow][rotation]

            this.cameraData.rotation = rotation;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(structure.position.q, structure.position.r, this.cameraData.rotation)


            let croppedImage = this.utils.cropStructureShadow(shadowImage.image, shadowImage.size, shadowImage.offset, keyObj, rotatedMap)

            imageList[rotation] = croppedImage

        }

        structure.shadowImages[0] = imageList

        this.cameraData.rotation = initRotation

    }

}