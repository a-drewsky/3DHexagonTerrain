import BunkerImagesClass from "./bunkerImages";
import MainBaseImagesClass from "./mainBaseImages";

export default class BaseImagesClass {

    constructor() {

        this.bunker = new BunkerImagesClass()
        this.mainbase = new MainBaseImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 2) startGame()
        }

        this.bunker.loadImages(testLoaded)
        this.mainbase.loadImages(testLoaded)
        
    }

}