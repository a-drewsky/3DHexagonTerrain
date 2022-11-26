
import TileImagesClass from './tileImages'
import ModifierImagesClass from './modifierImages'
import StructureImagesClass from './structureImages'

export default class GameImagesClass {

    constructor() {

        this.tiles = new TileImagesClass()
        this.modifiers = new ModifierImagesClass()
        this.structures = new StructureImagesClass()

    }

    loadImages = (startGame) => {
        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 3) startGame()
        }
        this.tiles.loadImages(testLoaded)
        this.modifiers.loadImages(testLoaded)
        this.structures.loadImages(testLoaded)
    }

}