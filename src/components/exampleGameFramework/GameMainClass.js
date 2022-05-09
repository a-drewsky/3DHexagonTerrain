
//Import Game Manager
import GameManagerClass from './managers/GameManager';

//Import Input Controller
import InputControllerClass from './controllers/InputController';

//Import Images Class
import ImagesClass from './GameImages';

//Import Loading View
import LoadingViewClass from './uiElements/LoadingElement/LoadingView';

//Import Settings Class
import SettingsClass from './Settings';

export default class GameMainClass {

   constructor(canvas, setWinCondition, settings) {
      //canvas
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle'
      this.ctx.lineWidth = 3;

      //loading
      this.loaded = false;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings
      this.settings = new SettingsClass(settings);

      //Images
      this.images = new ImagesClass();

      //intervalsList
      this.intervalsList = {
         state1Interval: this.state1Interval,
         state2Interval: this.state2Interval
      }

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.canvas, this.draw, this.intervalsList, this.settings);

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager, this.canvas, this.settings);

      this.drawInterval = setInterval(this.draw, 1000/60);
      //this.fpsInterval = setInterval(() => {console.log("sec")}, 1000);
   }


   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.gameManager.state.interval);
      clearInterval(this.drawInterval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      this.gameManager.state.setShowHexMapState();
      this.loaded = true;
   }


   createGame = () => {

      //Clear previous game
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Show loading screen
      let loadingView = new LoadingViewClass(this.ctx);
      loadingView.draw();

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
         if(value.state != 'disabled') value.object.view.draw(value.state);
      }
      
      //draw UI
      for (let [key, value] of this.gameManager.ui.elementMap) {
         if(value.state != 'disabled') value.element.view.draw(value.state);
      }

      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(this.canvas.width/2 - 1, this.canvas.height/2 - 1, 2, 2)

      //console.log("draw")
   }
   //END DRAW FUNCTION

   


   //INTERVAL FUNCTIONS
   state1Interval = () => {


   }

   state2Interval = () => {


   }
   //END INTERVAL FUNCTIONS

}