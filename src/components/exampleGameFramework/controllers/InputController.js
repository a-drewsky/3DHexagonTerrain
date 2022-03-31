import UIControllerClass from './UIController';
import ShowHexMapStateControllerClass from './ShowHexMapStateController';

export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;
      this.uiController = new UIControllerClass(this.gameManager);

      //State controller List
      this.showHexMapStateController = new ShowHexMapStateControllerClass(this.gameManager, this.uiController);

   }

   click = (x, y) => {

      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'showHexMapState':
            this.showHexMapStateController.click(x, y);
            break;
         case 'stateTwo':
            this.exampleState2Controller.click(x, y);
            break;
         default:
            break;
      }

   }

}