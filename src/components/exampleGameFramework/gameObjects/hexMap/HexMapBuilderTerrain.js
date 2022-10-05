import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

    constructor(hexMapData, seedMultiplier, noiseFluctuation){
        this.hexMapData = hexMapData;

        this.seedMultiplier = seedMultiplier
        this.noiseFluctuation = noiseFluctuation
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
              type: null
           }
  
           if (tileFeatureNoise > 0.4/* needs setting */ && value.biome == 'woodlands') {
              terrain = {
                 name: 'Forest',
                 type: 'trees'
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