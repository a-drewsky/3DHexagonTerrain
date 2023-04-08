export default class HexMapBuilderUtilsClass {

    constructor(hexMapData, spriteManager, settings, config) {

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES

        this.biomeGenSettings = settings.BIOME_GENERATION

        this.config = config
    }

    flattenTerrain = (q, r, flatList, terrainHeight) => {
        for (let i = 0; i < flatList.length; i++) {

            let tileToSetKey = {
                q: q + flatList[i].q,
                r: r + flatList[i].r
            }

            let tileToSet = this.spriteManager.tiles.data.getEntry(tileToSetKey.q, tileToSetKey.r)

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
        let heightList = tileList.map(tile => this.spriteManager.tiles.data.getEntry(q + tile.q, r + tile.r).height || null)
        heightList.filter(height => height != null)

        let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)

        terrainHeight = Math.min(terrainHeight, 4)

        terrainHeight = Math.max(terrainHeight, 2)

        return terrainHeight
    }

    isValidStructureTile = (tilePosQ, tilePosR, selectedTile) => {
        if (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') return false

        let terrain = this.spriteManager.structures.getStructure(tilePosQ, tilePosR)
        if (terrain != null && terrain.data.type != 'modifier') return false

        let doubleTileNeighbors = this.spriteManager.tiles.data.getDoubleNeighborKeys(tilePosQ, tilePosR)

        let tileNeighbors = this.spriteManager.tiles.data.getNeighborKeys(tilePosQ, tilePosR)


        if (tileNeighbors.length != 6) return false

        for (let i = 0; i < doubleTileNeighbors.length; i++) {
            let nieghborTerrain = this.spriteManager.structures.getStructure(doubleTileNeighbors[i].q, doubleTileNeighbors[i].r)
            if (nieghborTerrain != null && nieghborTerrain.data.type != 'modifier') return false
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
            if(posName.q == 1 && posName.r == 'm1') this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_1')
            else if(posName.q == 1 && posName.r == 0) this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_3')
            else if(posName.q == 0 && posName.r == 1) this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_5')
            else if(posName.q == 'm1' && posName.r == 1) this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_7')
            else if(posName.q == 'm1' && posName.r == 0) this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_9')
            else if(posName.q == 0 && posName.r == 'm1') this.spriteManager.structures.setBunker(tileToSetKey.q, tileToSetKey.r, 'mainBunker_11')

            

        }

        this.flattenTerrain(q, r, totalList, terrainHeight)

        this.spriteManager.structures.setFlag(q, r, 'defaultFlag')

    }


    maxNeighbors = (q, r, biome) => {

        let maxNeighbors = this.biomeGenSettings[biome].terrainGenMaxNeighbors

        let neighborKeys = this.spriteManager.tiles.data.getNeighborKeys(q, r)

        let terrainCount = 0;


        for (let i = 0; i < neighborKeys.length; i++) {
            let tile = this.spriteManager.tiles.data.getEntry(neighborKeys[i].q, neighborKeys[i].r)
            if (tile.biome == biome && tile.terrain != null) terrainCount++
        }

        if (terrainCount > maxNeighbors) return true

        return false
    }

    setTileBiome = (tile) => {
       if (tile.height >= this.elevationRanges['verylow']) tile.biome = tile.verylowBiome
       if (tile.height >= this.elevationRanges['low']) tile.biome = tile.lowBiome
       if (tile.height >= this.elevationRanges['mid']) tile.biome = tile.midBiome
       if (tile.height >= this.elevationRanges['high']) tile.biome = tile.highBiome
       if (tile.height >= this.elevationRanges['veryhigh']) tile.biome = tile.veryhighBiome
    }

    cloneTile = (tileToClone, keyObj) => {
 
       let newTile = this.spriteManager.tiles.data.setEntry(keyObj.q, keyObj.r)
 
       newTile.height = tileToClone.height
       newTile.biome = tileToClone.biome
       newTile.verylowBiome = tileToClone.verylowBiome
       newTile.lowBiome = tileToClone.lowBiome
       newTile.midBiome = tileToClone.midBiome
       newTile.highBiome = tileToClone.highBiome
       newTile.veryhighBiome = tileToClone.veryhighBiome
    }

}