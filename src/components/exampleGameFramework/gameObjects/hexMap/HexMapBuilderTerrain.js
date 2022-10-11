import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

    constructor(hexMapData, seedMultiplier, noiseFluctuation, terrainGenThresholds){
        this.hexMapData = hexMapData;

        this.seedMultiplier = seedMultiplier
        this.noiseFluctuation = noiseFluctuation
        this.terrainGenThresholds = terrainGenThresholds
    }

    generateTerrain = (mapSize) => {
        let noiseFluctuation = this.noiseFluctuation[mapSize]
        this.generateTrees(noiseFluctuation)
     }

    generateTrees = (noiseFluctuation) => {

        let featureSeed1 = Math.random() * this.seedMultiplier
        let featureSeed2 = Math.random() * this.seedMultiplier
  
        for (let [key, value] of this.hexMapData.getMap()) {
           let keyObj = this.hexMapData.split(key);
  
           //feature generation
           let tileFeatureNoise = noise(featureSeed1 + keyObj.q / noiseFluctuation, featureSeed1 + keyObj.r / noiseFluctuation) * noise(featureSeed2 + keyObj.q / noiseFluctuation, featureSeed2 + keyObj.r / noiseFluctuation)
  
           let terrain = {
              name: null,
              type: null,
              sprite: false
           }
  
           if (tileFeatureNoise > this.terrainGenThresholds[value.biome]) {

            switch(value.biome){
               case 'woodlands':
                  terrain = {
                     name: 'Forest',
                     type: 'trees',
                     sprite: true
                  }
                  break;
               case 'grasshill':
                  terrain = {
                     name: 'Forest',
                     type: 'trees',
                     sprite: true
                  }
                  break;
            }


           }
  
           this.hexMapData.setEntry(keyObj.q, keyObj.r, {
              height: value.height,
              biome: value.biome,
              verylowBiome: value.verylowBiome,
              lowBiome: value.lowBiome,
              midBiome: value.midBiome,
              highBiome: value.highBiome,
              veryhighBiome: value.veryhighBiome,
              terrain: terrain
           })
  
        }
  
     }

}