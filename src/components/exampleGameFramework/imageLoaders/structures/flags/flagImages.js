import DefaultFlagImagesClass from "./defaultFlagImages";

export default class FlagImagesClass {

    constructor() {

        this.default = new DefaultFlagImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 1) startGame()
        }

        this.default.loadImages(testLoaded)
        
    }

}