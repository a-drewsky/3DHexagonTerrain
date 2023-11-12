
//Import Game Manager
import GameManagerClass from './GameManager';

//Import Input Controller
import InputControllerClass from './InputController';

//Import Settings Class
import UserConstantsClass from './UserConstants';

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

      this.updateUi = () => {
         this.setUiComponents(this.uiComponents)
      }

      //Images
      this.images = images;

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.canvas, this.bgCanvas, this.images, this.uiComponents, this.updateUi)

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager)

   }

   clear = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.gameManager.clear()
      this.loaded = false
   }

   mouseDown = (x, y) => {
      this.inputController.mouseDown(x, y)
   }

   mouseUp = (x, y) => {
      this.inputController.mouseUp(x, y)
   }

   mouseMove = (x, y) => {
      this.inputController.mouseMove(x, y)
   }

   mouseWheel = (deltaY) => {
      this.inputController.mouseWheel(deltaY)
   }

   keyDown = (key) => {

   }

   keyUp = (key) => {

   }

   uiInput = (input) => {
      this.inputController.uiInput(input)
   }


   startGame = (userConstants) => {

      //Clear previous game
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.gameManager.createGame(new UserConstantsClass(userConstants))

      this.gameManager.startGame()

      this.loaded = true

   }

}