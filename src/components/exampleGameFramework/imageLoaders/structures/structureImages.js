import ModifierImagesClass from './modifiers/modifierImages'
import BunkerImagesClass from './bunker/bunkerImages'
import PropImagesClass from './props/propImages'
import ResourceImagesClass from './resources/resourceImages'
import FlagImagesClass from './flags/flagImages'

export default class StructureImagesClass {

    constructor() {
        this.loaders = [
            this.modifier = new ModifierImagesClass(),
            this.bunker = new BunkerImagesClass(),
            this.prop = new PropImagesClass(),
            this.resource = new ResourceImagesClass(),
            this.flag = new FlagImagesClass()
        ]
    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if (totalLoaded == this.loaders.length) startGame()
        }

        for (let loader of this.loaders) {
            loader.loadImages(testLoaded)
        }

    }

}