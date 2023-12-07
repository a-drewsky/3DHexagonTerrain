
import { BIOME_CONSTANTS } from "../../constants/BuilderConstants"

export default class CommonBuilderUtilsClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.tileData = gameData.tileData
    }

    cloneTile = (tileToClone, keyObj) => {

        let newTile = this.tileData.setEntry(keyObj)

        newTile.height = tileToClone.height
        newTile.biome = tileToClone.biome
        newTile.verylowBiome = tileToClone.verylowBiome
        newTile.lowBiome = tileToClone.lowBiome
        newTile.midBiome = tileToClone.midBiome
        newTile.highBiome = tileToClone.highBiome
        newTile.veryhighBiome = tileToClone.veryhighBiome
        newTile.biomeRegion = tileToClone.biomeRegion
    }

    setTileBiome = (tile) => {
        if (tile.height >= this.mapData.elevationRanges['verylow']) tile.biome = tile.verylowBiome
        if (tile.height >= this.mapData.elevationRanges['low']) tile.biome = tile.lowBiome
        if (tile.height >= this.mapData.elevationRanges['mid']) tile.biome = tile.midBiome
        if (tile.height >= this.mapData.elevationRanges['high']) tile.biome = tile.highBiome
        if (tile.height >= this.mapData.elevationRanges['veryhigh']) tile.biome = tile.veryhighBiome
        tile.biomeRegion = BIOME_CONSTANTS[tile.biome].biomeRegion
    }

}