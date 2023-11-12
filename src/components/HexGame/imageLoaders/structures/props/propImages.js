import LargeRockImagesClass from "./propImages/largeRockImages"
import SavannaTreeImagesClass from "./propImages/savannaTreeImages"

import ImageLoaderUtilsClass from "../../utils/imageLoaderUtils"

export default class PropImagesClass {

    constructor() {

        this.loaders = [
            this.large_rock = new LargeRockImagesClass(),
            this.savanna_tree = new SavannaTreeImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages

    }
}