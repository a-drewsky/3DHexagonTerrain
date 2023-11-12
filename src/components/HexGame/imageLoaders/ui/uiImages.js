import HealthbarImagesClass from "./healthbarImages"
import ResourceImagesClass from "./resourcebarImages"

import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class UiImagesClass {

    constructor() {
        this.loaders = [
            this.healthbar = new HealthbarImagesClass(),
            this.resourcebar = new ResourceImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages
    }


}