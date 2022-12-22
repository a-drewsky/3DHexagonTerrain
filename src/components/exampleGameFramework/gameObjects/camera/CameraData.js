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

    setCameraPos = (anchorX, anchorY) => {
        this.setPosition(anchorX, anchorY)
    }

    rotateCameraRight = () => {
        this.clearAnchorPoint();
        this.rotation++
        if (this.rotation >= 12) this.rotation = 0 + (this.rotation - 12);
        this.setVelocity();
    }

    rotateCameraLeft = () => {
        this.clearAnchorPoint();
        this.rotation--
        if (this.rotation <= -1) this.rotation = 11 + (this.rotation + 1);
        this.setVelocity();
    }

    setVelocity = () => {
        let movement = {
            up : this.movement.up == true ? 1 : 0,
            left : this.movement.left == true ? 1 : 0,
            down : this.movement.down == true ? 1 : 0,
            right : this.movement.right == true ? 1 : 0,
        }
        this.velocity.x = movement.right - movement.left;
        this.velocity.y = movement.down - movement.up;
        if(Math.abs(this.velocity.x) == 1 && Math.abs(this.velocity.y) == 1){
            this.velocity.x *= Math.sqrt(2)/2
            this.velocity.y *= Math.sqrt(2)/2
        }
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