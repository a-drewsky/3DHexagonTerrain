
import HexMapControllerClass from "../controllers/HexMapController"

export default class GameControllerClass {

   constructor(gameManager, canvas) {
      this.gameManager = gameManager
      this.hexmapManager = gameManager.hexMapManager 
      this.hexmapController = new HexMapControllerClass(this.hexmapManager.data, canvas)

      this.mouseMoveTimeStamp = 0
      this.mouseMoveTime = 1000 / 60

   }

   uiInput = (input) => {
      switch (input) {
         case 'rotateLeft':
            this.hexmapController.rotateLeft()
            return
         case 'rotateRight':
            this.hexmapController.rotateRight()
            return
         case 'addUnit':
            this.hexmapController.selectCard()
            return
         case 'pause':
            this.gameManager.setStatePause()
            return
         case 'play':
            this.gameManager.setStatePlay()
            return
         case 'card_0':
            this.hexmapController.selectCard(0)
            return
         case 'card_1':
            this.hexmapController.selectCard(1)
            return
         case 'card_2':
            this.hexmapController.selectCard(2)
            return
         case 'card_3':
            this.hexmapController.selectCard(3)
            return
         case 'card_4':
            this.hexmapController.selectCard(4)
            return
         case 'use_card':
            this.hexmapController.useCard()
            return
         case 'scrap_card':
            this.hexmapController.scrapCard()
            return
         default:
            return

      }
   }

   mouseDown = (x, y) => {

      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.hexmapController.mouseDown(x, y)
            return
         default:
            return
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.hexmapController.mouseUp(x, y)
            return
         default:
            return
      }
   }

   mouseMove = (x, y) => {

      if (Date.now() - this.mouseMoveTimeStamp < this.mouseMoveTime) return

      this.mouseMoveTimeStamp = Date.now()

      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.hexmapController.mouseMove(x, y)
            return
         default:
            return
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.hexmapController.zoom(deltaY)
            return
         default:
            return
      }
   }

}