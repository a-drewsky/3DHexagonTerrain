export default class CameraControllerClass {

    constructor(cameraData, canvas) {

        this.cameraData = cameraData;
        this.canvas = canvas;

    }

    mouseDown = (x, y) => {
        this.cameraData.clickPos = { x: x, y: y }
        this.cameraData.clickMovePos = { x: x, y: y }
    }

    mouseUp = () => {
        this.cameraData.clearAnchorPoint();
    }

    mouseMove = (x, y) => {

        if (this.cameraData.clickMovePos !== null) {
            this.cameraData.clickMovePos.x = x
            this.cameraData.clickMovePos.y = y
        }

        if (this.cameraData.anchorPoint == null) return;

        if (x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height) {
            this.mouseUp()
            return;
        }

        this.cameraData.setPosition(
            this.cameraData.anchorPoint.x - x + this.cameraData.mouseAnchorPoint.x,
            this.cameraData.anchorPoint.y - y + this.cameraData.mouseAnchorPoint.y
        );
    }

    keyDown = (key) => {
        this.cameraData.clearAnchorPoint();

        switch (key) {
            case 'e':
                this.cameraData.rotation++;
                break;
            case 'q':
                this.cameraData.rotation--;
                break;
            case 'w':
                this.cameraData.movement.up = true;
                break;
            case 'a':
                this.cameraData.movement.left = true;
                break;
            case 's':
                this.cameraData.movement.down = true;
                break;
            case 'd':
                this.cameraData.movement.right = true;
                break;
        }

        if (this.cameraData.rotation >= 12) this.cameraData.rotation = 0 + (this.cameraData.rotation - 12);
        if (this.cameraData.rotation <= -1) this.cameraData.rotation = 11 + (this.cameraData.rotation + 1);

        this.cameraData.setVelocity();
    }

    keyUp = (key) => {
        this.cameraData.clearAnchorPoint();

        switch (key) {
            case 'w':
                this.cameraData.movement.up = false;
                break;
            case 'a':
                this.cameraData.movement.left = false;
                break;
            case 's':
                this.cameraData.movement.down = false;
                break;
            case 'd':
                this.cameraData.movement.right = false;
                break;
        }

        this.cameraData.setVelocity();
    }

    zoom = (deltaY) => {
        let zoomAmount = this.cameraData.zoomAmount

        let updatePosition = false

        this.cameraData.clearAnchorPoint();
        if ((deltaY > 0 && this.cameraData.zoom < this.cameraData.maxZoom) || (deltaY < 0 && this.cameraData.zoom > 0)) {
            this.cameraData.zoom += deltaY / 100
            updatePosition = true;
        }

        if (updatePosition) {
            //Set camera position
            this.cameraData.setCameraPos(
                this.cameraData.position.x - zoomAmount * deltaY / 200,
                this.cameraData.position.y - zoomAmount * deltaY / 200 * (this.canvas.height / this.canvas.width)
            );
        }
    }

    rotateRight = () => {
        this.cameraData.clearAnchorPoint();
        this.cameraData.rotation += this.cameraData.rotationAmount
        if (this.cameraData.rotation >= 12) this.cameraData.rotation = 0 + (this.cameraData.rotation - 12);
        this.cameraData.setVelocity();
    }

    rotateLeft = () => {
        this.cameraData.clearAnchorPoint();
        this.cameraData.rotation -= this.cameraData.rotationAmount
        if (this.cameraData.rotation <= -1) this.cameraData.rotation = 11 + (this.cameraData.rotation + 1);
        this.cameraData.setVelocity();
    }

}