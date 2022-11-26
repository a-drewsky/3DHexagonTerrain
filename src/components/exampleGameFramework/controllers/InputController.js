import ShowHexMapStateControllerClass from './ShowHexMapStateController';

export default class InputControllerClass {

   constructor(gameManager, canvas) {
      this.gameManager = gameManager;

      this.canvas = canvas;

      //State controller List
      this.showHexMapStateController = new ShowHexMapStateControllerClass(this.gameManager, canvas);

   }


   mouseDown = (x, y) => {

      //State controller functions
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseDown(x, y);
            break;
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseUp(x, y);
            break;
      }
   }

   mouseMove = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseMove(x, y);
            break;
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseWheel(deltaY);
            break;
      }
   }

   keyDown = (key) => {
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.keyDown(key.toLowerCase());
            break;
      }
   }

   keyUp = (key) => {
      switch (this.gameManager.state.gameState) {
         case 'showHexMapState':
            this.showHexMapStateController.keyUp(key.toLowerCase());
            break;
      }
   }

}