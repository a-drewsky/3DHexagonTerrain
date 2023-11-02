import ModifierImagesClass from './modifiers/modifierImages'
import BunkerImagesClass from './bunker/bunkerImages'
import PropImagesClass from './props/propImages'
import ResourceImagesClass from './resources/resourceImages'
import FlagImagesClass from './flags/flagImages'

import ImageLoaderUtilsClass from '../utils/imageLoaderUtils'

export default class StructureImagesClass {

    constructor() {
        this.loaders = [
            this.modifier = new ModifierImagesClass(),
            this.bunker = new BunkerImagesClass(),
            this.prop = new PropImagesClass(),
            this.resource = new ResourceImagesClass(),
            this.flag = new FlagImagesClass()
        ]

        this.utils = new ImageLoaderUtilsClass()
        this.loadImages = this.utils.loadImages


    }



}