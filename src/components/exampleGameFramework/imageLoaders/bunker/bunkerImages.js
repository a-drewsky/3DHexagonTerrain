import DefaultBunkerImagesClass from "./defaultBunkerImages";
import MainBunkerImagesClass from "./mainBunkerImages";

export default class BunkerImagesClass {

    constructor() {

        this.bunker = new DefaultBunkerImagesClass()
        this.main_bunker = new MainBunkerImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 2) startGame()
        }

        this.bunker.loadImages(testLoaded)
        this.main_bunker.loadImages(testLoaded)
        
    }

}