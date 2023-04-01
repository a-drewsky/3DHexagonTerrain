import noise from "../../../utilities/perlin";
import HexMapBuilderUtilsClass from "../utils/HexMapBuilderUtils";
import HexMapCommonUtilsClass from "../utils/HexMapCommonUtils";

export default class HexMapBuilderTerrainClass {

   constructor(hexMapData, settings, config) {
      this.hexMapData = hexMapData;

      this.seedMultiplier = settings.SEED_MULTIPLIER
      this.cellSize = settings.CELL_SIZE
      this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
      this.secondMineChance = settings.SECOND_MINE_CHANCE
      this.thirdMineChace = settings.THIRD_MINE_CHACE

      this.mapSizeSettings = settings.MAP_SIZES

      this.biomeGenSettings = settings.BIOME_GENERATION

      this.config = config

      this.utils = new HexMapBuilderUtilsClass(hexMapData, settings, this.config)
      this.commonUtils = new HexMapCommonUtilsClass()

   }

   generateTerrain = (q, r, mapSize) => {
      let noiseFluctuation = this.mapSizeSettings[mapSize].noiseFluctuation
      this.generateModifiers(noiseFluctuation)
      this.generateProps()
      this.generateMainBases(q, r, mapSize)
      this.generateMines(q, r, mapSize)
      this.generateBases(q, r, mapSize)
   }

   generateBases = (q, r, mapSize) => {

      let bufferSize = this.mapSizeSettings[mapSize].bufferSize

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


            let terrain = this.config.bunker(selectedTilePos)

            selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
            this.utils.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)

         }
      }

   }

   generateMainBases = (q, r, mapSize) => {
      let bufferSize = this.mapSizeSettings[mapSize].bufferSize

      //base 1
      let rPos = Math.floor(bufferSize + this.cellSize.r * 0.25)
      let qPos = Math.floor(this.cellSize.q * 0.75 - Math.floor(0.25 / 2))

      this.utils.setMainBase(qPos, rPos)

      //base 2
      rPos = Math.floor(bufferSize + this.cellSize.r * r - this.cellSize.r * 0.25)
      qPos = Math.floor(this.cellSize.q * 1 - Math.floor(rPos / 2))

      this.utils.setMainBase(qPos, rPos)
   }

   generateMines = (q, r, mapSize) => {

      let bufferSize = this.mapSizeSettings[mapSize].bufferSize

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


               let terrain = this.config[mineType](selectedTilePos)

               selectedTile = this.hexMapData.getEntry(selectedTilePos.q, selectedTilePos.r)
               this.utils.setStructure(selectedTilePos.q, selectedTilePos.r, terrain, selectedTile)
            }

         }
      }

   }

   generateProps = () => {

      let thresholds = {
         savannaTree: 0.95,
         largeRock: 0.9
      }

      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.commonUtils.split(key);

         let spawnChance = {
            savannaTree: Math.random(),
            largeRock: Math.random()
         }

         //generate savanna trees
         if ((value.biome == 'savanna' || value.biome == 'savannahill') && spawnChance.savannaTree > thresholds.savannaTree && !this.utils.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {
            let terrain = this.config.savannaTree(keyObj)
            this.utils.setStructure(keyObj.q, keyObj.r, terrain, value)
         }

         //generate large rocks
         let terrain = this.hexMapData.getTerrain(keyObj.q, keyObj.r);
         if (terrain != null && terrain.name == 'Rocks' && spawnChance.largeRock > thresholds.largeRock) {
            let terrain = this.config.largeRock(keyObj)
            this.hexMapData.setTerrain(keyObj.q, keyObj.r, terrain)
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
         let keyObj = this.commonUtils.split(key);

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

         if (tileTreeNoise[value.biome] > this.biomeGenSettings[value.biome].terrainGenThreshold && !this.utils.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain

            switch (value.biome) {
               case 'woodlands':
               case 'grasshill':
                  terrain = this.config.oakTrees(keyObj)
                  break;
               case 'tundra':
               case 'snowhill':
                  terrain = this.config.spruceTrees(keyObj)
                  break;
               case 'desert':
               case 'sandhill':
                  terrain = this.config.cacti(keyObj)
                  break;
               default:
                  continue;
            }

            this.hexMapData.setTerrain(keyObj.q, keyObj.r, terrain)

         } else if (this.biomeGenSettings[value.biome].rockGenThreshold && tileRockNoise > this.biomeGenSettings[value.biome].rockGenThreshold) {
            let terrain = this.config.smallRocks(keyObj)

            this.hexMapData.setTerrain(keyObj.q, keyObj.r, terrain)
         }


      }

   }

}