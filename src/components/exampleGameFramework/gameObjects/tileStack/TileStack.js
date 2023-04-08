export default class TileStackClass {

    constructor(pos, hexMapData){
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.height = null
        this.biome = null
        this.verylowBiome = null
        this.lowBiome = null
        this.midBiome = null
        this.highBiome = null
        this.veryhighBiome = null
        this.images = []
        this.selectionImages = []

        this.groundShadowTile = false

        this.canvasSize = {
            width: hexMapData.size * 2,
            height: hexMapData.size * 2
         }
    }

}