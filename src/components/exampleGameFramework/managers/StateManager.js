import GameStateClass from "../GameState";
export default class StateManagerClass {

   constructor(drawMethod, intervalsList, gameObjectManager, uiManager){
      this.gameObjectManager = gameObjectManager;
      this.uiManager = uiManager;

      //create gloabl attributes
      this.globalAttributes = {
         globalAttribute1: null
      }

      this.draw = drawMethod;

      //create game states list
      this.gameStates = {

         //current game state
         current: null,

         //game state list
         showHexMapState: new GameStateClass(
            'showHexMapState',
            {
               attribute1: null
            }
         )
      }

   }

   //SET STATE HELPER METHODS

   setGameState = (state) => {
      this.gameStates.current = this.gameStates[state];
   }

   setGameStateInterval = () => {
      this.interval = setInterval(this.gameStates.current.interval, this.gameStates.current.intervalFrequency);
   }

   setGlobalAttribute = (attribute, value) => {
      this.globalAttributes[attribute] = value;
      this.draw();
   }

   setGlobalAttributes = (attributeValuePairs) => {
      for(let i=0; i<attributeValuePairs.length; i++){
         this.globalAttributes[attributeValuePairs[i][0]] = attributeValuePairs[i][1];
      }
      this.draw();
   }

   setGameStateAttribute = (attribute, value) => {
      this.gameStates.current[attribute] = value;
      this.draw();
   }

   setGameStateAttributes = (attributeValuePairs) => {
      for(let i=0; i<attributeValuePairs.length; i++){
         this.gameStates.current[attributeValuePairs[i][0]] = attributeValuePairs[i][1];
      }
      this.draw();
   }

   //END SET STATE HELPER METHODS


   //SET STATE METHODS

   setShowHexMapState = () => {
      
      //clear the current interval
      clearInterval(this.interval);

      //set the current gamestate
      this.setGameState('showHexMapState');

      //set global states
      

      //set gamestate attributes
      

      //set ui elements
      

      //redraw the canvas
      this.draw();
   }
   
   //END SET STATE METHODS

}