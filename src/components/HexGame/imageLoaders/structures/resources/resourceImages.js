import CopperMineImagesClass from "./resourceImages/copperMineImages"
import GoldMineImagesClass from "./resourceImages/goldMineImages"
import IronMineImagesClass from "./resourceImages/ironMineImages"
import RubyMineImagesClass from "./resourceImages/rubyMineImages"
import AmethystMineImagesClass from "./resourceImages/amethystMineImages"
import JadeMineImagesClass from "./resourceImages/jadeMineImages"
import LapisMineImagesClass from "./resourceImages/lapisMineImages"

import ImageLoaderUtilsClass from "../../utils/imageLoaderUtils"

export default class ResourceImagesClass {

    constructor() {
        this.loaders = [
            this.copper_mine = new CopperMineImagesClass(),
            this.gold_mine = new GoldMineImagesClass(),
            this.iron_mine = new IronMineImagesClass(),
            this.ruby_mine = new RubyMineImagesClass(),
            this.amethyst_mine = new AmethystMineImagesClass(),
            this.jade_mine = new JadeMineImagesClass(),
            this.lapis_mine = new LapisMineImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages
    }

}