export default class ShowHexMapStateControllerClass {

    constructor(gameManager, canvas) {
        this.gameManager = gameManager;
        this.canvas = canvas;
    }

    mouseDown = (x, y) => {

        //if no ui element clicked (do something)
        //   this.gameManager.objects.objectMap.get('hexMap').object.data.flipped = !this.gameManager.objects.objectMap.get('hexMap').object.data.flipped;

        //   this.gameManager.state.draw();

        this.gameManager.objects.objectMap.get('camera').object.controller.mouseDown(x, y);
        this.gameManager.objects.objectMap.get('hexMap').object.controller.click(x, y);

        //this.gameManager.state.draw();

    }

    mouseUp = (x, y) => {
        this.gameManager.objects.objectMap.get('camera').object.controller.mouseUp();

        //this.gameManager.state.draw();
    }

    mouseMove = (x, y) => {
        this.gameManager.objects.objectMap.get('camera').object.controller.mouseMove(x, y);

        //this.gameManager.state.draw();
    }

    mouseWheel = (deltaY) => {

        let zoomAmount = this.gameManager.objects.objectMap.get('camera').object.data.zoomAmount

        let zoom = this.gameManager.objects.objectMap.get('camera').object.controller.mouseWheel(deltaY);

        if (zoom) {
            //Set camera position
            this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                this.gameManager.objects.objectMap.get('camera').object.data.position.x - zoomAmount * deltaY / 200,
                this.gameManager.objects.objectMap.get('camera').object.data.position.y - zoomAmount * deltaY / 200 * (this.canvas.height/this.canvas.width)
            );
        }


    }

    keyDown = (key) => {

        if (key == 'e') {

            let zoomAmount = this.gameManager.objects.objectMap.get('camera').object.data.zoomAmount
            let zoomLevel = this.gameManager.objects.objectMap.get('camera').object.data.zoom

            let zoom = zoomLevel * zoomAmount

            for (let i = 0; i < this.gameManager.objects.objectMap.get('camera').object.data.rotationAmount; i++) {
                let centerHexPos = this.getCenterHexPos();

                this.gameManager.objects.objectMap.get('camera').object.controller.keyDown(key);

                //Set camera position
                let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;

                if (this.gameManager.objects.objectMap.get('camera').object.data.rotation % 2 == 1) {

                    let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecQ;
                    let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecR;

                    this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                        vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).x - zoom/2,
                        vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
                    );

                } else {

                    centerHexPos.s = -centerHexPos.q - centerHexPos.r
                    let newR = centerHexPos.r;
                    let newS = centerHexPos.s;

                    centerHexPos.q = -newR;
                    centerHexPos.r = -newS;

                    let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.VecQ;
                    let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.VecR;

                    this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                        vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).x - zoom/2,
                        vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
                    );

                }
            }

        }

        if (key == 'q') {

            let zoomAmount = this.gameManager.objects.objectMap.get('camera').object.data.zoomAmount
            let zoomLevel = this.gameManager.objects.objectMap.get('camera').object.data.zoom

            let zoom = zoomLevel * zoomAmount

            for (let i = 0; i < this.gameManager.objects.objectMap.get('camera').object.data.rotationAmount; i++) {
                let centerHexPos = this.getCenterHexPos();

                this.gameManager.objects.objectMap.get('camera').object.controller.keyDown(key);

                //Set camera position
                let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;

                if (this.gameManager.objects.objectMap.get('camera').object.data.rotation % 2 == 0) {

                    let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.VecQ;
                    let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.VecR;

                    this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                        vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).x - zoom/2,
                        vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
                    );

                } else {

                    centerHexPos.s = -centerHexPos.r - centerHexPos.q
                    let newQ = centerHexPos.q;
                    let newS = centerHexPos.s;

                    centerHexPos.r = -newQ;
                    centerHexPos.q = -newS;

                    let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecQ;
                    let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecR;

                    this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                        vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).x - zoom/2,
                        vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
                    );

                }
            }

        }

        if (key == 'w' || key == 'a' || key == 's' || key == 'd') {
            this.gameManager.objects.objectMap.get('camera').object.controller.keyDown(key);
        }

        if (key == 'v') {
            if(this.gameManager.objects.objectMap.get('hexMap').object.settings.DEBUG){
                this.gameManager.objects.objectMap.get('hexMap').object.switchView()
            }
        }

        if (key == 'u') {
            this.gameManager.objects.objectMap.get('hexMap').object.controller.addUnit()
        }
    }

    keyUp = (key) => {
        if (key == 'w' || key == 'a' || key == 's' || key == 'd') {
            this.gameManager.objects.objectMap.get('camera').object.controller.keyUp(key);
        }
    }

    getCenterHexPos = () => {

        let zoomAmount = this.gameManager.objects.objectMap.get('camera').object.data.zoomAmount
        let zoomLevel = this.gameManager.objects.objectMap.get('camera').object.data.zoom
        
        let size = this.gameManager.objects.objectMap.get('hexMap').object.data.size;
        let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;

        let zoom = zoomLevel * zoomAmount

        let centerPos = {
            x: this.gameManager.objects.objectMap.get('camera').object.data.position.x + zoom/2 + this.canvas.width / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).x,
            y: this.gameManager.objects.objectMap.get('camera').object.data.position.y + zoom/2 * (this.canvas.height/this.canvas.width) + this.canvas.height / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.posMap.get(this.gameManager.objects.objectMap.get('camera').object.data.rotation).y
        }


        let centerHexPos;


        if (this.gameManager.objects.objectMap.get('camera').object.data.rotation % 2 == 0) {
            centerHexPos = {
                q: (Math.sqrt(3) / 3 * centerPos.x - 1 / 3 * (centerPos.y * (1 / squish))) / size,
                r: ((centerPos.y * (1 / squish)) * (2 / 3)) / size
            }
        } else {
            centerHexPos = {
                q: ((2 / 3) * centerPos.x) / size,
                r: ((-1 / 3) * centerPos.x + Math.sqrt(3) / 3 * (centerPos.y * (1 / squish))) / size
            }
        }

        return centerHexPos;
    }

}