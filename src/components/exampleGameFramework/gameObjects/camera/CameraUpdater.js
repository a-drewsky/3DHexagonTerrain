export default class CameraUpdaterClass {

    constructor(hexMapData, cameraData, canvas) {
        this.hexMapData = hexMapData
        this.cameraData = cameraData
        this.canvas = canvas
        this.drawCanvas = null

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {
        let zoom = this.cameraData.zoom * this.cameraData.zoomAmount
        if (this.cameraData.position.x + zoom / 2 < 0 - this.canvas.width / 2) this.cameraData.position.x = 0 - this.canvas.width / 2 - zoom / 2
        if (this.cameraData.position.x + zoom / 2 > this.drawCanvas.width - this.canvas.width / 2) this.cameraData.position.x = this.drawCanvas.width - this.canvas.width / 2 - zoom / 2
        if (this.cameraData.position.y + zoom / 2 * this.hexMapData.squish < 0 - this.canvas.height / 2) this.cameraData.position.y = 0 - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish
        if (this.cameraData.position.y + zoom / 2 * this.hexMapData.squish > this.drawCanvas.height - this.canvas.height / 2) this.cameraData.position.y = this.drawCanvas.height - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish
    }

}