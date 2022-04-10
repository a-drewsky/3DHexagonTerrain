export default class CameraControllerClass {

    constructor(cameraData) {

        this.cameraData = cameraData;

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
            this.cameraData.anchorPoint.x + x - this.cameraData.mouseAnchorPoint.x,
            this.cameraData.anchorPoint.y + y - this.cameraData.mouseAnchorPoint.y
        );
    }

    keyPress = (key) => {

    }

}