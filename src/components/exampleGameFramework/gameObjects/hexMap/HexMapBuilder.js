import noise from "../../utilities/perlin";
import HexMapBuilderTerrainClass from "./HexMapBuilderTerrain";

export default class HexMapBuilderClass {

   constructor(hexMapData, hexMapView, elevationRanges, lowTerrainGenerationRanges, maxElevation, elevationMultiplier, seedMultiplier, noiseFluctuation, tempRanges, waterTempRanges, biomeGroups, minBiomeSmoothing, sandHillElevationDivisor, mirror, terrainGenThresholds, terrainGenMaxNeighbors, rockGenThreshold) {

      this.hexMapData = hexMapData;
      this.hexMapView = hexMapView;

      this.elevationRanges = elevationRanges
      this.lowTerrainGenerationRanges = lowTerrainGenerationRanges
      this.maxElevation = maxElevation
      this.elevationMultiplier = elevationMultiplier
      this.seedMultiplier = seedMultiplier
      this.noiseFluctuation = noiseFluctuation
      this.tempRanges = tempRanges
      this.waterTempRanges = waterTempRanges
      this.biomeGroups = biomeGroups
      this.minBiomeSmoothing = minBiomeSmoothing
      this.sandHillElevationDivisor = sandHillElevationDivisor
      this.mirror = mirror
      this.terrainGenThresholds = terrainGenThresholds
      this.terrainGenMaxNeighbors = terrainGenMaxNeighbors
      this.rockGenThreshold = rockGenThreshold

      this.builderTerrain = new HexMapBuilderTerrainClass(
         this.hexMapData,
         this.seedMultiplier,
         this.noiseFluctuation,
         this.terrainGenThresholds,
         this.terrainGenMaxNeighbors,
         this.rockGenThreshold
     );

   }

   generateMap = (Qgen, Rgen) => {

      if (this.mirror) {
         for (let r = 0; r < Math.ceil(Rgen / 2); r++) {
            for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
               console.log(q, r)
               this.hexMapData.setEntry(q, r, {
                  height: 0
               });
            }
         }
      } else {
         for (let r = 0; r < Rgen; r++) {
            for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
               this.hexMapData.setEntry(q, r, {
                  height: 0
               });
            }
         }
      }

   }

   mirrorMapFunc = (Qgen, Rgen) => {
      for (let r = Math.ceil(Rgen / 2); r < Rgen; r++) {
         let dist = 0;
         for (let q = -1 * Math.floor((Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2))) / 2); q < Qgen - Math.floor((Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2))) / 2); q++) {
            this.hexMapData.setEntry(-1 * Math.floor(r / 2) + dist, r, structuredClone(this.hexMapData.getEntry(q, Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2)))));
            dist++;
         }
      }
   }

   mirrorMap2Func = (Qgen, Rgen) => {
      for (let r = Math.ceil(Rgen / 2); r < Rgen; r++) {
         let dist = 0;
         for (let q = -1 * Math.floor((Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2))) / 2); q < Qgen - Math.floor((Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2))) / 2); q++) {
            this.hexMapData2.setEntry(-1 * Math.floor(r / 2) + dist, r, structuredClone(this.hexMapData2.getEntry(q, Math.ceil(Rgen / 2) - 2 - (r - Math.ceil(Rgen / 2)))));
            dist++;
         }
      }
   }

   generateBiomes = (noiseFluctuation) => {

      let elevationSeed1 = Math.random() * this.seedMultiplier
      let elevationSeed2 = Math.random() * this.seedMultiplier
      let tempSeed1 = Math.random() * this.seedMultiplier
      let tempSeed2 = Math.random() * this.seedMultiplier

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

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

         //set biome
         let tileBiome = null
         let tileVerylowBiome = null
         let tileLowBiome = null
         let tileMidBiome = null
         let tileHighBiome = null
         let tileVeryhighBiome = null

         if (tileHeight >= this.elevationRanges['verylow']) {
            let biome = 'water'
            if (tileTemp < this.waterTempRanges['frozenwater']) biome = 'frozenwater'
            if (tileTemp > this.waterTempRanges['water']) biome = 'playa'

            tileBiome = biome
            tileVerylowBiome = biome
         }
         if (tileHeight >= this.elevationRanges['low']) {
            let biome

            for (let range in this.tempRanges) {
               if (tileTemp < this.tempRanges[range]) {
                  biome = range
                  break;
               }
            }

            tileBiome = biome
            tileLowBiome = biome
            tileVerylowBiome = biome
         }
         if (tileHeight >= this.elevationRanges['mid']) {
            let biome = 'snowhill'
            if (tileTemp > this.tempRanges['tundra']) biome = 'grasshill'
            if (tileTemp > this.tempRanges['woodlands']) biome = 'savannahill'
            if (tileTemp > this.tempRanges['savanna']) {
               biome = 'sandhill'
               tileHeight = tileHeight - Math.ceil((tileHeight - this.elevationRanges['mid']) / this.sandHillElevationDivisor) //set sand hill elevation
            }

            tileBiome = biome
            tileMidBiome = biome
         }
         if (tileHeight >= this.elevationRanges['high']) {
            let biome = 'rockmountain'
            if (tileTemp < this.tempRanges['tundra']) biome = 'snowmountain'
            if (tileTemp > this.tempRanges['savanna']) biome = 'sandhill'
            tileBiome = biome
            tileHighBiome = biome
         }
         if (tileHeight >= this.elevationRanges['veryhigh']) {
            let biome = 'snowmountain'
            if (tileTemp > this.tempRanges['savanna']) biome = 'sandhill'
            tileBiome = biome
            tileVeryhighBiome = biome
         }

         this.hexMapData.setEntry(keyObj.q, keyObj.r, {
            height: tileHeight,
            biome: tileBiome,
            verylowBiome: tileVerylowBiome,
            lowBiome: tileLowBiome,
            midBiome: tileMidBiome,
            highBiome: tileHighBiome,
            veryhighBiome: tileVeryhighBiome,
            terrain: null
         })

      }

      this.hexMapData.setMaxHeight(Math.max(...this.hexMapData.getValues().map(value => value.height)));
   }

   smoothBiomes = () => {

      let keyStrings = this.hexMapData.getKeyStrings();

      let getBiomeSet = (keyString, keyStrSet) => {

         keyStrSet.add(keyString)

         //get tile biome
         let keyObj = this.hexMapData.split(keyString);
         let tileBiome = this.hexMapData.getEntry(keyObj.q, keyObj.r).biome

         let neighborKeys = this.hexMapData.getNeighborKeys(keyObj.q, keyObj.r)
         neighborKeys = neighborKeys.filter(neighborKey => this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome == tileBiome || this.biomeGroups[tileBiome].includes(this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome))
         neighborKeys = neighborKeys.filter(neighborKey => !keyStrSet.has(this.hexMapData.join(neighborKey.q, neighborKey.r)))


         if (neighborKeys.length == 0) return keyStrSet

         for (let i = 0; i < neighborKeys.length; i++) {
            //recursion
            let keyStr = this.hexMapData.join(neighborKeys[i].q, neighborKeys[i].r)
            keyStrSet = getBiomeSet(keyStr, keyStrSet)
         }

         return keyStrSet

      }

      let smoothTile = (keyString) => {
         let keyObj = this.hexMapData.split(keyString);
         let tileBiome = this.hexMapData.getEntry(keyObj.q, keyObj.r).biome

         console.log(tileBiome)

         //check if tile has non-similar biome neighbors
         let neighborKeys = this.hexMapData.getNeighborKeys(keyObj.q, keyObj.r)
         let tempMap = neighborKeys.map(key => this.hexMapData.getEntry(key.q, key.r).biome)
         neighborKeys = neighborKeys.filter(neighborKey => this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome != tileBiome)
         if (neighborKeys.length == 0) return false

         //get array of neighbor biomes
         let biomeArr = neighborKeys.map(neighborKey => this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome)

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
         neighborKeys = neighborKeys.filter(neighborKey => this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome == maxBiome)
         let neighborKeyToClone = neighborKeys[Math.floor(Math.random() * neighborKeys.length)]
         let tileToClone = this.hexMapData.getEntry(neighborKeyToClone.q, neighborKeyToClone.r)
         this.hexMapData.setEntry(keyObj.q, keyObj.r, tileToClone)

         return true
      }

      while (keyStrings.length > 0) {

         //get biome
         let keyObj = this.hexMapData.split(keyStrings[0])
         let biome = this.hexMapData.getEntry(keyObj.q, keyObj.r).biome

         //get tile set
         let keyStrSet = new Set()
         keyStrSet = getBiomeSet(keyStrings[0], keyStrSet);
         let keyStrArr = Array.from(keyStrSet)

         //remove set from keyStrings
         for (let i = 0; i < keyStrArr.length; i++) {
            let keyStrArrObj = this.hexMapData.split(keyStrArr[i])
            let keyStrArrObjBiome = this.hexMapData.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome

            if (keyStrArrObjBiome == biome) {
               let keyIndex = keyStrings.indexOf(keyStrArr[i]);
               if (keyIndex != -1) keyStrings.splice(keyIndex, 1);
            }
         }

         //Check size of biome set and fix tiles if neccessary
         if (keyStrArr.length < this.minBiomeSmoothing[biome]) {
            while (keyStrArr.length > 0) {
               let keyStrArrObj = this.hexMapData.split(keyStrArr[0])
               let keyStrArrObjBiome = this.hexMapData.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome


               if (keyStrArrObjBiome != biome) keyStrArr.shift()
               else if (smoothTile(keyStrArr[0])) keyStrArr.shift()
               else {
                  keyStrArr.push(keyStrArr.shift());
                  console.log("SHIFT")
               }
            }
         }

      }

   }


   build = (q, r, mapSize) => {

      //make a settings variable or some shit
      let noiseFluctuation = this.noiseFluctuation[mapSize]

      this.generateMap(q, r)
      this.generateBiomes(noiseFluctuation)

      if (this.hexMapData2 !== undefined) {
         this.hexMapData2.hexMap = new Map(this.hexMapData.hexMap)
         this.hexMapData2.maxHeight = this.hexMapData.maxHeight
         this.hexMapView2.hexMapData = this.hexMapData2
      }

      this.smoothBiomes()

      //mirror the map if selected
      if (this.mirror) this.mirrorMap(q, r)

      //add terrain features
      if (this.hexMapData2 === undefined) {
          this.builderTerrain.generateTerrain(mapSize)
      }

   }

   mirrorMap = (q, r) => {
      this.mirrorMapFunc(q, r)
      if (this.hexMapData2 !== undefined) this.mirrorMap2Func(q, r)
   }

}