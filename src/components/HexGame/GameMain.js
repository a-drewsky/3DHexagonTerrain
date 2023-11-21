
import GameManagerClass from './GameManager'
import GameControllerClass from './GameController'
import GameViewClass from './GameView'
import UserConstantsClass from './UserConstants'
import UiControllerClass from './controllers/UiController'

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
      this.uiController = new UiControllerClass(uiComponents, setUiComponents, bgCanvas)

      this.images = images

      this.updateInterval = null

      this.gameManager = new GameManagerClass(this.ctx, canvas, images, this.uiController)

      this.gameView = new GameViewClass(this.ctx, canvas, images, this.uiController)

      this.gameController = new GameControllerClass(this.gameManager)

   }

   startGame = (userConstants) => {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.gameManager.createGame(new UserConstantsClass(userConstants))
      console.log("DONE BUILDING")

      this.gameView.initialize(this.gameManager, userConstants)
      let gameCanvas = this.gameView.initializeCanvas()
      this.gameManager.prerender(gameCanvas)
      console.log("DONE PRERENDERING")
      
      this.gameView.initializeCamera()

      this.gameManager.setStatePlay()

      this.updateInterval = setInterval(() => {
          this.gameManager.update()
          this.gameView.draw()
          this.uiController.updateUiComponents()
      }, 1000 / 60)

      this.loaded = true

   }

   clear = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.gameManager.clear()
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