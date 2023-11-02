import WoodlandTreesImagesClass from "./woodlandTreesImages";
import TundraTreesImagesClass from "./tundraTreesImages";
import DesertTreesImagesClass from "./desertTreesImages";
import SmallRocksImagesClass from "./smallRocksImages";
import RubblePileImagesClass from "./rubblePileImages";
import EmptyMineImagesClass from "./emptyMineImages";

export default class ModifiersImagesClass {

    constructor() {
        this.loaders = [
            this.woodland_trees = new WoodlandTreesImagesClass(),
            this.tundra_trees = new TundraTreesImagesClass(),
            this.desert_trees = new DesertTreesImagesClass(),
            this.small_rocks = new SmallRocksImagesClass(),
            this.rubble_pile = new RubblePileImagesClass(),
            this.empty_mine = new EmptyMineImagesClass()
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