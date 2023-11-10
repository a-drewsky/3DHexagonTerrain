
import { BIOME_CONSTANTS } from '../../commonConstants/CommonConstants'

export default class StructureBuilderUtilsClass {

    constructor(hexMapData) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
    }

    flattenTerrain = (q, r, flatList, terrainHeight) => {
        for (let i = 0; i < flatList.length; i++) {

            let tileToSetKey = {
                q: q + flatList[i].q,
                r: r + flatList[i].r
            }

            let tileToSet = this.tileData.getEntry(tileToSetKey)

            let tileBiome

            if (terrainHeight >= this.mapData.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
            if (terrainHeight >= this.mapData.elevationRanges['low']) tileBiome = tileToSet.lowBiome
            if (terrainHeight >= this.mapData.elevationRanges['mid']) tileBiome = tileToSet.midBiome
            if (terrainHeight >= this.mapData.elevationRanges['high']) tileBiome = tileToSet.highBiome
            if (terrainHeight >= this.mapData.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

            tileToSet.height = terrainHeight
            tileToSet.biome = tileBiome

        }
    }

    getAverageHeight = (q, r, tileList) => {
        let heightList = tileList.map(tile => this.tileData.getEntry({ q: q + tile.q, r: r + tile.r }).height || null)
        heightList.filter(height => height != null)

        let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)

        terrainHeight = Math.min(terrainHeight, 4)

        terrainHeight = Math.max(terrainHeight, 2)

        return terrainHeight
    }

    isValidStructureTile = (tilePosQ, tilePosR, selectedTile) => {
        if (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') return false

        let terrain = this.structureData.getStructure({ q: tilePosQ, r: tilePosR })
        if (terrain != null && terrain.type != 'modifier') return false

        let doubleTileNeighbors = this.tileData.getNeighborKeys({ q: tilePosQ, r: tilePosR }, 2)

        console.log(doubleTileNeighbors)

        let tileNeighbors = this.tileData.getNeighborKeys({ q: tilePosQ, r: tilePosR }, 1)


        if (tileNeighbors.length != 6) return false

        for (let i = 0; i < doubleTileNeighbors.length; i++) {
            let nieghborTerrain = this.structureData.getStructure(doubleTileNeighbors[i])
            if (nieghborTerrain != null && nieghborTerrain.type != 'modifier') return false
        }

        return true
    }

    setMainBase = (q, r) => {

        let cropList = [{ q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

        let flatList = [{ q: 0, r: 0 }, { q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 }, { q: -2, r: 0 }, { q: -1, r: -1 }]

        let totalList = [...cropList, ...flatList]

        let terrainHeight = this.getAverageHeight(q, r, totalList)

        for (let i = 0; i < cropList.length; i++) {

            let tileToSetKey = {
                q: q + cropList[i].q,
                r: r + cropList[i].r
            }

            let posName = {
                q: cropList[i].q,
                r: cropList[i].r
            }

            if (posName.q == -1) posName.q = 'm1'
            if (posName.r == -1) posName.r = 'm1'
            
            //set main base rotation
            if(posName.q == 1 && posName.r == 'm1') this.structureData.setBunker(tileToSetKey, 'main_bunker_0')
            else if(posName.q == 1 && posName.r == 0) this.structureData.setBunker(tileToSetKey, 'main_bunker_1')
            else if(posName.q == 0 && posName.r == 1) this.structureData.setBunker(tileToSetKey, 'main_bunker_2')
            else if(posName.q == 'm1' && posName.r == 1) this.structureData.setBunker(tileToSetKey, 'main_bunker_3')
            else if(posName.q == 'm1' && posName.r == 0) this.structureData.setBunker(tileToSetKey, 'main_bunker_4')
            else if(posName.q == 0 && posName.r == 'm1') this.structureData.setBunker(tileToSetKey, 'main_bunker_5')

            

        }

        this.flattenTerrain(q, r, totalList, terrainHeight)

        this.structureData.setFlag({ q: q, r: r }, 'defaultFlag')

    }


    maxNeighbors = (q, r, biome) => {

        let maxNeighbors = BIOME_CONSTANTS[biome].terrainGenMaxNeighbors

        let neighborKeys = this.tileData.getNeighborKeys({ q: q, r: r }, 1)

        let terrainCount = 0;


        for (let i = 0; i < neighborKeys.length; i++) {
            let tile = this.tileData.getEntry(neighborKeys[i])
            if (tile.biome == biome && tile.terrain != null) terrainCount++
        }

        if (terrainCount > maxNeighbors) return true

        return false
    }

}