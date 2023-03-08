
import TileImagesClass from './tileImages'
import ModifierImagesClass from './modifiers/modifierImages'
import BaseImagesClass from './bases/baseImages'
import PropImagesClass from './props/propImages'
import ResourceImagesClass from './resources/resourceImages'
import UnitImagesClass from './units/unitImages'
import HighlighImagesClass from './highlightImages'
import UiImagesClass from './ui/uiImages'
import FlagImagesClass from './flags/flagImages'

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