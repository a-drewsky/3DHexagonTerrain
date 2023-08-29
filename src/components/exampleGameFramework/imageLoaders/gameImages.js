
import TileImagesClass from './tileImages'
import UnitImagesClass from './units/unitImages'
import HighlighImagesClass from './highlightImages'
import UiImagesClass from './ui/uiImages'
import StructureImagesClass from './structures/structureImages'

export default class GameImagesClass {

    constructor() {
        this.loaders = [
            this.tile = new TileImagesClass(),
            this.unit = new UnitImagesClass(),
            this.highlight = new HighlighImagesClass(),
            this.ui = new UiImagesClass(),
            this.structures = new StructureImagesClass()
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