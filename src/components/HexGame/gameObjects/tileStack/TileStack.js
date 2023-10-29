export default class TileStackClass {

    constructor(pos, hexMapData, images) {
        this.position = {
            q: pos.q,
            r: pos.r
        }

        this.canvasSize = {
            width: hexMapData.size * 2,
            height: hexMapData.size * 2
        }

        this.height = null

        this.groundShadowTile = false

        this.rendered = false
        this.images = []

        this.biome = null
        this.verylowBiome = null
        this.lowBiome = null
        this.midBiome = null
        this.highBiome = null
        this.veryhighBiome = null

        if(!images) return

        this.imageObject = images.tile
        this.selectionImageObject = images.highlight
        this.selectionImages = []
    }

}