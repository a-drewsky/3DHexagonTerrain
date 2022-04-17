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

    }

    mouseEnter = (x, y) => {

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

            // Q: (Math.sqrt(3) * x * this.hexGroupDiceMap.squish - Math.sqrt(3) * this.hexGroupDiceMap.X * this.hexGroupDiceMap.squish - y + this.hexGroupDiceMap.Y)  /  (3 * this.hexGroupDiceMap.squish * this.hexGroupDiceMap.size),
            // R: (y - this.hexGroupDiceMap.Y) * (1 / this.hexGroupDiceMap.squish) * (2 / 3) / this.hexGroupDiceMap.size


            // Q: (Math.sqrt(3) / 3 * (x - this.hexGroupDiceMap.X) - 1 / 3 * ((y - this.hexGroupDiceMap.Y) * (1 / this.hexGroupDiceMap.squish))) / this.hexGroupDiceMap.size,
            // R: (y - this.hexGroupDiceMap.Y) * (1 / this.hexGroupDiceMap.squish) * (2 / 3) / this.hexGroupDiceMap.size

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

            // let xOffset = this.hexMap.VecQ.x * keyObj.Q + this.hexMap.VecR.x * keyObj.R;
            // let yOffset = this.hexMap.VecQ.y * keyObj.Q * this.hexMap.squish + this.hexMap.VecR.y * keyObj.R * this.hexMap.squish;


            // let s = -q - r;
            // let angle = rotation * 15;
            // if (rotation % 2 == 1) angle -= 15;

            // let newQ = q;
            // let newR = r;
            // let newS = s;

            // for (let i = 0; i < angle; i += 30) {
            //    q = -newR;
            //    r = -newS;
            //    s = -newQ;

            //    newQ = q;
            //    newR = r;
            //    newS = s;
            // }

            // return {
            //    q: newQ,
            //    r: newR
            // }


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