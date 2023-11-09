export default class CameraControllerClass {

    constructor(cameraData, canvas) {

        this.cameraData = cameraData
        this.canvas = canvas

    }

    mouseDown = (x, y) => {
        this.cameraData.setClickPos(x, y)
    }

    mouseUp = () => {
        this.cameraData.clearAnchorPoint()
    }

    mouseMove = (x, y) => {

        if (x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height) {
            this.mouseUp()
            return
        }

        if (this.cameraData.clickPos !== null) this.cameraData.setClickMovePos(x, y)

        if (this.cameraData.anchorPoint != null) {
            this.cameraData.setPosition(
                this.cameraData.anchorPoint.x - x + this.cameraData.mouseAnchorPoint.x,
                this.cameraData.anchorPoint.y - y + this.cameraData.mouseAnchorPoint.y
            )
        }

    }

    zoom = (deltaY) => {

        this.cameraData.clearAnchorPoint()
        if ((deltaY > 0 && !this.cameraData.zoomAtMax()) || (deltaY < 0 && !this.cameraData.zoomAtMin())) this.cameraData.zoomIn(deltaY)
        
    }

    rotateRight = () => {
        this.cameraData.rotateRight()
    }

    rotateLeft = () => {
        this.cameraData.rotateLeft()
    }

}