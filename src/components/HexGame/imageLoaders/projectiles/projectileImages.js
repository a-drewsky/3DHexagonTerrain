import ProjectileImagesArrowClass from "./projectileImagesArrow";

import ImageLoaderUtilsClass from "../utils/imageLoaderUtils";

export default class ProjectileImagesClass {

    constructor(){
        this.loaders = [
            this.arrow = new ProjectileImagesArrowClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages
    }

}