import noise from "../../utilities/perlin";

export default class HexMapBuilderClass {

   constructor(hexMapData, hexMapView, elevationRanges, lowTerrainGenerationRanges, maxElevation, elevationMultiplier, seedMultiplier, noiseFluctuation, tempRanges, waterTempRanges, biomeGroups, minBiomeSizes) {

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
      this.minBiomeSizes = minBiomeSizes

   }

   generateMap = (Qgen, Rgen) => {

      for (let r = 0; r < Rgen; r++) {
         for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
            this.hexMapData.setEntry(q, r, {
               height: 0
            });
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
            if (tileTemp < this.waterTempRanges['frozenWater']) biome = 'frozenWater'
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
         }
         if (tileHeight >= this.elevationRanges['mid']) {
            let biome = 'grasshill'
            if (tileTemp < this.tempRanges['tundra']) biome = 'snowmountain'
            if (tileTemp > this.tempRanges['savanna']) biome = 'sandhill'

            tileBiome = biome
            tileMidBiome = biome
         }
         if (tileHeight >= this.elevationRanges['high']) {
            let biome = 'rockmountain'
            if (tileTemp < this.tempRanges['tundra']) biome = 'snowmountain'
            if (tileTemp > this.tempRanges['savanna']) biome = 'rockhill'
            tileBiome = biome
            tileHighBiome = biome
         }
         if (tileHeight >= this.elevationRanges['veryhigh']) {
            let biome = 'snowmountain'
            if (tileTemp > this.tempRanges['savanna']) biome = 'mesa'
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
            veryhighBiome: tileVeryhighBiome
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
         neighborKeys = neighborKeys.filter(neighborKey => this.hexMapData.getEntry(neighborKey.q, neighborKey.r).biome == tileBiome)
         neighborKeys = neighborKeys.filter(neighborKey => !keyStrSet.has(this.hexMapData.join(neighborKey.q, neighborKey.r)))


         if (neighborKeys.length == 0) return keyStrSet

         for (let i = 0; i < neighborKeys.length; i++) {
            //recursion
            let keyStr = this.hexMapData.join(neighborKeys[i].q, neighborKeys[i].r)
            keyStrSet = getBiomeSet(keyStr, keyStrSet)
         }

         return keyStrSet

      }

      while (keyStrings.length > 0) {

         //get biome set
         let keyStrSet = new Set()
         keyStrSet = getBiomeSet(keyStrings[0], keyStrSet);

         //remove set from keyStrings
         let keyStrArr = Array.from(keyStrSet)
         console.log(keyStrArr.length)
         for (let i = 0; i < keyStrArr.length; i++) {
            let keyIndex = keyStrings.indexOf(keyStrArr[i]);
            if (keyIndex != -1) keyStrings.splice(keyIndex, 1);
         }

         //Check size of biome set and fix tiles if neccessary

      }

   }


   build = (q, r, mapSize, mapGeneration) => {

      //make a settings variable or some shit
      let noiseFluctuation = this.noiseFluctuation[mapSize]

      if (mapGeneration == true) {
         this.generateMap(q, r)
         this.generateBiomes(noiseFluctuation)
         this.smoothBiomes()
      } else {
         this.generateMap(q, r)
      }
      this.hexMapView.initialize()
   }

}