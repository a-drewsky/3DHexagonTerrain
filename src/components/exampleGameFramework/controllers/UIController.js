export default class UIControllerClass {

    constructor(gameManager){
        this.gameManager = gameManager;
    }

    click = (x, y) => {
        for (let [key, value] of this.gameManager.ui.elementMap) {
           if (value.state == this.gameManager.ui.elementStates.active && value.element.controller.click(x, y)) {
  
              value.data.setState(this.gameManager.ui.elementStates.clicked);
  
              let clickTimer = setInterval(() => {
                 if(value.state == this.gameManager.ui.elementStates.clicked) value.element.data.setState(this.gameManager.ui.elementStates.active);
                 clearInterval(clickTimer);
                 this.gameManager.state.draw();
              }, 200)
  
              this.gameManager.state.draw();
              return {
                 key: key,
                 value: value.element.controller.click(x, y)
              }
           }
        }
        return null;
     }
}