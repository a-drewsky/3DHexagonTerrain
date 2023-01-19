export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;

      this.mouseMoveTimeStamp = 0
      this.mouseMoveTime = 1000 / 60

   }

   uiInput = (input) => {
      switch (input) {
         case 'move':
            this.gameManager.objectMap.get('hexMap').controller.moveUnit();
            return
         case 'mine':
            this.gameManager.objectMap.get('hexMap').controller.mineOre();
            return
         case 'cancel':
            this.gameManager.objectMap.get('hexMap').controller.cancelMovement();
            return
         case 'rotateLeft':
            this.gameManager.objectMap.get('hexMap').controller.rotateLeft()
            return
         case 'rotateRight':
            this.gameManager.objectMap.get('hexMap').controller.rotateRight()
            return
         case 'addUnit':
            this.gameManager.objectMap.get('hexMap').controller.addUnit()
            return
         case 'switchView':
            if (this.gameManager.objectMap.get('hexMap').settings.DEBUG) this.gameManager.objectMap.get('hexMap').switchView()
            return

      }
   }

   mouseDown = (x, y) => {

      //State controller functions
      switch (this.gameManager.state) {
         case 'play':
            // this.gameManager.objectMap.get('camera').controller.mouseDown(x, y);
            this.gameManager.objectMap.get('hexMap').controller.click(x, y);
            break;
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state) {
         case 'play':
            this.gameManager.objectMap.get('camera').controller.mouseUp();
            this.gameManager.objectMap.get('hexMap').controller.mouseUp();
            break;
      }
   }

   mouseMove = (x, y) => {

      if (Date.now() - this.mouseMoveTimeStamp < this.mouseMoveTime) return

      this.mouseMoveTimeStamp = Date.now()

      //State controller functions
      switch (this.gameManager.state) {
         case 'play':
            this.gameManager.objectMap.get('camera').controller.mouseMove(x, y);
            this.gameManager.objectMap.get('hexMap').controller.setHover(x, y);
            break;
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state) {
         case 'play':
            this.gameManager.objectMap.get('camera').controller.zoom(deltaY);
            break;
      }
   }

}