
//Import Game Manager
import GameManagerClass from './GameManager';

//Import Input Controller
import InputControllerClass from './InputController';

//Import Settings Class
import SettingsClass from './utilities/gameSettings';

export default class GameMainClass {

   constructor(canvas, images, setWinCondition, setUiComponents, settings) {

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

      this.uiComponents = {
         contextMenu: {
            show: false,
            x: 0,
            y: 0
         }
      }

      this.setUiComponents = setUiComponents

      this.updateUi = () => this.setUiComponents(this.uiComponents)

      //win condition
      this.setWinCondition = setWinCondition;

      //settings
      this.globalSettings = new SettingsClass(settings);

      //Images
      this.images = images;

      //Game manager
      this.gameManager = new GameManagerClass(this.ctx, this.canvas, this.globalSettings, this.images, this.uiComponents, this.updateUi);

      //Input controller
      this.inputController = new InputControllerClass(this.gameManager);

      //Draw interval that is activated when the game finishes loading
      this.updateInterval = null;

      this.fps = 0;
      this.fpsCount = 0;
      this.fpsTime = Date.now();

   }

   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.updateInterval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let [key, value] of this.gameManager.objectMap) {
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
   
   mouseWheel = (deltaY) => {
      this.inputController.mouseWheel(deltaY);
   }

   keyDown = (key) => {
      this.inputController.keyDown(key);
   }

   keyUp = (key) => {
      this.inputController.keyUp(key);
   }

   uiInput = (input) => {
      this.inputController.uiInput(input)
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {
      console.log("start")
      this.gameManager.state = 'play'
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

         setTimeout(() => resolve("done!"), 100)
      });

      await promise;

      //Create game objects
      this.gameManager.createObjects();

      this.startGame();

   }
   //END SETUP FUNCTIONS


   //UPDATE FUNCTION
   update = () => {
      //update game objects
      for (let [key, value] of this.gameManager.objectMap) {
         value.update(value.state);
      }
   }
   //END UPDATE FUNCTION


   //DRAW FUNCTION
   draw = () => {

      this.fps++
      if(Date.now() - this.fpsTime >= 1000){
         this.fpsCount = this.fps
         this.fpsTime = Date.now()
         this.fps = 0
      }

      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //draw game objects
      for (let [key, value] of this.gameManager.objectMap) {
         if (value.state != 'disabled') value.draw(value.state);
      }

      //draw fps
      this.ctx.font = '30px Arial'
      this.ctx.fillStyle = 'yellow'
      this.ctx.fillText(this.fpsCount, this.canvas.width - 100, 100)

   }
   //END DRAW FUNCTION

}