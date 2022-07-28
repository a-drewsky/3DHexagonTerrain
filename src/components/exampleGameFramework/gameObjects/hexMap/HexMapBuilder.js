import noise from "../../utilities/perlin";

export default class HexMapBuilderClass {

   constructor(hexMapData, hexMapView, elevationRanges, lowTerrainGenerationRanges, maxElevation, elevationMultiplier) {

      this.hexMapData = hexMapData;
      this.hexMapView = hexMapView;

      this.elevationRanges = elevationRanges
      this.lowTerrainGenerationRanges = lowTerrainGenerationRanges
      this.maxElevation = maxElevation
      this.elevationMultiplier = elevationMultiplier

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

   generateBiomes = (noiseFluctuation, noiseSeedMultiplier) => {

      let seed = Math.random() * noiseSeedMultiplier;

      let seed2 = Math.random() * noiseSeedMultiplier

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let tileHeightNoise = noise(seed+keyObj.q/noiseFluctuation, seed+keyObj.r/noiseFluctuation) * noise(seed2+keyObj.q/noiseFluctuation, seed2+keyObj.r/noiseFluctuation);

         let tileHeight = Math.ceil(tileHeightNoise * this.elevationMultiplier);

         //set height
         let heightSet = false;
         for(let i in this.lowTerrainGenerationRanges){
            if(tileHeight <= this.lowTerrainGenerationRanges[i]){
               tileHeight = parseInt(i);
               heightSet = true;
               break;
            } 
         }
         if(!heightSet) tileHeight -= this.lowTerrainGenerationRanges[4]-4;
         
         tileHeight = Math.min(tileHeight, this.maxElevation)

         //set biome
         let tileBiome = null
         let tileVerylowBiome = null
         let tileLowBiome = null
         let tileMidBiome = null
         let tileHighBiome = null
         let tileVeryhighBiome = null

         if(tileHeight >= this.elevationRanges['verylow']){
            let biome = 'water'

            tileBiome = biome
            tileVerylowBiome = biome
         }
         if(tileHeight >= this.elevationRanges['low']){
            let biome = 'woodlands'
            tileBiome = biome
            tileLowBiome = biome
         }
         if(tileHeight >= this.elevationRanges['mid']){
            let biome = 'grasshill'
            tileBiome = biome
            tileMidBiome = biome
         }
         if(tileHeight >= this.elevationRanges['high']){
            let biome = 'rockmountain'
            tileBiome = biome
            tileHighBiome = biome
         }
         if(tileHeight >= this.elevationRanges['veryhigh']){
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
      let noiseFluctuation = (mapSize == "small" ? 3 : mapSize == "medium" ? 5 : 8)
      let noiseSeedMultiplier = 10

      if (mapGeneration == true) {
            this.generateMap(q, r);
            this.generateBiomes(noiseFluctuation, noiseSeedMultiplier);
      } else {
            this.generateMap(q, r);
      }
      this.hexMapView.initialize();
   }

}