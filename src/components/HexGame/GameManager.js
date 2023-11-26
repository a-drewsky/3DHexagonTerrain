import HexMapManagerClass from './managers/HexMapManager'

export default class GameManagerClass {

    constructor(ctx, canvas, images, uiController) {

        this.ctx = ctx
        this.canvas = canvas
        this.images = images

        this.hexMapManager = null

        //create all state objects like this
        this.state = {
            play: 'play',
            pause: 'pause',
        }
        this.state.current = this.state.play

        this.uiController = uiController

        this.fps = 0
        this.fpsCount = 0
        this.fpsTime = Date.now()

    }

    createGame = (userConstants) => {

        this.hexMapManager = new HexMapManagerClass(this.canvas, this.images, this.uiController)

        this.hexMapManager.build(userConstants.MAP_SIZE)

    }

    prerender = (hexMapCanvas) => {
        this.hexMapManager.prerender(hexMapCanvas)
    }

    clear = () => {
        if(this.hexMapManager) this.hexMapManager.clear()
        this.hexMapManager = null
        clearInterval(this.updateInterval)
    }

    update = () => {
        if (this.state.current !== this.state.play) return

        this.hexMapManager.update()
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