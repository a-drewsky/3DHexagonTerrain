import CollisionClass from "../../utilities/collision"

export default class CameraUpdaterClass {

    constructor(hexMapData, data, controller, canvas) {
        this.hexMapData = hexMapData
        this.data = data
        this.controller = controller
        this.canvas = canvas
        this.drawCanvas = null

        this.collision = new CollisionClass()

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {
        let zoom = this.data.zoom * this.data.zoomAmount
        if (this.data.position.x + zoom / 2 < 0 - this.canvas.width / 2) this.data.position.x = 0 - this.canvas.width / 2 - zoom / 2
        if (this.data.position.x + zoom / 2 > this.drawCanvas.width - this.canvas.width / 2) this.data.position.x = this.drawCanvas.width - this.canvas.width / 2 - zoom / 2
        if (this.data.position.y + zoom / 2 * this.hexMapData.squish < 0 - this.canvas.height / 2) this.data.position.y = 0 - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish
        if (this.data.position.y + zoom / 2 * this.hexMapData.squish > this.drawCanvas.height - this.canvas.height / 2) this.data.position.y = this.drawCanvas.height - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish

        //update mouse
        if (this.hexMapData.state.current != 'selectAction' && this.data.clickPos !== null && this.collision.vectorDist(this.data.clickPos, this.data.clickMovePos) > this.data.clickDist) {
            this.data.setAnchorPoint();
            this.data.clickPos = null
            this.data.clickMovePos = null
        }
    }

}