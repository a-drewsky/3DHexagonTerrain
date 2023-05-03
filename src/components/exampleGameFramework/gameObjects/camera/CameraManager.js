import CameraControllerClass from "./CameraController";
import CollisionClass from "../../utilities/collision"

export default class CameraManagerClass {

    constructor(hexMapData, cameraData, canvas){
        this.hexMapData = hexMapData
        this.data = cameraData
        this.controller = new CameraControllerClass(this.data, canvas)

        this.collision = new CollisionClass()
    }

    prerender = (drawCanvas) => {
        this.data.drawCanvas = drawCanvas
    }

    update = () => {
        let zoom = this.data.zoom * this.data.zoomAmount
        if (this.data.position.x + zoom / 2 < 0 - this.data.canvas.width / 2) this.data.position.x = 0 - this.data.canvas.width / 2 - zoom / 2
        if (this.data.position.x + zoom / 2 > this.data.drawCanvas.width - this.data.canvas.width / 2) this.data.position.x = this.data.drawCanvas.width - this.data.canvas.width / 2 - zoom / 2
        if (this.data.position.y + zoom / 2 * this.hexMapData.squish < 0 - this.data.canvas.height / 2) this.data.position.y = 0 - this.data.canvas.height / 2 - zoom / 2 * this.hexMapData.squish
        if (this.data.position.y + zoom / 2 * this.hexMapData.squish > this.data.drawCanvas.height - this.data.canvas.height / 2) this.data.position.y = this.data.drawCanvas.height - this.data.canvas.height / 2 - zoom / 2 * this.hexMapData.squish

        //update mouse
        if (this.hexMapData.curState() != 'selectAction' && this.data.clickPos !== null && this.collision.vectorDist(this.data.clickPos, this.data.clickMovePos) > this.data.clickDist) {
            this.data.setAnchorPoint();
            this.data.clickPos = null
            this.data.clickMovePos = null
        }
    }

}