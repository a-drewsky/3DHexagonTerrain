import UnitImagesExampleUnitClass from "./unitImagesExampleUnit";

export default class UnitImagesClass {

    constructor() {

        this.exampleUnit = new UnitImagesExampleUnitClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 1) startGame()
        }

        this.exampleUnit.loadImages(testLoaded)
        
    }

}