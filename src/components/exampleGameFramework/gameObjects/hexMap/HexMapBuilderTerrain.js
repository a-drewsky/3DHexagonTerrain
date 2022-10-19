import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

   constructor(hexMapData, seedMultiplier, noiseFluctuation, terrainGenThresholds) {
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

      let treeSeed1 = Math.random() * this.seedMultiplier
      let treeSeed2 = Math.random() * this.seedMultiplier

      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         //feature generation
         let tileTreeNoise = noise(treeSeed1 + keyObj.q / noiseFluctuation, treeSeed1 + keyObj.r / noiseFluctuation) * noise(treeSeed2 + keyObj.q / noiseFluctuation, treeSeed2 + keyObj.r / noiseFluctuation)

         if (tileTreeNoise > this.terrainGenThresholds[value.biome]) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               height: value.height
            }

            switch (value.biome) {
               case 'woodlands':
                  terrain.name = 'Forest'
                  terrain.type = 'trees'
                  terrain.sprite = 'oaktree_sprite'
                  terrain.state = Math.floor(Math.random()*64)
                  terrain.tileHeight = 2
                  break;
               case 'grasshill':
                  terrain.name = 'Forest'
                  terrain.type = 'trees'
                  terrain.sprite = 'oaktree_sprite'
                  terrain.state = Math.floor(Math.random()*64)
                  terrain.tileHeight = 2
                  break;
               default:
                  continue;
            }

            this.hexMapData.terrainList.push(terrain)

            this.hexMapData.setEntry(keyObj.q, keyObj.r, {
               height: value.height,
               biome: value.biome,
               verylowBiome: value.verylowBiome,
               lowBiome: value.lowBiome,
               midBiome: value.midBiome,
               highBiome: value.highBiome,
               veryhighBiome: value.veryhighBiome,
               terrain: this.hexMapData.terrainList.length - 1
            })

         }



      }

   }

}