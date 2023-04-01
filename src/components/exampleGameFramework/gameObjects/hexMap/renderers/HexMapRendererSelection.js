import HexMapRendererUtilsClass from "../utils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../utils/HexMapCommonUtils"

export default class HexMapRendererSelectionsClass {

    constructor(hexMapData, camera, settings, images) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images.highlight
        this.utils = new HexMapRendererUtilsClass(hexMapData, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()

    }

    renderSelectionImage = (tileObj, selection) => {

        //assign image
        let sprite = this.images[selection]

        let canvasSize = {
            width: this.hexMapData.size * 2,
            height: this.hexMapData.size * 2
        }

        //create canvas
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvasSize.width
        tempCanvas.height = canvasSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(sprite, 0, 0, tempCanvas.width, tempCanvas.height)

        if(tileObj.selectionImages[selection] === undefined) tileObj.selectionImages[selection] = []

        tileObj.selectionImages[selection][this.camera.rotation] = tempCanvas

        //crop image
        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
        let keyObj = this.commonUtils.rotateTile(tileObj.position.q, tileObj.position.r, this.camera.rotation)

        let croppedImage = this.utils.cropOutTiles(tileObj.selectionImages[selection][this.camera.rotation], { width: 1, height: 1 }, { x: 0, y: 0 }, keyObj, rotatedMap)
        tileObj.selectionImages[selection][this.camera.rotation] = croppedImage

    }

}