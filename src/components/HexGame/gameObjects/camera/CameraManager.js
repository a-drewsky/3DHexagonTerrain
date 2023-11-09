import CameraControllerClass from "./CameraController";

export default class CameraManagerClass {

    constructor(hexMapData, canvas) {
        this.mapData = hexMapData.mapData
        this.data = hexMapData.cameraData
        this.controller = new CameraControllerClass(this.data, canvas)
    }

    prerender = (drawCanvas) => {
        this.data.drawCanvas = drawCanvas
    }

    update = () => {
        this.data.checkEdges()
        if (this.data.clickDistPassed()) this.data.setAnchorPoint()
    }

}