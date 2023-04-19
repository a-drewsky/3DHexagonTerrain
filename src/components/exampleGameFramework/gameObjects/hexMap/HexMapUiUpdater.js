import CollisionClass from "../../utilities/collision"

export default class HexMapUiUpdaterClass {

    constructor(hexMapData, camera, canvas, uiController) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.canvas = canvas
        this.drawCanvas = null

        this.uiController = uiController

        this.collision = new CollisionClass()

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {
        this.uiController.setResourceBar(this.hexMapData.resources)

        let zoom = this.camera.data.zoom * this.camera.data.zoomAmount

        //set background
        let scale = this.canvas.width / (this.canvas.width + zoom)
        this.uiController.setBgCanvasPosition(this.camera.data.position.x * -1 * scale, this.camera.data.position.y * -1 * scale)
        this.uiController.setBgCanvasZoom(this.drawCanvas.width * scale, this.drawCanvas.height * scale)

    }

}