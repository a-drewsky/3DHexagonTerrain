export default class ShowHexMapStateControllerClass {

    constructor(gameManager, uiController){
        this.gameManager = gameManager;
        this.uiController = uiController
    }

    click = (x, y) => {



        //if no ui element clicked (do something)
        this.gameManager.objects.objectMap.get('hexMap').object.data.rotation++;
        if(this.gameManager.objects.objectMap.get('hexMap').object.data.rotation == 12) this.gameManager.objects.objectMap.get('hexMap').object.data.rotation = 0;

        this.gameManager.state.setGlobalAttribute('globalAttribute1', null)
        
        console.log(this.gameManager.objects.objectMap.get('hexMap').object.data.rotation)
  
     }

}