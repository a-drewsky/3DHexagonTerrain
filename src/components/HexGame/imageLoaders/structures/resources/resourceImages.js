import CopperMineImagesClass from "./resourceImages/copperMineImages"
import GoldMineImagesClass from "./resourceImages/goldMineImages"
import IronMineImagesClass from "./resourceImages/ironMineImages"
import RubyMineImagesClass from "./resourceImages/rubyMineImages"
import AmethystMineImagesClass from "./resourceImages/amethystMineImages"

import ImageLoaderUtilsClass from "../../utils/imageLoaderUtils"

export default class ResourceImagesClass {

    constructor() {
        this.loaders = [
            this.copper_mine = new CopperMineImagesClass(),
            this.gold_mine = new GoldMineImagesClass(),
            this.iron_mine = new IronMineImagesClass(),
            this.ruby_mine = new RubyMineImagesClass(),
            this.amethyst_mine = new AmethystMineImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages
    }

}