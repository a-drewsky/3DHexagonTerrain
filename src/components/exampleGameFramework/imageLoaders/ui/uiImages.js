import HealthbarImagesClass from "./healthbarImages";
import ResourceImagesClass from "./resourcebarImages";

export default class UiImagesClass {

    constructor() {
        this.loaders = [
            this.healthbar = new HealthbarImagesClass(),
            this.resourcebar = new ResourceImagesClass()
        ]
    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if (totalLoaded == this.loaders.length) startGame()
        }

        for (let loader of this.loaders) {
            loader.loadImages(testLoaded)
        }

    }

}