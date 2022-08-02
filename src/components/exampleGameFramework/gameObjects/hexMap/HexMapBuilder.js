import noise from "../../utilities/perlin";

export default class HexMapBuilderClass {

   constructor(hexMapData, hexMapView, elevationRanges, lowTerrainGenerationRanges, maxElevation, elevationMultiplier, seedMultiplier, noiseFluctuation, tempRanges) {

      this.hexMapData = hexMapData;
      this.hexMapView = hexMapView;

      this.elevationRanges = elevationRanges
      this.lowTerrainGenerationRanges = lowTerrainGenerationRanges
      this.maxElevation = maxElevation
      this.elevationMultiplier = elevationMultiplier
      this.seedMultiplier = seedMultiplier
      this.noiseFluctuation = noiseFluctuation
      this.tempRanges = tempRanges

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
      let drySeed1 = Math.random() * this.seedMultiplier
      let drySeed2 = Math.random() * this.seedMultiplier

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

            tileBiome = biome
            tileVerylowBiome = biome
         }
         if (tileHeight >= this.elevationRanges['low']) {
            let biome

            // if (tileTemp > this.tempBarrier) {
            //    if (tileDryness > dryBarrier) biome = 'savanna'
            //    else biome = 'desert'
            // } else {
            //    if (tileDryness > dryBarrier) biome = 'woodlands'
            //    else biome = 'tundra'
            // }

            for(let range in this.tempRanges){
               if(tileTemp < this.tempRanges[range]){
                  biome = range
                  break;
               } 
            }
            console.log(biome)

            tileBiome = biome
            tileLowBiome = biome
         }
         if (tileHeight >= this.elevationRanges['mid']) {
            let biome = 'grasshill'
            tileBiome = biome
            tileMidBiome = biome
         }
         if (tileHeight >= this.elevationRanges['high']) {
            let biome = 'rockmountain'
            tileBiome = biome
            tileHighBiome = biome
         }
         if (tileHeight >= this.elevationRanges['veryhigh']) {
            let biome = 'snowmountain'
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


   build = (q, r, mapSize, mapGeneration) => {

      //make a settings variable or some shit
      let noiseFluctuation = this.noiseFluctuation[mapSize]

      if (mapGeneration == true) {
         this.generateMap(q, r);
         this.generateBiomes(noiseFluctuation);
      } else {
         this.generateMap(q, r);
      }
      this.hexMapView.initialize();
   }

}