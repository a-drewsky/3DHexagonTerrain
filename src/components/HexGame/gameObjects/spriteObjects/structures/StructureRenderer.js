import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import StatusBarRendererClass from "../common/StatusBarRenderer"
import ShadowRendererClass from "../common/ShadowRenderer"

export default class StructureRendererClass {

    constructor(hexMapData, images) {
        this.structureData = hexMapData.structureData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData
        this.images = images

        this.StatusBarRenderer = new StatusBarRendererClass(this.mapData, this.images)
        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()
        this.shadowRenderer = new ShadowRendererClass(hexMapData, images)
    }

    renderAll = (structure) => {
        this.renderSprite(structure)
        this.renderShadow(structure)
    }

    renderSprite = (structure) => {

        if(!this.commonUtils.checkStateImages(structure)){
            structure.images = null
            return
        }

        let initRotation = this.cameraData.rotation

        for (let i in structure.imageObject[structure.curState()].images) {
            let imageList = []
            for (let rotation = 0; rotation < 6; rotation++) {
                
                let sprite = structure.sprite(rotation)

                let canvasSize = {
                    width: this.mapData.size * 2 * sprite.size.w,
                    height: this.mapData.size * 2 * sprite.size.h
                }

                this.cameraData.rotation = rotation
                let rotatedMap = this.tileData.rotatedMapList[rotation]
                let keyObj = this.commonUtils.rotateTile(structure.position, this.cameraData.rotation)

                //create canvas
                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = canvasSize.width
                tempCanvas.height = canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(sprite.image, 0, 0, tempCanvas.width, tempCanvas.height)
                imageList[rotation] = tempCanvas

                if (structure.type == 'resource') {
                    this.StatusBarRenderer.addResourceBar(imageList[rotation], structure)
                }

                if (structure.type == 'bunker') {
                    this.StatusBarRenderer.addHealthBar(imageList[rotation], structure)
                }


                this.utils.cropOutTiles(imageList[rotation], sprite.offset, keyObj, rotatedMap)
                this.utils.darkenSprite(imageList[rotation], structure)

            }

            structure.images[i] = imageList
        }

        this.cameraData.rotation = initRotation
    }

    renderShadow = (structure) => {

        this.shadowRenderer.renderAllShadows(structure, structure.position)

    }

}