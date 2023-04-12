export default class CommonBuilderUtilsClass {

    constructor(hexMapData, tileData, settings) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
    }

    cloneTile = (tileToClone, keyObj) => {

        let newTile = this.tileData.setEntry(keyObj.q, keyObj.r)

        newTile.height = tileToClone.height
        newTile.biome = tileToClone.biome
        newTile.verylowBiome = tileToClone.verylowBiome
        newTile.lowBiome = tileToClone.lowBiome
        newTile.midBiome = tileToClone.midBiome
        newTile.highBiome = tileToClone.highBiome
        newTile.veryhighBiome = tileToClone.veryhighBiome
    }

    setTileBiome = (tile) => {
        if (tile.height >= this.elevationRanges['verylow']) tile.biome = tile.verylowBiome
        if (tile.height >= this.elevationRanges['low']) tile.biome = tile.lowBiome
        if (tile.height >= this.elevationRanges['mid']) tile.biome = tile.midBiome
        if (tile.height >= this.elevationRanges['high']) tile.biome = tile.highBiome
        if (tile.height >= this.elevationRanges['veryhigh']) tile.biome = tile.veryhighBiome
    }

}