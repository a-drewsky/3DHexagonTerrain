
import TileImagesClass from './tileImages'
import UnitImagesClass from './units/unitImages'
import HighlighImagesClass from './highlightImages'
import UiImagesClass from './ui/uiImages'
import StructureImagesClass from './structures/structureImages'

export default class GameImagesClass {

    constructor() {

        this.tile = new TileImagesClass()
        this.unit = new UnitImagesClass()
        this.highlight = new HighlighImagesClass()
        this.ui = new UiImagesClass()
        this.structures = new StructureImagesClass()

    }

    loadImages = (startGame) => {
        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            console.log(totalLoaded)
            if(totalLoaded == 5) startGame()
        }
        this.tile.loadImages(testLoaded)
        this.unit.loadImages(testLoaded)
        this.highlight.loadImages(testLoaded)
        this.ui.loadImages(testLoaded)
        this.structures.loadImages(testLoaded)
    }

}