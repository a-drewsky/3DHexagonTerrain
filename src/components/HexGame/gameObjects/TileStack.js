export default class TileStackClass {

    constructor(pos, mapData, images) {
        this.position = { ...pos }

        this.canvasSize = {
            width: mapData.size * 2,
            height: mapData.size * 2
        }

        this.groundShadowTile = false

        this.height = null
        this.biome = null
        this.verylowBiome = null
        this.lowBiome = null
        this.midBiome = null
        this.highBiome = null
        this.veryhighBiome = null
        this.biomeRegion = null

        this.images = []
        if(!images) return

        this.imageObject = images.tile
        this.selectionImageObject = images.highlight
    }

}