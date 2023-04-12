export default class CommonViewUtilsClass {

    constructor(camera){
        this.camera = camera
    }

    onScreenCheck = (spritePos, spriteSize, canvasDims) => {

        let zoom = this.camera.zoomAmount * this.camera.zoom

        let position = this.camera.position

        //check if sprite is on screen
        if (spritePos.x < position.x - spriteSize.width
            || spritePos.y < position.y - spriteSize.height
            || spritePos.x > position.x + canvasDims.width + zoom
            || spritePos.y > position.y + canvasDims.height + zoom * (canvasDims.height / canvasDims.width)) return false;

        return true
    }

}