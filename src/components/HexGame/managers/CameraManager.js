
export default class CameraManagerClass {

    constructor(gameData) {
        this.data = gameData.cameraData
    }

    prerender = (hexmapCanvas) => {
        this.data.hexmapCanvas = hexmapCanvas
    }

    update = () => {
        this.data.checkEdges()
        if (this.data.clickDistPassed()) this.data.setAnchorPoint()
    }

}