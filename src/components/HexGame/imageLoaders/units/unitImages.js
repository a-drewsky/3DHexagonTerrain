import UnitImagesVillagerClass from "./unitImagesVillager";
import UnitImagesMountainRangerClass from "./unitImagesMountainRanger";
import UnitImagesImperialSoldierClass from "./unitImagesImperialSoldier";

import ImageLoaderUtilsClass from "../utils/imageLoaderUtils";

export default class UnitImagesClass {

    constructor() {
        this.loaders = [
            this.villager = new UnitImagesVillagerClass(),
            this.mountainRanger = new UnitImagesMountainRangerClass(),
            this.imperialSoldier = new UnitImagesImperialSoldierClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages
    }


}