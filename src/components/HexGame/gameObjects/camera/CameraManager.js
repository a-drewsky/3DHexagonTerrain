
export default class CameraManagerClass {

    constructor(hexMapData) {
        this.data = hexMapData.cameraData
    }

    prerender = (hexmapCanvas) => {
        this.data.hexmapCanvas = hexmapCanvas
    }

    update = () => {
        this.data.checkEdges()
        if (this.data.clickDistPassed()) this.data.setAnchorPoint()
    }

}