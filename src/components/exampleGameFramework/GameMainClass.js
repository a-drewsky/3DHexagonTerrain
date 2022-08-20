
//Import Game Manager
import GameManagerClass from './managers/GameManager';

//Import Input Controller
import InputControllerClass from './controllers/InputController';

//Import Images Class
import ImagesClass from './GameImages';

//Import Loading View
import LoadingViewClass from './uiElements/LoadingElement/LoadingView';

//Import Settings Class
import SettingsClass from './GlobalSettings';

export default class GameMainClass {

   constructor(canvas, setWinCondition, settings) {

      //canvas
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle'
      this.ctx.lineWidth = 1;

      //loading
      this.loaded = false;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings
      this.globalSettings = new SettingsClass(settings);

      //Images
      this.images = new ImagesClass();

      //intervalsList
      this.intervalsList = {
         state1Interval: this.state1Interval,
         state2Interval: this.state2Interval
      }

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.canvas, this.draw, this.intervalsList, this.globalSettings);

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager, this.canvas, this.globalSettings);

      //Draw interval that is activated when the game finishes loading
      this.drawInterval = null;

   }


   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.gameManager.state.interval);
      clearInterval(this.drawInterval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let [key, value] of this.gameManager.objects.objectMap) {
         if(value.state != 'disabled' && value.object.view.renderMap) value.object.view.renderMap.clear();
         if(value.state != 'disabled' && value.object.view.rotatedMap) value.object.view.rotatedMap.clear();
         if(value.state != 'disabled' && value.object.view1 && value.object.view1.renderMap) value.object.view1.renderMap.clear();
         if(value.state != 'disabled' && value.object.view2 && value.object.view2.renderMap) value.object.view2.renderMap.clear();
         if(value.state != 'disabled' && value.object.view1 && value.object.view1.rotatedMap) value.object.view1.rotatedMap.clear();
         if(value.state != 'disabled' && value.object.view2 && value.object.view2.rotatedMap) value.object.view2.rotatedMap.clear();
      }
   }

   mouseDown = (x, y) => {
      this.inputController.mouseDown(x, y);
   }

   mouseUp = (x, y) => {
      this.inputController.mouseUp(x, y);
   }

   mouseMove = (x, y) => {
      this.inputController.mouseMove(x, y);
   }

   mouseLeave = (x, y) => {
      this.inputController.mouseLeave(x, y);
   }

   mouseEnter = (x, y) => {
      this.inputController.mouseEnter(x, y);
   }

   mouseWheel = (deltaY) => {
      this.inputController.mouseWheel(deltaY);
   }

   keyPress = (key) => {
      this.inputController.keyPress(key);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {

      console.log(this.gameManager.objects.objectMap.get('hexMap').object)

      this.gameManager.objects.objectMap.get('hexMap').object.view.exampleImage = this.images.exampleImage
      this.gameManager.objects.objectMap.get('hexMap').object.view.initialize()

      console.log("start")
      this.gameManager.state.setShowHexMapState();
      this.drawInterval = setInterval(this.draw, 1000 / 60);
      this.loaded = true;
   }


   createGame = async () => {

      let promise = new Promise((resolve, reject) => {
         //Clear previous game
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

         //Show loading screen
         let loadingView = new LoadingViewClass(this.ctx);
         loadingView.draw();

         setTimeout(() => resolve("done!"), 100)
      });

      await promise;

      //Create game objects
      this.gameManager.objects.createObjects();

      //Create ui elements
      this.gameManager.ui.createElements();

      //load images and pass start game function
      this.images.loadImages(this.startGame);

   }
   //END SETUP FUNCTIONS


   //DRAW FUNCTION
   draw = () => {

      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //draw game objects
      for (let [key, value] of this.gameManager.objects.objectMap) {
         if (value.state != 'disabled') value.object.view.draw(value.state);
      }

      //draw UI
      for (let [key, value] of this.gameManager.ui.elementMap) {
         if (value.state != 'disabled') value.element.view.draw(value.state);
      }

   }
   //END DRAW FUNCTION




   //INTERVAL FUNCTIONS
   state1Interval = () => {


   }

   state2Interval = () => {


   }
   //END INTERVAL FUNCTIONS

}