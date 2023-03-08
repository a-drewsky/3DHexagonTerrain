import HealthbarImagesClass from "./healthbarImages";
import ResourceImagesClass from "./resourcebarImages";

export default class UiImagesClass {

    constructor() {

        this.healthbar = new HealthbarImagesClass()
        this.resourcebar = new ResourceImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 2) startGame()
        }

        this.healthbar.loadImages(testLoaded)
        this.resourcebar.loadImages(testLoaded)
        
    }

}