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
         case 'cancel':
            this.gameManager.objectMap.get('hexMap').controller.cancelMovement();
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

   keyDown = (key) => {
      switch (this.gameManager.state) {
         case 'play':
            if (key == 'e') {

               this.gameManager.objectMap.get('hexMap').controller.rotateRight()

            }

            if (key == 'q') {

               this.gameManager.objectMap.get('hexMap').controller.rotateLeft()

            }

            //   if (key == 'w' || key == 'a' || key == 's' || key == 'd') {
            //       this.gameManager.objectMap.get('camera').controller.keyDown(key);
            //   }

            if (key == 'v') {
               if (this.gameManager.objectMap.get('hexMap').settings.DEBUG) {
                  this.gameManager.objectMap.get('hexMap').switchView()
               }
            }

            if (key == 'u') {
               this.gameManager.objectMap.get('hexMap').controller.addUnit()
            }
            break;
      }
   }

   keyUp = (key) => {
      switch (this.gameManager.state) {
         case 'play':
            if (key == 'w' || key == 'a' || key == 's' || key == 'd') {
               // this.gameManager.objectMap.get('camera').controller.keyUp(key);
            }
            break;
      }
   }

}