export default class ShowHexMapStateControllerClass {

    constructor(gameManager){
        this.gameManager = gameManager;
    }

     mouseDown = (x, y) => {

        //if no ui element clicked (do something)
        this.gameManager.objects.objectMap.get('hexMap').object.data.flipped = !this.gameManager.objects.objectMap.get('hexMap').object.data.flipped;

        this.gameManager.state.draw();
     }
  
     mouseUp = (x, y) => {

     }
  
     mouseMove = (x, y) => {

     }
  
     mouseLeave = (x, y) => {

     }
  
     mouseEnter = (x, y) => {

     }

     keyPress = (key) => {

        if(key == 'r') this.gameManager.objects.objectMap.get('camera').object.data.rotation++;
        if(this.gameManager.objects.objectMap.get('camera').object.data.rotation == 12) this.gameManager.objects.objectMap.get('camera').object.data.rotation = 0;

     }

}