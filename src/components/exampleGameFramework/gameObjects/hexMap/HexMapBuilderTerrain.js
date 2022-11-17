import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

   constructor(hexMapData, seedMultiplier, noiseFluctuation, terrainGenThresholds, terrainGenMaxNeighbors, rockGenThreshold, cellSize, bufferSizes) {
      this.hexMapData = hexMapData;

      this.seedMultiplier = seedMultiplier
      this.noiseFluctuation = noiseFluctuation
      this.terrainGenThresholds = terrainGenThresholds
      this.terrainGenMaxNeighbors = terrainGenMaxNeighbors
      this.rockGenThreshold = rockGenThreshold
      this.cellSize = cellSize
      this.bufferSizes = bufferSizes
   }

   generateTerrain = (q, r, mapSize) => {
      let noiseFluctuation = this.noiseFluctuation[mapSize]
      this.generateModifiers(noiseFluctuation)
      this.generateSavannaTrees()
      this.generateLargeRocks()
      this.generateMines(q, r, mapSize)
      this.generateStrongholds(q, r, mapSize)
      this.generateMainBases(q, r, mapSize)
   }

   setStructure = (q, r, terrain, tile) => {
      if (this.hexMapData.getEntry(q, r).terrain) {
         this.hexMapData.terrainList[tile.terrain] = terrain

         this.hexMapData.setEntry(q, r, {
            height: tile.height,
            biome: tile.biome,
            verylowBiome: tile.verylowBiome,
            lowBiome: tile.lowBiome,
            midBiome: tile.midBiome,
            highBiome: tile.highBiome,
            veryhighBiome: tile.veryhighBiome,
            terrain: tile.terrain
         })
      } else {
         this.hexMapData.terrainList.push(terrain)

         this.hexMapData.setEntry(q, r, {
            height: tile.height,
            biome: tile.biome,
            verylowBiome: tile.verylowBiome,
            lowBiome: tile.lowBiome,
            midBiome: tile.midBiome,
            highBiome: tile.highBiome,
            veryhighBiome: tile.veryhighBiome,
            terrain: this.hexMapData.terrainList.length - 1
         })
      }
   }

   setMainBase = (q, r, tile) => {

      let cropList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

      let terrain = {
         position: {
            q: q,
            r: r
         },
         name: 'Main Base',
         type: 'largestructure',
         sprite: 'mainbase',
         state: 0,
         tileHeight: 3,
         images: [],
         shadowImages: []
      }

      let terrainNum

      let heightList = cropList.map(tile => this.hexMapData.getEntry(q + tile.q, r + tile.r).height)

      console.log(heightList)

      let terrainHeight = Math.min(...heightList)

      console.log(terrainHeight)

      if (this.hexMapData.getEntry(q, r).terrain) {
         this.hexMapData.terrainList[tile.terrain] = terrain
         terrainNum = tile.terrain

      } else {
         this.hexMapData.terrainList.push(terrain)
         terrainNum = this.hexMapData.terrainList.length - 1

      }

      
      for(let i=0; i<cropList.length; i++){

         let tileToSetKey = {
            q: q + cropList[i].q,
            r: r + cropList[i].r
         }

         let tileToSet = this.hexMapData.getEntry(tileToSetKey.q, tileToSetKey.r)

         if(tileToSet.terrain && tileToSet.terrain != terrainNum) this.hexMapData.terrainList[tileToSet.terrain] = null

         this.hexMapData.setEntry(tileToSetKey.q, tileToSetKey.r, {
            height: terrainHeight,
            biome: tileToSet.biome,
            verylowBiome: tileToSet.verylowBiome,
            lowBiome: tileToSet.lowBiome,
            midBiome: tileToSet.midBiome,
            highBiome: tileToSet.highBiome,
            veryhighBiome: tileToSet.veryhighBiome,
            terrain: terrainNum
         })
      }
   }

   generateStrongholds = (q, r, mapSize) => {

      let bufferSize = this.bufferSizes[mapSize]

      for (let rGen = 0; rGen < r; rGen++) {
         for (let qGen = 0; qGen < q; qGen++) {
            let cellTiles = []

            for (let rPos = bufferSize + this.cellSize.r * rGen; rPos < bufferSize + this.cellSize.r * (rGen + 1); rPos++) {
               for (let qPos = -1 * Math.floor(rPos / 2) + this.cellSize.q * qGen; qPos < this.cellSize.q * (qGen + 1) - Math.floor(rPos / 2); qPos++) {
                  cellTiles.push({
                     q: qPos,
                     r: rPos
                  })
               }
            }

            let selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
            let selectedTilePos = cellTiles[selectedTileIndex]
            let selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)

            let maxLoops = cellTiles.length
            let loops = 0

            while (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater' || (selectedTile.terrain && selectedTile.terrain.name == 'Mine')) {
               if (loops >= maxLoops) break;
               selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               selectedTilePos = cellTiles[selectedTileIndex]
               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               loops++
            }

            let terrain = {
               position: {
                  q: selectedTilePos.q,
                  r: selectedTilePos.r
               },
               name: 'base',
               type: 'structure',
               sprite: 'base',
               state: 0,
               tileHeight: 3,
               images: [],
               shadowImages: []
            }

            this.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)
         }
      }

   }

   generateMainBases = (q, r, mapSize) => {
      let bufferSize = this.bufferSizes[mapSize]

      let rPos = Math.floor(bufferSize + this.cellSize.r * 0.25)
      let qPos = Math.floor(this.cellSize.q * 0.75 - Math.floor(0.25 / 2))

      let selectedTile = this.hexMapData.getEntry(qPos, rPos)

      this.setMainBase(qPos, rPos, selectedTile)
      
   }

   generateMines = (q, r, mapSize) => {

      let bufferSize = this.bufferSizes[mapSize]

      for (let rGen = 0; rGen < r; rGen++) {
         for (let qGen = 0; qGen < q; qGen++) {
            let cellTiles = []

            for (let rPos = bufferSize + this.cellSize.r * rGen; rPos < bufferSize + this.cellSize.r * (rGen + 1); rPos++) {
               for (let qPos = -1 * Math.floor(rPos / 2) + this.cellSize.q * qGen; qPos < this.cellSize.q * (qGen + 1) - Math.floor(rPos / 2); qPos++) {
                  cellTiles.push({
                     q: qPos,
                     r: rPos
                  })
               }
            }

            let selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
            let selectedTilePos = cellTiles[selectedTileIndex]
            let selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)

            let maxLoops = cellTiles.length
            let loops = 0

            while (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') {
               if (loops >= maxLoops) break;
               selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               selectedTilePos = cellTiles[selectedTileIndex]
               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               loops++
            }

            let terrain = {
               position: {
                  q: selectedTilePos.q,
                  r: selectedTilePos.r
               },
               name: 'Mine',
               type: 'structure',
               sprite: 'coppermine',
               state: 0,
               tileHeight: 2,
               images: [],
               shadowImages: []
            }

            this.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)
         }
      }

   }

   generateSavannaTrees = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let savannaTreeThreshold = 0.95

         let spawnChance = Math.random();

         if ((value.biome == 'savanna' || value.biome == 'savannahill') && spawnChance > savannaTreeThreshold && !this.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Savanna Tree',
               type: 'structure',
               sprite: 'savannatree',
               state: 0,
               tileHeight: 3,
               images: [],
               shadowImages: []
            }

            this.setStructure(keyObj.q, keyObj.r, terrain, value)

         }

      }
   }

   generateLargeRocks = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let replacesmallRockThreshold = 0.9

         let spawnChance = Math.random();

         if (value.terrain && this.hexMapData.terrainList[value.terrain].name == 'Rocks' && spawnChance > replacesmallRockThreshold) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Large Rock',
               type: 'structure',
               sprite: 'largerock',
               state: 0,
               tileHeight: 2,
               images: [],
               shadowImages: []
            }

            this.hexMapData.terrainList[value.terrain] = terrain

            this.hexMapData.setEntry(keyObj.q, keyObj.r, {
               height: value.height,
               biome: value.biome,
               verylowBiome: value.verylowBiome,
               lowBiome: value.lowBiome,
               midBiome: value.midBiome,
               highBiome: value.highBiome,
               veryhighBiome: value.veryhighBiome,
               terrain: value.terrain
            })

         }

      }
   }

   generateModifiers = (noiseFluctuation) => {

      let treeSeeds = {
         woodlands1: Math.random() * this.seedMultiplier,
         woodlands2: Math.random() * this.seedMultiplier,
         tundra1: Math.random() * this.seedMultiplier,
         tundra2: Math.random() * this.seedMultiplier,
         desert1: Math.random() * this.seedMultiplier,
         desert2: Math.random() * this.seedMultiplier
      }

      let rockSeeds = [Math.random() * this.seedMultiplier, Math.random() * this.seedMultiplier]

      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         //feature generation
         let tileTreeNoise = {
            woodlands: noise(treeSeeds['woodlands1'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['woodlands2'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands2'] + keyObj.r / noiseFluctuation),
            grasshill: noise(treeSeeds['woodlands1'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['woodlands2'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands2'] + keyObj.r / noiseFluctuation),
            tundra: noise(treeSeeds['tundra1'] + keyObj.q / noiseFluctuation, treeSeeds['tundra1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['tundra2'] + keyObj.q / noiseFluctuation, treeSeeds['tundra2'] + keyObj.r / noiseFluctuation),
            snowhill: noise(treeSeeds['tundra1'] + keyObj.q / noiseFluctuation, treeSeeds['tundra1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['tundra2'] + keyObj.q / noiseFluctuation, treeSeeds['tundra2'] + keyObj.r / noiseFluctuation),
            desert: noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation),
            sandhill: noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation),
         }

         let tileRockNoise = noise(rockSeeds[0] + keyObj.q / noiseFluctuation, rockSeeds[0] + keyObj.r / noiseFluctuation) * noise(rockSeeds[1] + keyObj.q / noiseFluctuation, rockSeeds[1] + keyObj.r / noiseFluctuation)

         if (tileTreeNoise[value.biome] > this.terrainGenThresholds[value.biome] && !this.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               }
            }

            switch (value.biome) {
               case 'woodlands':
               case 'grasshill':
                  terrain.name = 'Forest'
                  terrain.type = 'modifier'
                  terrain.sprite = 'oaktree'
                  terrain.state = 0
                  terrain.tileHeight = 2
                  terrain.images = []
                  terrain.shadowImages = []
                  break;
               case 'tundra':
               case 'snowhill':
                  terrain.name = 'Forest'
                  terrain.type = 'modifier'
                  terrain.sprite = 'tundratree'
                  terrain.state = 0
                  terrain.tileHeight = 3
                  terrain.images = []
                  terrain.shadowImages = []
                  break;
               case 'desert':
               case 'sandhill':
                  terrain.name = 'Cacti'
                  terrain.type = 'modifier'
                  terrain.sprite = 'deserttree'
                  terrain.state = 0
                  terrain.tileHeight = 3
                  terrain.images = []
                  terrain.shadowImages = []
                  break;
               default:
                  continue;
            }

            this.hexMapData.terrainList.push(terrain)

            this.hexMapData.setEntry(keyObj.q, keyObj.r, {
               height: value.height,
               biome: value.biome,
               verylowBiome: value.verylowBiome,
               lowBiome: value.lowBiome,
               midBiome: value.midBiome,
               highBiome: value.highBiome,
               veryhighBiome: value.veryhighBiome,
               terrain: this.hexMapData.terrainList.length - 1
            })

         } else if (this.rockGenThreshold[value.biome] && tileRockNoise > this.rockGenThreshold[value.biome]) {
            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Rocks',
               type: 'modifier',
               sprite: 'rocks',
               state: 0,
               tileHeight: 1,
               images: [],
               shadowImages: []
            }

            this.hexMapData.terrainList.push(terrain)

            this.hexMapData.setEntry(keyObj.q, keyObj.r, {
               height: value.height,
               biome: value.biome,
               verylowBiome: value.verylowBiome,
               lowBiome: value.lowBiome,
               midBiome: value.midBiome,
               highBiome: value.highBiome,
               veryhighBiome: value.veryhighBiome,
               terrain: this.hexMapData.terrainList.length - 1
            })
         }



      }

   }

   maxNeighbors = (q, r, biome) => {

      let maxNeighbors = this.terrainGenMaxNeighbors[biome]

      let neighborKeys = this.hexMapData.getNeighborKeys(q, r)

      let terrainCount = 0;


      for (let i = 0; i < neighborKeys.length; i++) {
         let tile = this.hexMapData.getEntry(neighborKeys[i].q, neighborKeys[i].r)
         console.log(tile)
         if (tile.biome == biome && tile.terrain != null) terrainCount++
      }

      if (terrainCount > maxNeighbors) return true

      return false
   }

}