import WoodlandTreesImagesClass from "./woodlandTreesImages";
import TundraTreesImagesClass from "./tundraTreesImages";
import DesertTreesImagesClass from "./desertTreesImages";
import SmallRocksImagesClass from "./smallRocksImages";
import RubblePileImagesClass from "./rubblePileImages";
import EmptyMineImagesClass from "./emptyMineImages";

export default class ModifiersImagesClass {

    constructor() {

        this.woodland_trees = new WoodlandTreesImagesClass()
        this.tundra_trees = new TundraTreesImagesClass()
        this.desert_trees = new DesertTreesImagesClass()
        this.small_rocks = new SmallRocksImagesClass()
        this.rubble_pile = new RubblePileImagesClass()
        this.empty_mine = new EmptyMineImagesClass()

        this.size = {
            width: 1,
            height: 2
        }
        this.offset = {
            x: 0,
            y: 1
        }
        this.singleImageSize = {
            width: 1,
            height: 1.5
        }
        this.singleImageOffset = {
            x: 0,
            y: 0.5
        }
        this.modifierSize = {
            width: 1,
            height: 1.5
        }
        this.shadowSpriteSize = {
            width: 1,
            height: 1.5
        }
        this.shadowSize = {
            width: 2,
            height: 2
        }
        this.shadowOffset = {
            x: 0.5,
            y: 1
        }

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 6) startGame()
        }

        this.woodland_trees.loadImages(testLoaded)
        this.tundra_trees.loadImages(testLoaded)
        this.desert_trees.loadImages(testLoaded)
        this.small_rocks.loadImages(testLoaded)
        this.rubble_pile.loadImages(testLoaded)
        this.empty_mine.loadImages(testLoaded)
        
    }

}