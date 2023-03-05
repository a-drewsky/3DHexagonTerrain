
import TileImagesClass from './tileImages'
import ModifierImagesClass from './modifierImages'
import BaseImagesClass from './bases/baseImages'
import PropImagesClass from './propImages'
import ResourceImagesClass from './resourceImages'
import UnitImagesClass from './unitImages'
import HighlighImagesClass from './highlightImages'
import UiImagesClass from './uiImages'
import FlagImagesClass from './flagImages'

export default class GameImagesClass {

    constructor() {

        this.tile = new TileImagesClass()
        this.modifier = new ModifierImagesClass()
        this.base = new BaseImagesClass()
        this.prop = new PropImagesClass()
        this.resource = new ResourceImagesClass()
        this.unit = new UnitImagesClass()
        this.highlight = new HighlighImagesClass()
        this.ui = new UiImagesClass()
        this.flag = new FlagImagesClass()

    }

    loadImages = (startGame) => {
        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            console.log(totalLoaded)
            if(totalLoaded == 9) startGame()
        }
        this.tile.loadImages(testLoaded)
        this.modifier.loadImages(testLoaded)
        this.base.loadImages(testLoaded)
        this.prop.loadImages(testLoaded)
        this.resource.loadImages(testLoaded)
        this.unit.loadImages(testLoaded)
        this.highlight.loadImages(testLoaded)
        this.ui.loadImages(testLoaded)
        this.flag.loadImages(testLoaded)
    }

}