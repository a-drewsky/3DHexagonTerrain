import UnitImagesVillagerClass from "./unitImagesVillager";

export default class UnitImagesClass {

    constructor() {

        this.villager = new UnitImagesVillagerClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 1) startGame()
        }

        this.villager.loadImages(testLoaded)
        
    }

}