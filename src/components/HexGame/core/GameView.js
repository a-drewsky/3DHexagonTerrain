import HexMapViewClass from "../views/HexMapView"

export default class GameViewClass {

    constructor(ctx, canvas, images, uiInterface, gameData, userConstants){
        
        this.ctx = ctx
        this.canvas = canvas
        this.images = images
        this.uiInterface = uiInterface

        this.hexMapView = new HexMapViewClass(ctx, canvas, gameData, userConstants, images, uiInterface)

        this.fps = 0
        this.fpsCount = 0
        this.fpsTime = Date.now()

    }

    initializeCanvas = () => {
        return this.hexMapView.initializeCanvas()
    }

    initializeCamera = () => {
        this.hexMapView.initializeCamera()
    }

    draw = () => {

        this.fps++
        if (Date.now() - this.fpsTime >= 1000) {
            this.fpsCount = this.fps
            this.fpsTime = Date.now()
            this.fps = 0
        }

        //clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        //draw game objects
        this.hexMapView.draw()

        //draw fps
        this.ctx.font = '30px Arial'
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillText(this.fpsCount, this.canvas.width - 100, 100)

    }

}