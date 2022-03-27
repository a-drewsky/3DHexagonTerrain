
//Import Game Manager
import GameManagerClass from './managers/GameManager';

//Import Input Controller
import InputControllerClass from './controllers/InputController';

//Import Images Class
import ImagesClass from './GameImages';

//Import Loading View
import LoadingViewClass from './uiElements/LoadingElement/LoadingView';

export default class GameMainClass {

   constructor(canvas, setWinCondition, settings) {
      //canvas
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineCap = 'round';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle'
      this.ctx.lineWidth = canvas.width * 0.005;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings
      this.settings = settings;

      //Images
      this.images = new ImagesClass();

      //intervalsList
      this.intervalsList = {
         state1Interval: this.state1Interval,
         state2Interval: this.state2Interval
      }

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.draw, this.intervalsList);

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager);
   }


   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.gameManager.state.interval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

   click = (x, y) => {
      this.inputController.click(x, y);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {
      this.gameManager.state.setShowHexMapState();
   }


   createGame = () => {

      //Clear previous game
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Show loading screen
      let loadingView = new LoadingViewClass(this.ctx);
      loadingView.draw();

      //Create game objects
      this.gameManager.objects.createObjects(this.settings);

      //Create ui elements
      this.gameManager.ui.createElements(this.canvas);

      //load images and pass start game function
      this.images.loadImages(this.startGame);

   }
   //END SETUP FUNCTIONS


   //DRAW FUNCTION
   draw = () => {
      console.log("draw")

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
   }
   //END DRAW FUNCTION


   //INTERVAL FUNCTIONS
   state1Interval = () => {


   }

   state2Interval = () => {


   }
   //END INTERVAL FUNCTIONS

}