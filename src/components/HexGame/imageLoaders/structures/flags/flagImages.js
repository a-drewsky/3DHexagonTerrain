import ImageLoaderUtilsClass from "../../utils/imageLoaderUtils";
import DefaultFlagImagesClass from "./flagImages/defaultFlagImages";

export default class FlagImagesClass {

    constructor() {

        this.loaders = [
            this.default = new DefaultFlagImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages

    }

}