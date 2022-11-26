export default class CameraDataClass {

    constructor(settings) {

        this.position = {
            x: 0,
            y: 0
        }

        this.movement = {
            up: false,
            left: false,
            down: false,
            right: false
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.zoom = 0;

        this.anchorPoint = null;
        this.mouseAnchorPoint = null;

        this.maxZoom = settings.MAX_ZOOM;
        this.zoomAmount = settings.ZOOM_AMOUNT;
        this.rotationAmount = settings.ROTATION_AMOUNT;
        this.initCameraRotation = settings.INIT_CAMERA_ROTATION;
        this.cameraSpeed = settings.CAMERA_SPEED;

    }

    setPosition = (x, y) => {
        this.position = {
            x: x,
            y: y
        }
    }

    setRotation = (rotation) => {
        this.rotation = rotation;
    }

    setZoom = (zoom) => {
        this.zoom = zoom;
    }

    setAnchorPoint = (x, y) => {
        this.anchorPoint = {
            x: this.position.x,
            y: this.position.y
        }

        this.mouseAnchorPoint = {
            x: x,
            y: y
        }
    }

    clearAnchorPoint = () => {
        this.anchorPoint = null;
        this.mouseAnchorPoint = null;
    }

}