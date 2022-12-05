import noise from "../../utilities/perlin";
import HexMapBuilderUtilsClass from "./HexMapBuilderUtils";

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

      this.utils = new HexMapBuilderUtilsClass(hexMapData, settings)
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
            cellTiles.splice(selectedTileIndex, 1)
            let selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)


            while (!this.utils.isValidStructureTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
               if (cellTiles.length == 0) break;
               selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               selectedTilePos = cellTiles[selectedTileIndex]
               cellTiles.splice(selectedTileIndex, 1)
               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
            }

            if (cellTiles.length == 0) break;

            //flatten tiles
            let flatList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

            let terrainHeight = this.utils.getAverageHeight(selectedTilePos.q, selectedTilePos.r, flatList)

            this.utils.flattenTerrain(selectedTilePos.q, selectedTilePos.r, flatList, terrainHeight)


            let terrain = {
               position: {
                  q: selectedTilePos.q,
                  r: selectedTilePos.r
               },
               name: 'Stronghold',
               type: 'structures',
               sprite: 'base',
               state: 0,
               tileHeight: 2,
               images: [],
               shadowImages: []
            }

            selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
            this.utils.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)

         }
      }

   }

   generateMainBases = (q, r, mapSize) => {
      let bufferSize = this.bufferSizes[mapSize]

      //base 1
      let rPos = Math.floor(bufferSize + this.cellSize.r * 0.25)
      let qPos = Math.floor(this.cellSize.q * 0.75 - Math.floor(0.25 / 2))

      let selectedTile = this.hexMapData.getEntry(qPos, rPos)

      this.utils.setMainBase(qPos, rPos, selectedTile)

      //base 2
      rPos = Math.floor(bufferSize + this.cellSize.r * r - this.cellSize.r * 0.25)
      qPos = Math.floor(this.cellSize.q * 1 - Math.floor(rPos / 2))

      selectedTile = this.hexMapData.getEntry(qPos, rPos)

      this.utils.setMainBase(qPos, rPos, selectedTile)
   }

   generateMines = (q, r, mapSize) => {

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


               while (!this.utils.isValidStructureTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
                  if (cellTiles.length == 0) break;
                  selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
                  selectedTilePos = cellTiles[selectedTileIndex]
                  cellTiles.splice(selectedTileIndex, 1)
                  selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               }

               if (cellTiles.length == 0) break;

               //flatten tiles
               let flatList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

               let terrainHeight = this.utils.getAverageHeight(selectedTilePos.q, selectedTilePos.r, flatList)

               this.utils.flattenTerrain(selectedTilePos.q, selectedTilePos.r, flatList, terrainHeight)

               let closeSection = false

               if (rGen == 0 || rGen == r - 1) closeSection = true


               let mineType

               if (closeSection) mineType = closeSpriteList[Math.floor(Math.random() * closeSpriteList.length)]
               else mineType = farSpriteList[Math.floor(Math.random() * farSpriteList.length)]


               let terrain = {
                  position: {
                     q: selectedTilePos.q,
                     r: selectedTilePos.r
                  },
                  name: 'Mine',
                  type: 'structures',
                  sprite: mineType,
                  state: 0,
                  tileHeight: 2,
                  images: [],
                  shadowImages: []
               }

               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               this.utils.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)
            }

         }
      }

   }

   generateSavannaTrees = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let savannaTreeThreshold = 0.95

         let spawnChance = Math.random();

         if ((value.biome == 'savanna' || value.biome == 'savannahill') && spawnChance > savannaTreeThreshold && !this.utils.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Savanna Tree',
               type: 'structures',
               sprite: 'savannatree',
               state: 0,
               tileHeight: 3,
               images: [],
               shadowImages: []
            }

            this.utils.setStructure(keyObj.q, keyObj.r, terrain, value)

         }

      }
   }

   generateLargeRocks = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let replacesmallRockThreshold = 0.9

         let spawnChance = Math.random();
         
         let terrainIndex = this.utils.getTerrainIndex(keyObj.q, keyObj.r);
         
         if (terrainIndex != -1 && this.hexMapData.terrainList[terrainIndex].name == 'Rocks' && spawnChance > replacesmallRockThreshold) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Large Rock',
               type: 'structures',
               sprite: 'largerock',
               state: 0,
               tileHeight: 2,
               images: [],
               shadowImages: []
            }

            this.hexMapData.terrainList[terrainIndex] = terrain

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

         if (tileTreeNoise[value.biome] > this.terrainGenThresholds[value.biome] && !this.utils.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

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
                  terrain.type = 'modifiers'
                  terrain.sprite = 'oaktree'
                  terrain.state = 0
                  terrain.tileHeight = 2
                  terrain.images = []
                  terrain.shadowImages = []
                  break;
               case 'tundra':
               case 'snowhill':
                  terrain.name = 'Forest'
                  terrain.type = 'modifiers'
                  terrain.sprite = 'tundratree'
                  terrain.state = 0
                  terrain.tileHeight = 3
                  terrain.images = []
                  terrain.shadowImages = []
                  break;
               case 'desert':
               case 'sandhill':
                  terrain.name = 'Cacti'
                  terrain.type = 'modifiers'
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

         } else if (this.rockGenThreshold[value.biome] && tileRockNoise > this.rockGenThreshold[value.biome]) {
            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               name: 'Rocks',
               type: 'modifiers',
               sprite: 'rocks',
               state: 0,
               tileHeight: 1,
               images: [],
               shadowImages: []
            }

            this.hexMapData.terrainList.push(terrain)
         }


      }

   }

}