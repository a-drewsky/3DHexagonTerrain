
const MAX_ZOOM = 100;

const ZOOM_AMOUNT = 50;

const ROTATION_AMOUNT = 2

const INIT_CAMERA_ROTATION = 1 //0 is pointy

export default class CameraDataClass {

    constructor(hexMapData, canvas) {

        this.hexMapData = hexMapData
        this.canvas = canvas
        this.drawCanvas = null

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

        this.clickDist = 20
        this.clickPos = null
        this.clickMovePos = null

        this.maxZoom = MAX_ZOOM;
        this.zoomAmount = ZOOM_AMOUNT;
        this.rotationAmount = ROTATION_AMOUNT;
        this.initCameraRotation = INIT_CAMERA_ROTATION;

    }

    onScreenCheck = (spritePos, spriteSize) => {

        let zoom = this.zoomAmount * this.zoom

        let position = this.position

        //check if sprite is on screen
        if (spritePos.x < position.x - spriteSize.width
            || spritePos.y < position.y - spriteSize.height
            || spritePos.x > position.x + this.canvas.width + zoom
            || spritePos.y > position.y + this.canvas.height + zoom * (this.canvas.height / this.canvas.width)) return false;

        return true
    }

    setCameraPos = (anchorX, anchorY) => {
        this.setPosition(anchorX, anchorY)
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
            x: this.clickMovePos.x,
            y: this.clickMovePos.y
        }
    }

    clearAnchorPoint = () => {
        this.anchorPoint = null;
        this.mouseAnchorPoint = null;
    }

}