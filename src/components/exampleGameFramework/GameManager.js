import HexMapClass from "./gameObjects/hexMap/HexMap"
import UiControllerClass from "./UiController";

export default class GameManagerClass {

    constructor(ctx, canvas, bgCanvas, settings, images, uiComponents, updateUi) {

        this.ctx = ctx;
        this.canvas = canvas;

        this.settings = settings;
        this.images = images;

        this.hexMap = null

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

    createGame = () => {

        this.hexMap = new HexMapClass(
            this.ctx,
            this.canvas,
            this.images,
            this.settings,
            this.uiController,
            this.state,
        )

        this.hexMap.build(this.settings.MAP_SIZE.q, this.settings.MAP_SIZE.r, this.settings.MAP_SIZE.size);
        console.log("DONE BUILDING")
        this.hexMap.prerender();
        console.log("DONE PRERENDERING")

    }

    clear = () => {
        clearInterval(this.updateInterval);

        this.hexMap.clear();
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

        this.hexMap.update();
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
        if (this.hexMap.state != 'disabled') this.hexMap.draw();

        //draw fps
        this.ctx.font = '30px Arial'
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillText(this.fpsCount, this.canvas.width - 100, 100)

    }

    setStatePause = () => {
        this.state.current = this.state.pause
        this.uiController.setPauseMenu(true)
    }

    setStatePlay = () => {
        this.state.current = this.state.play
        this.uiController.setPauseMenu(false)
    }

}