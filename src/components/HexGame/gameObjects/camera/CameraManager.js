
export default class CameraManagerClass {

    constructor(hexMapData) {
        this.data = hexMapData.cameraData
    }

    prerender = (drawCanvas) => {
        this.data.drawCanvas = drawCanvas
    }

    update = () => {
        this.data.checkEdges()
        if (this.data.clickDistPassed()) this.data.setAnchorPoint()
    }

}