export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;

      this.mouseMoveTimeStamp = 0
      this.mouseMoveTime = 1000 / 60

   }

   uiInput = (input) => {
      switch (input) {
         case 'move':
            this.gameManager.hexMap.controller.contextMenu('move');
            return
         case 'mine':
            this.gameManager.hexMap.controller.contextMenu('mine');
            return
         case 'attack':
            this.gameManager.hexMap.controller.contextMenu('attack');
            return
         case 'capture':
            this.gameManager.hexMap.controller.contextMenu('capture');
            return
         case 'cancel':
            this.gameManager.hexMap.controller.contextMenu('cancel');
            return
         case 'rotateLeft':
            this.gameManager.hexMap.controller.rotateLeft()
            return
         case 'rotateRight':
            this.gameManager.hexMap.controller.rotateRight()
            return
         case 'addUnit':
            this.gameManager.hexMap.controller.selectCard()
            return
         case 'switchView':
            if (this.gameManager.userConstants.DEBUG) this.gameManager.hexMap.switchView()
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
            this.gameManager.hexMap.controller.mouseDown(x, y);
            break;
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMap.controller.mouseUp();
            break;
      }
   }

   mouseMove = (x, y) => {

      if (Date.now() - this.mouseMoveTimeStamp < this.mouseMoveTime) return

      this.mouseMoveTimeStamp = Date.now()

      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMap.controller.mouseMove(x, y);
            break;
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state.current) {
         case 'play':
            this.gameManager.hexMap.controller.zoom(deltaY);
            break;
      }
   }

}