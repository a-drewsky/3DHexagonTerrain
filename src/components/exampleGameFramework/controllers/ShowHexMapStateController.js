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

    mouseLeave = (x, y) => {
        this.gameManager.objects.objectMap.get('camera').object.controller.mouseUp();
    }

    mouseEnter = (x, y) => {

    }

    mouseWheel = (deltaY) => {
        let centerPos = {
            x: this.gameManager.objects.objectMap.get('camera').object.data.position.x + this.canvas.width / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.x,
            y: this.gameManager.objects.objectMap.get('camera').object.data.position.y + this.canvas.height / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.y
        }


        let centerHexPos;

        let size = this.gameManager.objects.objectMap.get('hexMap').object.data.size;
        let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;

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
        console.log(centerPos)


        this.gameManager.objects.objectMap.get('camera').object.controller.mouseWheel(deltaY);

        //set size based on zoom level
        let newSize = this.gameManager.objects.objectMap.get('hexMap').object.data.baseSize - this.gameManager.objects.objectMap.get('camera').object.data.zoom;

        this.gameManager.objects.objectMap.get('hexMap').object.data.size = newSize;

        this.gameManager.objects.objectMap.get('hexMap').object.data.VecQ = { x: Math.sqrt(3) * newSize, y: 0 }
        this.gameManager.objects.objectMap.get('hexMap').object.data.VecR = { x: Math.sqrt(3) / 2 * newSize, y: 3 / 2 * newSize }

        this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecQ = { x: 3 / 2 * newSize, y: Math.sqrt(3) / 2 * newSize }
        this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecR = { x: 0, y: Math.sqrt(3) * newSize }


        if (this.gameManager.objects.objectMap.get('camera').object.data.rotation % 2 == 1) {

            let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecQ;
            let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecR;

            this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.x,
                vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.y
            );
        } else {

            let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.VecQ;
            let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.VecR;

            let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;
            let newPos = {
                x: vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r,
                y:  vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish
            }

            console.log(newPos)

            this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                newPos.x - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.x,
                newPos.y - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.y
            );

        }


        this.gameManager.objects.objectMap.get('hexMap').object.view.render();
    }

    keyPress = (key) => {

        if (key == 'r') {
            this.gameManager.objects.objectMap.get('hexMap').object.controller.keyPress(key);
            this.gameManager.objects.objectMap.get('hexMap').object.view.render();
        }

        if (key == 't') {

            let centerPos = {
                x: this.gameManager.objects.objectMap.get('camera').object.data.position.x + this.canvas.width / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.x,
                y: this.gameManager.objects.objectMap.get('camera').object.data.position.y + this.canvas.height / 2 - this.gameManager.objects.objectMap.get('hexMap').object.data.y
            }


            let centerHexPos;

            let size = this.gameManager.objects.objectMap.get('hexMap').object.data.size;
            let squish = this.gameManager.objects.objectMap.get('hexMap').object.data.squish;

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


            this.gameManager.objects.objectMap.get('camera').object.controller.keyPress(key);



            if (this.gameManager.objects.objectMap.get('camera').object.data.rotation % 2 == 1) {

                let vecQ = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecQ;
                let vecR = this.gameManager.objects.objectMap.get('hexMap').object.data.flatTopVecR;

                this.gameManager.objects.objectMap.get('camera').object.controller.rotateCamera(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.x,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.y
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.x,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.gameManager.objects.objectMap.get('hexMap').object.data.y
                );

            }




            this.gameManager.objects.objectMap.get('hexMap').object.view.render();

        }



    }

}