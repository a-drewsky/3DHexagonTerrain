import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

   constructor(hexMapData, settings) {
      this.hexMapData = hexMapData;

      this.seedMultiplier = settings.SEED_MULTIPLIER
      this.noiseFluctuation = settings.NOISE_FLUCTUATION
      this.terrainGenThresholds = settings.TERRAIN_GENERATION_THERSHOLD
      this.terrainGenMaxNeighbors = settings.TERRAIN_GENERATION_MAX_NEIGHBORS
      this.rockGenThreshold = settings.TERRAIN_ROCK_GEN_THRESHOLD
      this.cellSize = settings.CELL_SIZE
      this.bufferSizes = settings.BUFFER_SIZES
      this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
      this.secondMineChance = settings.SECOND_MINE_CHANCE
      this.thirdMineChace = settings.THIRD_MINE_CHACE
   }

   generateTerrain = (q, r, mapSize) => {
      let noiseFluctuation = this.noiseFluctuation[mapSize]
      this.generateModifiers(noiseFluctuation)
      this.generateSavannaTrees()
      this.generateLargeRocks()
      this.generateMainBases(q, r, mapSize)
      this.generateMines(q, r, mapSize)
      this.generateStrongholds(q, r, mapSize)
   }

   setStructure = (q, r, terrain, tile) => {
      if (this.hexMapData.getEntry(q, r).terrain) {
         this.hexMapData.terrainList[tile.terrain] = terrain
      } else {
         this.hexMapData.terrainList.push(terrain)

         tile.terrain = this.hexMapData.terrainList.length - 1

         this.hexMapData.setEntry(q, r, tile)
      }
   }

   setMainBase = (q, r, tile) => {

      let cropList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

      let flatList = [{ q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 }, { q: -2, r: 0 }, { q: -1, r: -1 }]

      let totalList = [...cropList, ...flatList]

      let heightList = totalList.map(tile => this.hexMapData.getEntry(q + tile.q, r + tile.r).height)

      let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)

      terrainHeight = Math.min(terrainHeight, 4)

      terrainHeight = Math.max(terrainHeight, 2)


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
            type: 'structure',
            sprite: `mainbase_q${posName.q}r${posName.r}`,
            state: 0,
            tileHeight: 3,
            images: [],
            shadowImages: []
         }

         let terrainNum

         let tileToSet = this.hexMapData.getEntry(tileToSetKey.q, tileToSetKey.r)

         if (tileToSet.terrain) {
            this.hexMapData.terrainList[tileToSet.terrain] = terrain
            terrainNum = tile.terrain

         } else {
            this.hexMapData.terrainList.push(terrain)
            terrainNum = this.hexMapData.terrainList.length - 1
         }

         let tileBiome

         if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
         if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
         if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
         if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
         if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

         tileToSet.height = terrainHeight
         tileToSet.biome = tileBiome
         tileToSet.terrain = terrainNum

         this.hexMapData.setEntry(tileToSetKey.q, tileToSetKey.r, tileToSet)
      }

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

         this.hexMapData.setEntry(tileToSetKey.q, tileToSetKey.r, tileToSet)

      }
   }

   generateStrongholds = (q, r, mapSize) => {

      let isValidTile = (tilePosQ, tilePosR, selectedTile) => {
         if (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') return false

         if (selectedTile.terrain && this.hexMapData.terrainList[selectedTile.terrain].type == 'structure') return false

         let doubleTileNeighbors = this.hexMapData.getDoubleNeighborKeys(tilePosQ, tilePosR)

         let tileNeighbors = this.hexMapData.getNeighborKeys(tilePosQ, tilePosR)


         if (tileNeighbors.length != 6) return false

         for (let i = 0; i < doubleTileNeighbors.length; i++) {
            let neighborTile = this.hexMapData.getEntry(doubleTileNeighbors[i].q, doubleTileNeighbors[i].r)
            if (neighborTile.terrain && this.hexMapData.terrainList[neighborTile.terrain].type == 'structure') return false
         }

         return true
      }

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
            cellTiles.splice(selectedTileIndex, 1)
            let selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)


            while (!isValidTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
               if (cellTiles.length == 0) break;
               selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               selectedTilePos = cellTiles[selectedTileIndex]
               cellTiles.splice(selectedTileIndex, 1)
               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
            }

            if (cellTiles.length == 0) break;

            //flatten tiles
            let tileNeighbors = this.hexMapData.getNeighborKeys(selectedTilePos.q, selectedTilePos.r)

            let heightList = tileNeighbors.map(tile => this.hexMapData.getEntry(tile.q, tile.r).height)

            let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)
            terrainHeight = Math.min(terrainHeight, 4)
            terrainHeight = Math.max(terrainHeight, 2)

            let tileToSet = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)

            let tileBiome

            if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
            if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
            if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
            if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
            if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

            tileToSet.height = terrainHeight
            tileToSet.biome = tileBiome

            this.hexMapData.setEntry(selectedTilePos.q, selectedTilePos.r, tileToSet)

            for (let i = 0; i < tileNeighbors.length; i++) {
               let tileToSet = this.hexMapData.getEntry(tileNeighbors[i].q, tileNeighbors[i].r)

               let tileBiome

               if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
               if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
               if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
               if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
               if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

               tileToSet.height = terrainHeight
               tileToSet.biome = tileBiome

               this.hexMapData.setEntry(tileNeighbors[i].q, tileNeighbors[i].r, tileToSet)
            }


            let terrain = {
               position: {
                  q: selectedTilePos.q,
                  r: selectedTilePos.r
               },
               name: 'Stronghold',
               type: 'structure',
               sprite: 'base',
               state: 0,
               tileHeight: 2,
               images: [],
               shadowImages: []
            }

            selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
            this.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)

         }
      }

   }

   generateMainBases = (q, r, mapSize) => {
      let bufferSize = this.bufferSizes[mapSize]

      //base 1
      let rPos = Math.floor(bufferSize + this.cellSize.r * 0.25)
      let qPos = Math.floor(this.cellSize.q * 0.75 - Math.floor(0.25 / 2))

      let selectedTile = this.hexMapData.getEntry(qPos, rPos)

      this.setMainBase(qPos, rPos, selectedTile)

      //base 2
      rPos = Math.floor(bufferSize + this.cellSize.r * r - this.cellSize.r * 0.25)
      qPos = Math.floor(this.cellSize.q * 1 - Math.floor(rPos / 2))

      selectedTile = this.hexMapData.getEntry(qPos, rPos)

      this.setMainBase(qPos, rPos, selectedTile)
   }

   generateMines = (q, r, mapSize) => {

      let isValidTile = (tilePosQ, tilePosR, selectedTile) => {
         if (selectedTile.biome == 'water' || selectedTile.biome == 'frozenwater') return false

         if (selectedTile.terrain && this.hexMapData.terrainList[selectedTile.terrain].type == 'structure') return false

         let doubleTileNeighbors = this.hexMapData.getDoubleNeighborKeys(tilePosQ, tilePosR)

         let tileNeighbors = this.hexMapData.getNeighborKeys(tilePosQ, tilePosR)


         if (tileNeighbors.length != 6) return false

         for (let i = 0; i < doubleTileNeighbors.length; i++) {
            let neighborTile = this.hexMapData.getEntry(doubleTileNeighbors[i].q, doubleTileNeighbors[i].r)
            if (neighborTile.terrain && this.hexMapData.terrainList[neighborTile.terrain].type == 'structure') return false
         }

         return true
      }

      let bufferSize = this.bufferSizes[mapSize]

      let closeSpriteList = ['goldmine', 'coppermine']

      let farSpriteList = ['goldmine', 'ironmine', 'rubymine', 'amethystmine']

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

            let mineCount = 1;

            if (Math.random() < this.secondMineChance) mineCount++
            if (Math.random() < this.thirdMineChace) mineCount++

            for (let i = 0; i < mineCount; i++) {
               let selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               let selectedTilePos = cellTiles[selectedTileIndex]
               cellTiles.splice(selectedTileIndex, 1)
               let selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)


               while (!isValidTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
                  if (cellTiles.length == 0) break;
                  selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
                  selectedTilePos = cellTiles[selectedTileIndex]
                  cellTiles.splice(selectedTileIndex, 1)
                  selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               }

               if (cellTiles.length == 0) break;

               //flatten tiles
               let tileNeighbors = this.hexMapData.getNeighborKeys(selectedTilePos.q, selectedTilePos.r)

               let heightList = tileNeighbors.map(tile => this.hexMapData.getEntry(tile.q, tile.r).height)

               let terrainHeight = Math.floor(heightList.reduce((a, b) => a + b, 0) / heightList.length)
               terrainHeight = Math.min(terrainHeight, 4)
               terrainHeight = Math.max(terrainHeight, 2)

               let tileToSet = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)

               let tileBiome

               if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
               if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
               if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
               if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
               if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

               tileToSet.height = terrainHeight
               tileToSet.biome = tileBiome

               this.hexMapData.setEntry(selectedTilePos.q, selectedTilePos.r, tileToSet)

               for (let i = 0; i < tileNeighbors.length; i++) {
                  let tileToSet = this.hexMapData.getEntry(tileNeighbors[i].q, tileNeighbors[i].r)

                  let tileBiome

                  if (terrainHeight >= this.elevationRanges['verylow']) tileBiome = tileToSet.verylowBiome
                  if (terrainHeight >= this.elevationRanges['low']) tileBiome = tileToSet.lowBiome
                  if (terrainHeight >= this.elevationRanges['mid']) tileBiome = tileToSet.midBiome
                  if (terrainHeight >= this.elevationRanges['high']) tileBiome = tileToSet.highBiome
                  if (terrainHeight >= this.elevationRanges['veryhigh']) tileBiome = tileToSet.veryhighBiome

                  tileToSet.height = terrainHeight
                  tileToSet.biome = tileBiome

                  this.hexMapData.setEntry(tileNeighbors[i].q, tileNeighbors[i].r, tileToSet)
               }

               let closeSection = false

               if (rGen == 0 || rGen == r - 1) closeSection = true


               let mineType

               if (closeSection) mineType = closeSpriteList[Math.floor(Math.random() * closeSpriteList.length)]
               else mineType = farSpriteList[Math.floor(Math.random() * farSpriteList.length)]

               console.log(mineType)

               let terrain = {
                  position: {
                     q: selectedTilePos.q,
                     r: selectedTilePos.r
                  },
                  name: 'Mine',
                  type: 'structure',
                  sprite: mineType,
                  state: 0,
                  tileHeight: 2,
                  images: [],
                  shadowImages: []
               }

               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               this.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)
            }

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

            value.terrain = this.hexMapData.terrainList.length - 1

            this.hexMapData.setEntry(keyObj.q, keyObj.r, value)

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

            value.terrain = this.hexMapData.terrainList.length - 1

            this.hexMapData.setEntry(keyObj.q, keyObj.r, value)
         }



      }

   }

   maxNeighbors = (q, r, biome) => {

      let maxNeighbors = this.terrainGenMaxNeighbors[biome]

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