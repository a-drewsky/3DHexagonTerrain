export default class HexMapBuilderUtilsClass {

    constructor(hexMapData, settings) {

        this.hexMapData = hexMapData
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES

        this.biomeGenSettings = settings.BIOME_GENERATION
    }

    flattenTerrain = (q, r, flatList, terrainHeight) => {
        for (let i = 0; i < flatList.length; i++) {

            let tileToSetKey = {
                q: q + flatList[i].q,
                r: r + flatList[i].r
            }

            let tileToSet = this.hexMapData.getEntry(tileToSetKey.q, tileToSetKey.r)

            let tileBiome

            if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
            if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
            if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
            if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
            if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

            tileToSet.height = terrainHeight
            tileToSet.biome = tileBiome

        }
    }

    getAverageHeight = (q, r, tileList) => {
        let heightList = tileList.map(tile => this.hexMapData.getEntry(q + tile.q, r + tile.r).height || null)
        heightList.filter(height => height != null)

        let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)

        terrainHeight = Math.min(terrainHeight, 4)

        terrainHeight = Math.max(terrainHeight, 2)

        return terrainHeight
    }

    isValidStructureTile = (tilePosQ, tilePosR, selectedTile) => {
        if (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') return false

        let terrainIndex = this.hexMapData.getTerrainIndex(tilePosQ, tilePosR)
        if (terrainIndex != -1 && this.hexMapData.terrainList[terrainIndex].type == 'structures') return false

        let doubleTileNeighbors = this.hexMapData.getDoubleNeighborKeys(tilePosQ, tilePosR)

        let tileNeighbors = this.hexMapData.getNeighborKeys(tilePosQ, tilePosR)


        if (tileNeighbors.length != 6) return false

        for (let i = 0; i < doubleTileNeighbors.length; i++) {
            let terrainIndex = this.hexMapData.getTerrainIndex(doubleTileNeighbors[i].q, doubleTileNeighbors[i].r)
            if (terrainIndex != -1 && this.hexMapData.terrainList[terrainIndex].type == 'structures') return false
        }

        return true
    }

    setStructure = (q, r, terrain) => {
        let curTerrain = this.hexMapData.getTerrainIndex(q, r)
        if (curTerrain != -1) {
            this.hexMapData.terrainList[curTerrain] = terrain
        } else {
            this.hexMapData.terrainList.push(terrain)
        }
    }

    setMainBase = (q, r) => {

        let cropList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

        let flatList = [{ q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 }, { q: -2, r: 0 }, { q: -1, r: -1 }]

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

            let terrain = {
                position: {
                    q: tileToSetKey.q,
                    r: tileToSetKey.r
                },
                name: 'Main Base',
                type: 'structures',
                sprite: `mainbase_q${posName.q}r${posName.r}`,
                state: 0,
                tileHeight: 3,
                images: [],
                shadowImages: []
            }

            let curTerrainIndex = this.hexMapData.getTerrainIndex(terrain.position.q, terrain.position.r)

            if (curTerrainIndex != -1) {
                this.hexMapData.terrainList[curTerrainIndex] = terrain
            } else {
                this.hexMapData.terrainList.push(terrain)
            }

        }

        this.flattenTerrain(q, r, totalList, terrainHeight)

    }


    maxNeighbors = (q, r, biome) => {

        let maxNeighbors = this.biomeGenSettings[biome].terrainGenMaxNeighbors

        let neighborKeys = this.hexMapData.getNeighborKeys(q, r)

        let terrainCount = 0;


        for (let i = 0; i < neighborKeys.length; i++) {
            let tile = this.hexMapData.getEntry(neighborKeys[i].q, neighborKeys[i].r)
            if (tile.biome == biome && tile.terrain != null) terrainCount++
        }

        if (terrainCount > maxNeighbors) return true

        return false
    }

}