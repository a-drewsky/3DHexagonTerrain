import HexMapClass from "./gameObjects/hexMap/HexMap"
import HexMapDebugSmoothingClass from "./gameObjects/hexMap/debug/HexMapDebugSmoothing";


export default class GameManagerClass {

    constructor(ctx, canvas, bgCanvas, settings, images, uiComponents, updateUi) {

        this.ctx = ctx;
        this.canvas = canvas;
        this.bgCanvas = bgCanvas

        this.settings = settings;
        this.images = images;

        this.hexMap = null

        this.setBgCanvas = {
            size: this.setBgCanvasSize,
            zoom: this.setBgCanvasZoom,
            position: this.setBgCanvasPosition,
            image: this.setBgCanvasImage
        }

        //create all state objects like this
        this.state = {
            play: 'play',
            pause: 'pause',
            current: 'prerendering'
        }
        this.state.current = this.state.play

        this.uiComponents = uiComponents
        this.updateUi = updateUi

        //Draw interval that is activated when the game finishes loading
        this.updateInterval = null;

        this.fps = 0;
        this.fpsCount = 0;
        this.fpsTime = Date.now();
    }

    createGame = () => {

        if (this.settings.DEBUG) {
            this.hexMap = new HexMapDebugSmoothingClass(
                this.ctx,
                this.canvas,
                this.images,
                this.settings
            )
        } else {
            this.hexMap = new HexMapClass(
                this.ctx,
                this.canvas,
                this.images,
                this.settings,
                this.uiComponents,
                this.state,
                this.setBgCanvas,
                this.setBgCanvas
            )
        }

        this.hexMap.build(this.settings.MAP_SIZE.q, this.settings.MAP_SIZE.r, this.settings.MAP_SIZE.size);
        console.log("DONE BUILDING")
        this.hexMap.prerender();
        console.log("DONE PRERENDERING")

    }

    setBgCanvasZoom = (width, height) => {
        this.uiComponents.bgCanvas.width = width
        this.uiComponents.bgCanvas.height = height
    }

    setBgCanvasSize = (width, height) => {
        this.bgCanvas.width = width
        this.bgCanvas.height = height
    }

    setBgCanvasImage = (canvas) => {
        let bgctx = this.bgCanvas.getContext('2d')
        bgctx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height)
        bgctx.drawImage(canvas, 0, 0, this.bgCanvas.width, this.bgCanvas.height)
    }

    setBgCanvasPosition = (x, y) => {
        this.uiComponents.bgCanvas.x = x
        this.uiComponents.bgCanvas.y = y
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
        this.uiComponents.pauseMenu.show = true
        this.updateUi()
    }

    setStatePlay = () => {
        this.state.current = this.state.play
        this.uiComponents.pauseMenu.show = false
        this.updateUi()
    }

}