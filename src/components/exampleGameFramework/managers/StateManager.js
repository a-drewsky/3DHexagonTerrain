import GameStateClass from "../utilities/gameState";
export default class StateManagerClass {

   constructor(gameObjectManager, uiManager){
      this.gameObjectManager = gameObjectManager;
      this.uiManager = uiManager;

      this.gameState = null;

   }


   //SET STATE METHODS

   setShowHexMapState = () => {

      //set gamestate
      this.gameState = 'showHexMapState'

      //set gameobject states
      this.gameObjectManager.objectMap.get('camera').state = 'active'
      this.gameObjectManager.objectMap.get('hexMap').state = 'active'

      //set ui elements states
      

   }
   
   //END SET STATE METHODS

}