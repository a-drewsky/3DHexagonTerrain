import noise from "../../../utilities/perlin";
import HexMapBuilderTerrainClass from "./HexMapBuilderTerrain";
import HexMapBuilderUtilsClass from "../utils/HexMapBuilderUtils";
import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils";

export default class HexMapBuilderClass {

   constructor(hexMapData, tileManager, spriteManager, settings) {

      this.hexMapData = hexMapData;
      this.tileManager = tileManager
      this.spriteManager = spriteManager

      this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
      this.lowTerrainGenerationRanges = settings.LOW_TERRAIN_GENERATION_RANGES
      this.maxElevation = settings.MAX_ELEVATION
      this.elevationMultiplier = settings.ELEVATION_MULTIPLIER
      this.seedMultiplier = settings.SEED_MULTIPLIER
      this.tempRanges = settings.TEMP_RANGES
      this.waterTempRanges = settings.WATER_TEMP_RANGES
      this.sandHillElevationDivisor = settings.SAND_HILL_ELVATION_DIVISOR
      this.mirror = settings.MIRROR_MAP
      this.cellSize = settings.CELL_SIZE

      this.biomeGenSettings = settings.BIOME_GENERATION

      this.mapSizeSettings = settings.MAP_SIZES

      this.utils = new HexMapBuilderUtilsClass(hexMapData, tileManager, spriteManager, settings, this.config)
      this.builderTerrain = new HexMapBuilderTerrainClass(hexMapData, tileManager, spriteManager, this.utils, settings, this.config);
      this.commonUtils = new HexMapCommonUtilsClass()

   }

   build = (q, r, mapSize) => {

      let noiseFluctuation = this.mapSizeSettings[mapSize].noiseFluctuation

      this.generateMap(q * this.cellSize.q, r * this.cellSize.r + this.mapSizeSettings[mapSize].bufferSize * 2)
      this.generateBiomes(noiseFluctuation)

      this.smoothBiomes()

      this.builderTerrain.generateTerrain(q, r, mapSize)
      this.reduceTileHeights()

   }

   generateMap = (Qgen, Rgen) => {

      let groundShadowDistance = 3 //make setting

      if (this.mirror) {
         for (let r = 0; r < Math.ceil(Rgen / 2); r++) {
            for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
               this.tileManager.data.setEntry(q, r);
            }
         }
      } else {
         for (let r = -groundShadowDistance; r < 0; r++) {
            for (let q = -1 * Math.floor(r / 2)-groundShadowDistance; q < Qgen - Math.floor(r / 2)+groundShadowDistance; q++) {
               this.tileManager.data.setShadowEntry(q, r);
            }
         }
         for (let r = 0; r < Rgen; r++) {
            for (let q = -1 * Math.floor(r / 2)-groundShadowDistance; q < -1 * Math.floor(r / 2); q++) {
               this.tileManager.data.setShadowEntry(q, r);
            }
            for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
               this.tileManager.data.setEntry(q, r);
            }
            for (let q = Qgen - Math.floor(r / 2); q < Qgen - Math.floor(r / 2)+groundShadowDistance; q++) {
               this.tileManager.data.setShadowEntry(q, r);
            }
         }
         for (let r = Rgen; r < Rgen+groundShadowDistance; r++) {
            for (let q = -1 * Math.floor(r / 2)-groundShadowDistance; q < Qgen - Math.floor(r / 2)+groundShadowDistance; q++) {
               this.tileManager.data.setShadowEntry(q, r);
            }
         }
      }

   }

   generateBiomes = (noiseFluctuation) => {

      //set generation seeds
      let elevationSeed1 = Math.random() * this.seedMultiplier
      let elevationSeed2 = Math.random() * this.seedMultiplier
      let tempSeed1 = Math.random() * this.seedMultiplier
      let tempSeed2 = Math.random() * this.seedMultiplier

      for (let entry of this.tileManager.data.getTileMap()) {

         console.log(entry)

         let keyObj = this.commonUtils.split(entry.key);

         //elevation generation
         let tileHeightNoise = noise(elevationSeed1 + keyObj.q / noiseFluctuation, elevationSeed1 + keyObj.r / noiseFluctuation) * noise(elevationSeed2 + keyObj.q / noiseFluctuation, elevationSeed2 + keyObj.r / noiseFluctuation)

         let tileHeight = Math.ceil(tileHeightNoise * this.elevationMultiplier)

         let heightSet = false;
         for (let i in this.lowTerrainGenerationRanges) {
            if (tileHeight <= this.lowTerrainGenerationRanges[i]) {
               tileHeight = parseInt(i);
               heightSet = true;
               break;
            }
         }
         if (!heightSet) tileHeight -= this.lowTerrainGenerationRanges[4] - 4;

         tileHeight = Math.min(tileHeight, this.maxElevation)


         //temp generation
         let tileTemp = noise(tempSeed1 + keyObj.q / noiseFluctuation, tempSeed1 + keyObj.r / noiseFluctuation) * noise(tempSeed2 + keyObj.q / noiseFluctuation, tempSeed2 + keyObj.r / noiseFluctuation)

         this.generteTileBiomes(this.tileManager.data.getEntry(keyObj.q, keyObj.r), tileHeight, tileTemp)

      }

      this.tileManager.data.setMaxHeight();
   }

   generteTileBiomes = (tileObj, tileHeight, tileTemp) => {

      //set biome
      let tileBiome = null
      let tileVerylowBiome = null
      let tileLowBiome = null
      let tileMidBiome = null
      let tileHighBiome = null
      let tileVeryhighBiome = null

      let biome = null


      biome = 'water'
      if (tileTemp < this.waterTempRanges['frozenwater']) biome = 'frozenwater'
      if (tileTemp > this.waterTempRanges['water']) biome = 'playa'
      tileVerylowBiome = biome

      for (let range in this.tempRanges) {
         if (tileTemp < this.tempRanges[range]) {
            biome = range
            break;
         }
      }
      tileLowBiome = biome
      if (tileHeight >= this.elevationRanges['low']) tileVerylowBiome = biome

      biome = 'snowhill'
      if (tileTemp > this.tempRanges['tundra']) biome = 'grasshill'
      if (tileTemp > this.tempRanges['woodlands']) biome = 'savannahill'
      if (tileTemp > this.tempRanges['savanna']) {
         biome = 'sandhill'
         if (tileHeight >= this.elevationRanges['mid']) tileHeight = tileHeight - Math.ceil((tileHeight - this.elevationRanges['mid']) / this.sandHillElevationDivisor) //set sand hill elevation
      }
      tileMidBiome = biome

      biome = 'rockmountain'
      if (tileTemp < this.tempRanges['tundra']) biome = 'snowmountain'
      if (tileTemp > this.tempRanges['savanna']) biome = 'sandhill'
      tileHighBiome = biome

      biome = 'snowmountain'
      if (tileTemp > this.tempRanges['savanna']) biome = 'sandhill'
      tileVeryhighBiome = biome


      if (tileHeight >= this.elevationRanges['verylow']) tileBiome = tileVerylowBiome
      if (tileHeight >= this.elevationRanges['low']) tileBiome = tileLowBiome
      if (tileHeight >= this.elevationRanges['mid']) tileBiome = tileMidBiome
      if (tileHeight >= this.elevationRanges['high']) tileBiome = tileHighBiome
      if (tileHeight >= this.elevationRanges['veryhigh']) tileBiome = tileVeryhighBiome


      tileObj.height = tileHeight
      tileObj.biome = tileBiome
      tileObj.verylowBiome = tileVerylowBiome
      tileObj.lowBiome = tileLowBiome
      tileObj.midBiome = tileMidBiome
      tileObj.highBiome = tileHighBiome
      tileObj.veryhighBiome = tileVeryhighBiome

   }

   smoothBiomes = () => {
      console.log(this.spriteManager)
      let keyStrings = this.tileManager.data.getKeyStrings();

      let getBiomeSet = (keyString, keyStrSet) => {

         keyStrSet.add(keyString)

         //get tile biome
         let keyObj = this.commonUtils.split(keyString);
         let tileBiome = this.tileManager.data.getEntry(keyObj.q, keyObj.r).biome

         let neighborKeys = this.tileManager.data.getNeighborKeys(keyObj.q, keyObj.r)
         neighborKeys = neighborKeys.filter(neighborKey => this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).biome == tileBiome || this.biomeGenSettings[tileBiome].biomeGroup.includes(this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).biome))
         neighborKeys = neighborKeys.filter(neighborKey => !keyStrSet.has(this.commonUtils.join(neighborKey.q, neighborKey.r)))


         if (neighborKeys.length == 0) return keyStrSet

         for (let i = 0; i < neighborKeys.length; i++) {
            //recursion
            let keyStr = this.commonUtils.join(neighborKeys[i].q, neighborKeys[i].r)
            keyStrSet = getBiomeSet(keyStr, keyStrSet)
         }

         return keyStrSet

      }

      let smoothTile = (keyString) => {
         let keyObj = this.commonUtils.split(keyString);
         let tileBiome = this.tileManager.data.getEntry(keyObj.q, keyObj.r).biome


         //check if tile has non-similar biome neighbors
         let neighborKeys = this.tileManager.data.getNeighborKeys(keyObj.q, keyObj.r)
         let tempMap = neighborKeys.map(key => this.tileManager.data.getEntry(key.q, key.r).biome)
         neighborKeys = neighborKeys.filter(neighborKey => this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).biome != tileBiome)
         if (neighborKeys.length == 0) return false

         //get array of neighbor biomes
         let biomeArr = neighborKeys.map(neighborKey => this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).biome)

         //find the most common neighbor biome
         let modeMap = {};
         let maxBiome = biomeArr[0]
         if (biomeArr.length > 1) {
            let maxCount = 1;
            for (let i = 0; i < biomeArr.length; i++) {
               let biome = biomeArr[i];
               if (modeMap[biome] == null) modeMap[biome] = 1;
               else modeMap[biome]++;

               if (modeMap[biome] > maxCount) {
                  maxBiome = biome;
                  maxCount = modeMap[biome];
               }
            }
         }

         //clone a tile with most common biome
         neighborKeys = neighborKeys.filter(neighborKey => this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).biome == maxBiome)
         let neighborKeyToClone = neighborKeys[Math.floor(Math.random() * neighborKeys.length)]
         let tileToClone = this.tileManager.data.getEntry(neighborKeyToClone.q, neighborKeyToClone.r)
         this.utils.cloneTile(tileToClone, keyObj)

         return true
      }

      while (keyStrings.length > 0) {

         //get biome
         let keyObj = this.commonUtils.split(keyStrings[0])
         let biome = this.tileManager.data.getEntry(keyObj.q, keyObj.r).biome

         //get tile set
         let keyStrSet = new Set()
         keyStrSet = getBiomeSet(keyStrings[0], keyStrSet);
         let keyStrArr = Array.from(keyStrSet)

         //remove set from keyStrings
         for (let i = 0; i < keyStrArr.length; i++) {
            let keyStrArrObj = this.commonUtils.split(keyStrArr[i])
            let keyStrArrObjBiome = this.tileManager.data.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome

            if (keyStrArrObjBiome == biome) {
               let keyIndex = keyStrings.indexOf(keyStrArr[i]);
               if (keyIndex != -1) keyStrings.splice(keyIndex, 1);
            }
         }

         //Check size of biome set and fix tiles if neccessary
         if (keyStrArr.length < this.biomeGenSettings[biome].minBiomeSmoothing) {
            while (keyStrArr.length > 0) {
               let keyStrArrObj = this.commonUtils.split(keyStrArr[0])
               let keyStrArrObjBiome = this.tileManager.data.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome


               if (keyStrArrObjBiome != biome) keyStrArr.shift()
               else if (smoothTile(keyStrArr[0])) keyStrArr.shift()
               else {
                  keyStrArr.push(keyStrArr.shift());
               }
            }
         }

      }

   }

   reduceTileHeights = () => {
      let reduced = true

      while (reduced == true) {
         reduced = false
         for (let entry of this.tileManager.data.getTileMap()) {

            let keyObj = this.commonUtils.split(entry.key);
            let tile = this.tileManager.data.getEntry(keyObj.q, keyObj.r)
            let neighborKeys = this.tileManager.data.getNeighborKeys(keyObj.q, keyObj.r)

            let isCliff = false

            for (let neighborKey of neighborKeys) {
               let neighborTile = this.tileManager.data.getEntry(neighborKey.q, neighborKey.r)

               if (tile.height - neighborTile.height > 2) {
                  isCliff = true
                  break
               }
            }

            if (isCliff == false) continue

            let hasStep = false

            while (hasStep == false) {

               for (let neighborKey of neighborKeys) {
                  let neighborTile = this.tileManager.data.getEntry(neighborKey.q, neighborKey.r)

                  if (tile.height - neighborTile.height > 0 && tile.height - neighborTile.height < 3) {
                     hasStep = true
                     break
                  }
               }
               if (hasStep == false) {
                  tile.height--
                  reduced = true
               }
            }

            this.utils.setTileBiome(tile)

         }
      }

   }

}