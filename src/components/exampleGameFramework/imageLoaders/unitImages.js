import UnitImagesExampleUnitClass from "./unitImagesExampleUnit";
import UnitImagesVillagerClass from "./unitImagesVillager";

export default class UnitImagesClass {

    constructor() {

        this.exampleUnit = new UnitImagesExampleUnitClass()
        this.villager = new UnitImagesVillagerClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 2) startGame()
        }

        this.exampleUnit.loadImages(testLoaded)
        this.villager.loadImages(testLoaded)
        
    }

}