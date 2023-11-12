import ImageLoaderUtilsClass from "../../utils/imageLoaderUtils"
import DefaultBunkerImagesClass from "./bunkerImages/defaultBunkerImages"
import MainBunkerImagesClass from "./bunkerImages/mainBunkerImages"

export default class BunkerImagesClass {

    constructor() {
        this.loaders = [
            this.bunker = new DefaultBunkerImagesClass(),
            this.main_bunker = new MainBunkerImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages

    }

}