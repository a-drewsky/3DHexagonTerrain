import UnitImagesVillagerClass from "./unitImagesVillager";
import UnitImagesMountainRangerClass from "./unitImagesMountainRanger";

export default class UnitImagesClass {

    constructor() {
        this.loaders = [
            this.villager = new UnitImagesVillagerClass(),
            this.mountainRanger = new UnitImagesMountainRangerClass()
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