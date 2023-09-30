import CopperMineImagesClass from "./copperMineImages";
import GoldMineImagesClass from "./goldMineImages";
import IronMineImagesClass from "./ironMineImages";
import RubyMineImagesClass from "./rubyMineImages";
import AmethystMineImagesClass from "./amethystMineImages";

export default class ResourceImagesClass {

    constructor() {

        this.copper_mine = new CopperMineImagesClass()
        this.gold_mine = new GoldMineImagesClass()
        this.iron_mine = new IronMineImagesClass()
        this.ruby_mine = new RubyMineImagesClass()
        this.amethyst_mine = new AmethystMineImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 5) startGame()
        }

        this.copper_mine.loadImages(testLoaded)
        this.gold_mine.loadImages(testLoaded)
        this.iron_mine.loadImages(testLoaded)
        this.ruby_mine.loadImages(testLoaded)
        this.amethyst_mine.loadImages(testLoaded)
        
    }

}