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

        this.groundShadowTile = false

        this.height = null
        this.biome = null
        this.verylowBiome = null
        this.lowBiome = null
        this.midBiome = null
        this.highBiome = null
        this.veryhighBiome = null

        this.images = []
        if(!images) return

        this.imageObject = images.tile
        this.selectionImageObject = images.highlight
    }

}