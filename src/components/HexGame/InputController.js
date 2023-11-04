export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;

      this.mouseMoveTimeStamp = 0
      this.mouseMoveTime = 1000 / 60

   }

   uiInput = (input) => {
      switch (input) {
         case 'rotateLeft':
            this.gameManager.hexMapManager.controller.rotateLeft()
            return
         case 'rotateRight':
            this.gameManager.hexMapManager.controller.rotateRight()
            return
         case 'addUnit':
            this.gameManager.hexMapManager.controller.selectCard()
            return
         case 'switchView':
            if (this.gameManager.userConstants.DEBUG) this.gameManager.hexMapManager.switchView()
            return
         case 'pause':
            this.gameManager.setStatePause()
            return
         case 'play':
            this.gameManager.setStatePlay()
            return
         case 'card_0':
            this.gameManager.hexMapManager.controller.selectCard(0)
            return
         case 'card_1':
            this.gameManager.hexMapManager.controller.selectCard(1)
            return
         case 'card_2':
            this.gameManager.hexMapManager.controller.selectCard(2)
            return
         case 'card_3':
            this.gameManager.hexMapManager.controller.selectCard(3)
            return
         case 'card_4':
            this.gameManager.hexMapManager.controller.selectCard(4)
            return
         case 'use_card':
            this.gameManager.hexMapManager.controller.useCard()
            return
         case 'scrap_card':
            this.gameManager.hexMapManager.controller.scrapCard()
            return

      }
   }

   mouseDown = (x, y) => {

      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMapManager.controller.mouseDown(x, y);
            break;
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMapManager.controller.mouseUp();
            break;
      }
   }

   mouseMove = (x, y) => {

      if (Date.now() - this.mouseMoveTimeStamp < this.mouseMoveTime) return

      this.mouseMoveTimeStamp = Date.now()

      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMapManager.controller.mouseMove(x, y);
            break;
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMapManager.controller.zoom(deltaY);
            break;
      }
   }

}