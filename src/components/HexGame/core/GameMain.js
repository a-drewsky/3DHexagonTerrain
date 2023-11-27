
import GameManagerClass from './GameManager'
import GameControllerClass from './GameController'
import GameViewClass from './GameView'
import UserConstantsClass from './UserConstants'
import UiInterfaceClass from './UiInterface'
import GameDataClass from './GameData'

export default class GameMainClass {

   constructor (canvas, bgCanvas, images, uiComponents, setUiComponents) {

      //canvas
      this.canvas = canvas
      this.ctx = canvas.getContext("2d")
      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'round'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.lineWidth = 1
      this.ctx.imageSmoothingEnabled = false

      this.bgCanvas = bgCanvas

      //loading
      this.loaded = false

      this.uiComponents = uiComponents
      this.setUiComponents = setUiComponents
      this.uiInterface = new UiInterfaceClass(uiComponents, bgCanvas)

      this.images = images

      this.updateInterval = null

      this.gameData = null
      this.gameView = null
      this.gameManager = null
      this.gameController = null

   }

   startGame = (userConstants) => {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      userConstants = new UserConstantsClass(userConstants)
      this.gameData = new GameDataClass(this.canvas, this.images)
      this.gameManager = new GameManagerClass(this.canvas, this.images, this.uiInterface, this.gameData, userConstants)
      console.log("DONE BUILDING")

      this.gameController = new GameControllerClass(this.gameManager, this.canvas)
      this.gameView = new GameViewClass(this.ctx, this.canvas, this.images, this.uiInterface, this.gameData, userConstants)
      let gameCanvas = this.gameView.initializeCanvas()
      this.gameManager.prerender(gameCanvas)
      this.gameView.initializeCamera()
      console.log("DONE PRERENDERING")

      this.gameManager.setStatePlay()

      this.updateInterval = setInterval(() => {
          this.gameManager.update()
          this.gameView.draw()
          this.setUiComponents(this.uiComponents)
      }, 1000 / 60)

      this.loaded = true

   }

   clear = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      this.gameData = null
      this.gameView = null
      this.gameManager = null
      this.gameController = null
      clearInterval(this.updateInterval)

      this.loaded = false
   }

   mouseDown = (x, y) => {
      this.gameController.mouseDown(x, y)
   }

   mouseUp = (x, y) => {
      this.gameController.mouseUp(x, y)
   }

   mouseMove = (x, y) => {
      this.gameController.mouseMove(x, y)
   }

   mouseWheel = (deltaY) => {
      this.gameController.mouseWheel(deltaY)
   }

   uiInput = (input) => {
      this.gameController.uiInput(input)
   }

}