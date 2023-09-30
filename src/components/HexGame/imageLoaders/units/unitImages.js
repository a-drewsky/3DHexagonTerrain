import UnitImagesVillagerClass from "./unitImagesVillager";
import UnitImagesMountainRangerClass from "./unitImagesMountainRanger";
import UnitImagesImperialSoldierClass from "./unitImagesImperialSoldier";

export default class UnitImagesClass {

    constructor() {
        this.loaders = [
            this.villager = new UnitImagesVillagerClass(),
            this.mountainRanger = new UnitImagesMountainRangerClass(),
            this.imperialSoldier = new UnitImagesImperialSoldierClass()
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