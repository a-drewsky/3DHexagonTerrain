export default class CameraControllerClass {

    constructor(cameraData, canvas) {

        this.cameraData = cameraData;

        this.canvas = canvas;

    }

    mouseDown = (x, y) => {
        this.cameraData.setAnchorPoint(x, y);
    }

    mouseUp = () => {
        this.cameraData.clearAnchorPoint();
    }

    mouseMove = (x, y) => {
        if (this.cameraData.anchorPoint == null) return;

        this.cameraData.setPosition(
            this.cameraData.anchorPoint.x - x + this.cameraData.mouseAnchorPoint.x,
            this.cameraData.anchorPoint.y - y + this.cameraData.mouseAnchorPoint.y
        );
    }

    keyPress = (key) => {
        this.cameraData.rotation++;
        if (this.cameraData.rotation == 12) this.cameraData.rotation = 0;
    }

    rotateCamera(anchorX, anchorY) {
       
        this.cameraData.setPosition(anchorX, anchorY)

    }

}