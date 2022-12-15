
import TileImagesClass from './tileImages'
import ModifierImagesClass from './modifierImages'
import StructureImagesClass from './structureImages'
import UnitImagesClass from './unitImages'
import HighlighImagesClass from './highlightImages'

export default class GameImagesClass {

    constructor() {

        this.tiles = new TileImagesClass()
        this.modifiers = new ModifierImagesClass()
        this.structures = new StructureImagesClass()
        this.units = new UnitImagesClass()
        this.highlights = new HighlighImagesClass()

    }

    loadImages = (startGame) => {
        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 5) startGame()
        }
        this.tiles.loadImages(testLoaded)
        this.modifiers.loadImages(testLoaded)
        this.structures.loadImages(testLoaded)
        this.units.loadImages(testLoaded)
        this.highlights.loadImages(testLoaded)
    }

}