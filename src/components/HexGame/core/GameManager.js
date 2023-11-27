import HexMapManagerClass from '../managers/HexMapManager'

export default class GameManagerClass {

    constructor(canvas, images, uiInterface, gameData, userConstants) {

        this.canvas = canvas
        this.images = images

        this.hexMapManager = new HexMapManagerClass(canvas, images, uiInterface, gameData)
        this.hexMapManager.build(userConstants.MAP_SIZE)

        this.uiInterface = uiInterface
        this.gameData = gameData

        //create all state objects like this
        this.state = {
            play: 'play',
            pause: 'pause',
        }
        this.state.current = this.state.play

    }

    prerender = (hexMapCanvas) => {
        this.hexMapManager.prerender(hexMapCanvas)
    }

    update = () => {
        if (this.state.current !== this.state.play) return

        this.hexMapManager.update()
    }

    setStatePause = () => {
        console.log("pause")
        this.state.current = this.state.pause
        this.uiInterface.setPauseMenu(true)
    }

    setStatePlay = () => {
        console.log("play")
        this.state.current = this.state.play
        this.uiInterface.setPauseMenu(false)
        this.uiInterface.setEndGameMenu(false)
    }

}