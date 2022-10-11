
//Import Game Manager
import GameManagerClass from './managers/GameManager';

//Import Input Controller
import InputControllerClass from './controllers/InputController';

//Import Loading View
import LoadingViewClass from './uiElements/LoadingElement/LoadingView';

//Import Settings Class
import SettingsClass from './utilities/gameSettings';

export default class GameMainClass {

   constructor(canvas, images, setWinCondition, settings) {

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
      this.images = images;

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.canvas, this.globalSettings, this.images);

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager, this.canvas);

      //Draw interval that is activated when the game finishes loading
      this.updateInterval = null;

      this.fps = 0;
      this.fpsTime = Date.now();

   }


   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.updateInterval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let [key, value] of this.gameManager.objects.objectMap) {
         if(value.clear) value.clear();
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

   keyDown = (key) => {
      this.inputController.keyDown(key);
   }

   keyUp = (key) => {
      this.inputController.keyUp(key);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {
      console.log("start")
      this.gameManager.state.setShowHexMapState();
      this.updateInterval = setInterval(() => {
         this.update()
         this.draw()
      }, 1000 / 60);
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

      this.startGame();

   }
   //END SETUP FUNCTIONS


   //UPDATE FUNCTION
   update = () => {
      //update game objects
      for (let [key, value] of this.gameManager.objects.objectMap) {
         value.object.update(value.state);
      }

      //update UI
      for (let [key, value] of this.gameManager.ui.elementMap) {
         value.element.update(value.state);
      }
   }
   //UPDATE FUNCTION


   //DRAW FUNCTION
   draw = () => {

      this.fps++
      if(Date.now() - this.fpsTime >= 1000){
         console.log(this.fps)
         this.fpsTime = Date.now()
         this.fps = 0
      }

      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //draw game objects
      for (let [key, value] of this.gameManager.objects.objectMap) {
         if (value.state != 'disabled') value.object.draw(value.state);
      }

      //draw UI
      for (let [key, value] of this.gameManager.ui.elementMap) {
         if (value.state != 'disabled') value.element.draw(value.state);
      }

   }
   //END DRAW FUNCTION

}