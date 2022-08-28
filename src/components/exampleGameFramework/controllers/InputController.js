import UIControllerClass from './UIController';
import ShowHexMapStateControllerClass from './ShowHexMapStateController';

export default class InputControllerClass {

   constructor(gameManager, canvas, settings) {
      this.gameManager = gameManager;
      this.uiController = new UIControllerClass(this.gameManager);

      this.canvas = canvas;

      //State controller List
      this.showHexMapStateController = new ShowHexMapStateControllerClass(this.gameManager, canvas, settings);

   }


   mouseDown = (x, y) => {

      //check ui clicked
      let uiElementClicked = this.uiController.click(x, y);

      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseDown(x, y);
            break;
         default:
            break;
      }
   }

   mouseUp = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseUp(x, y);
            break;
         default:
            break;
      }
   }

   mouseMove = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseMove(x, y);
            break;
         default:
            break;
      }
   }

   mouseLeave = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseLeave(x, y);
            break;
         default:
            break;
      }
   }

   mouseEnter = (x, y) => {
      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseEnter(x, y);
            break;
         default:
            break;
      }
   }

   mouseWheel = (deltaY) => {
      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.mouseWheel(deltaY);
            break;
         default:
            break;
      }
   }

   keyDown = (key) => {
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.keyDown(key.toLowerCase());
            break;
         default:
            break;
      }
   }

   keyUp = (key) => {
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.keyUp(key.toLowerCase());
            break;
         default:
            break;
      }
   }

}