import HexMapManagerClass from "./gameObjects/hexMap/HexMapManager";
import UiControllerClass from "./UiController";

export default class GameManagerClass {

    constructor(ctx, canvas, bgCanvas, images, uiComponents, updateUi) {

        this.ctx = ctx;
        this.canvas = canvas;

        this.images = images;

        this.hexMapManager = null

        this.updateUi = updateUi
        this.uiController = new UiControllerClass(uiComponents, bgCanvas)

        //create all state objects like this
        this.state = {
            play: 'play',
            pause: 'pause',
            current: 'prerendering'
        }
        this.state.current = this.state.play

        //Draw interval that is activated when the game finishes loading
        this.updateInterval = null;

        this.fps = 0;
        this.fpsCount = 0;
        this.fpsTime = Date.now();
    }

    createGame = (userConstants) => {

        this.hexMapManager = new HexMapManagerClass(
            this.ctx,
            this.canvas,
            this.images,
            userConstants,
            this.uiController,
            this.state,
        )

        this.hexMapManager.build(userConstants.MAP_SIZE);
        console.log("DONE BUILDING")
        this.hexMapManager.prerender();
        console.log("DONE PRERENDERING")

    }

    clear = () => {
        if(this.hexMapManager) this.hexMapManager.clear()
        this.hexMapManager = null
        clearInterval(this.updateInterval);
    }

    startGame = () => {
        console.log("start")
        this.setStatePlay()
        this.updateInterval = setInterval(() => {
            this.update()
            this.draw()
            this.updateUi()
        }, 1000 / 60);
    }

    update = () => {
        if (this.state.current != this.state.play) return

        this.hexMapManager.update();
    }

    draw = () => {

        this.fps++
        if (Date.now() - this.fpsTime >= 1000) {
            this.fpsCount = this.fps
            this.fpsTime = Date.now()
            this.fps = 0
        }

        //clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw game objects
        if (this.hexMapManager.state != 'disabled') this.hexMapManager.draw();

        //draw fps
        this.ctx.font = '30px Arial'
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillText(this.fpsCount, this.canvas.width - 100, 100)

    }

    setStatePause = () => {
        console.log("pause")
        this.state.current = this.state.pause
        this.uiController.setPauseMenu(true)
    }

    setStatePlay = () => {
        console.log("play")
        this.state.current = this.state.play
        this.uiController.setPauseMenu(false)
        this.uiController.setEndGameMenu(false)
    }

}