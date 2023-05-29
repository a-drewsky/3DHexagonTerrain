import TileStackRendererClass from './TileStackRenderer'
import TileStackViewClass from './TileStackView'
import TileStackBuilderClass from './TileStackBuilder'
import TileStackSelectionModifierClass from './TileStackSelectionModifier'

export default class TileStackManagerClass {

    constructor(hexMapData, images, canvas) {
        this.data = hexMapData.tileData
        this.renderer = new TileStackRendererClass(hexMapData, images)
        this.view = new TileStackViewClass(hexMapData, this.renderer, canvas)
        this.builder = new TileStackBuilderClass(hexMapData)
    }


   

}