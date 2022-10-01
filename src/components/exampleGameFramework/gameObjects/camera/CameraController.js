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

    mouseWheel = (deltaY) => {
        this.cameraData.clearAnchorPoint();
        if (deltaY > 0) {
            if (this.cameraData.zoom < this.cameraData.maxZoom) this.cameraData.zoom++;
        } else {
            if (this.cameraData.zoom > -this.cameraData.maxZoom) this.cameraData.zoom--;
        }

    }

    keyDown = (key) => {
        this.cameraData.clearAnchorPoint();

        switch(key){
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

        console.log(this.cameraData.rotation)

        this.setVelocity();
    }

    keyUp = (key) => {
        this.cameraData.clearAnchorPoint();

        switch(key){
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
        
        this.setVelocity();
    }

    setVelocity = () => {
        let movement = {
            up : this.cameraData.movement.up == true ? 1 : 0,
            left : this.cameraData.movement.left == true ? 1 : 0,
            down : this.cameraData.movement.down == true ? 1 : 0,
            right : this.cameraData.movement.right == true ? 1 : 0,
        }
        this.cameraData.velocity.x = movement.right - movement.left;
        this.cameraData.velocity.y = movement.down - movement.up;
        if(Math.abs(this.cameraData.velocity.x) == 1 && Math.abs(this.cameraData.velocity.y) == 1){
            this.cameraData.velocity.x *= Math.sqrt(2)/2
            this.cameraData.velocity.y *= Math.sqrt(2)/2
        }
        console.log(this.cameraData.velocity)
    }

    //change to setPosition
    rotateCamera(anchorX, anchorY) {

        this.cameraData.setPosition(anchorX, anchorY)

    }

}