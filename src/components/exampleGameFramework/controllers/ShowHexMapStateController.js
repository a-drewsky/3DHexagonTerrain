export default class ShowHexMapStateControllerClass {

    constructor(gameManager){
        this.gameManager = gameManager;
    }

     mouseDown = (x, y) => {

        //if no ui element clicked (do something)
      //   this.gameManager.objects.objectMap.get('hexMap').object.data.flipped = !this.gameManager.objects.objectMap.get('hexMap').object.data.flipped;

      //   this.gameManager.state.draw();

      this.gameManager.objects.objectMap.get('camera').object.controller.mouseDown(x, y);

      //this.gameManager.state.draw();

     }
  
     mouseUp = (x, y) => {
      this.gameManager.objects.objectMap.get('camera').object.controller.mouseUp();

      //this.gameManager.state.draw();
     }
  
     mouseMove = (x, y) => {
      this.gameManager.objects.objectMap.get('camera').object.controller.mouseMove(x, y);

      //this.gameManager.state.draw();
     }
  
     mouseLeave = (x, y) => {

     }
  
     mouseEnter = (x, y) => {

     }

     keyPress = (key) => {

        //if(key == 'r') this.gameManager.objects.objectMap.get('camera').object.data.rotation++;
        //if(this.gameManager.objects.objectMap.get('camera').object.data.rotation == 12) this.gameManager.objects.objectMap.get('camera').object.data.rotation = 0;
        if(key == 'r') this.gameManager.objects.objectMap.get('hexMap').object.data.rotation++;
        if(this.gameManager.objects.objectMap.get('hexMap').object.data.rotation == 12) this.gameManager.objects.objectMap.get('hexMap').object.data.rotation = 0;
        this.gameManager.objects.objectMap.get('hexMap').object.view.render();
     }

}