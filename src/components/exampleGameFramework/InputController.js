export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;

      this.mouseMoveTimeStamp = 0
      this.mouseMoveTime = 1000 / 60

   }

   uiInput = (input) => {
      switch (input) {
         case 'move':
            this.gameManager.hexMapManager.controller.contextMenu('move');
            return
         case 'mine':
            this.gameManager.hexMapManager.controller.contextMenu('mine');
            return
         case 'attack':
            this.gameManager.hexMapManager.controller.contextMenu('attack');
            return
         case 'capture':
            this.gameManager.hexMapManager.controller.contextMenu('capture');
            return
         case 'cancel':
            this.gameManager.hexMapManager.controller.contextMenu('cancel');
            return
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