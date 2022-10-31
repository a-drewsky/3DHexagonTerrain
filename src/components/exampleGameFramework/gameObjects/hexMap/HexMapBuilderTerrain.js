import noise from "../../utilities/perlin";

export default class HexMapBuilderTerrainClass {

   constructor(hexMapData, seedMultiplier, noiseFluctuation, terrainGenThresholds, terrainGenMaxNeighbors, rockGenThreshold) {
      this.hexMapData = hexMapData;

      this.seedMultiplier = seedMultiplier
      this.noiseFluctuation = noiseFluctuation
      this.terrainGenThresholds = terrainGenThresholds
      this.terrainGenMaxNeighbors = terrainGenMaxNeighbors
      this.rockGenThreshold = rockGenThreshold
   }

   generateTerrain = (mapSize) => {
      let noiseFluctuation = this.noiseFluctuation[mapSize]
      this.generateModifiers(noiseFluctuation)
      this.generateSavannaTrees()
      this.generateLargeRocks()
   }

   generateSavannaTrees = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let savannaTreeThreshold = 0.95

         let spawnChance = Math.random();

         if ((value.biome == 'savanna' || value.biome == 'savannahill') && spawnChance > savannaTreeThreshold && !this.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               height: value.height,
               name: 'Savanna Tree',
               type: 'structure',
               sprite: 'savannatree',
               state: 0,
               tileHeight: 3,
               images: []
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

   generateLargeRocks = () => {
      for (let [key, value] of this.hexMapData.getMap()) {
         let keyObj = this.hexMapData.split(key);

         let replacesmallRockThreshold = 0.9

         let spawnChance = Math.random();

         if (value.terrain && this.hexMapData.terrainList[value.terrain].name == 'Rocks' && spawnChance > replacesmallRockThreshold) {

            console.log("ROCKS")

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               height: value.height,
               name: 'Large Rock',
               type: 'structure',
               sprite: 'largerock',
               state: 0,
               tileHeight: 2,
               images: []
            }

            this.hexMapData.terrainList[value.terrain] = terrain

            this.hexMapData.setEntry(keyObj.q, keyObj.r, {
               height: value.height,
               biome: value.biome,
               verylowBiome: value.verylowBiome,
               lowBiome: value.lowBiome,
               midBiome: value.midBiome,
               highBiome: value.highBiome,
               veryhighBiome: value.veryhighBiome,
               terrain: value.terrain
            })

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

         if (tileTreeNoise[value.biome] > this.terrainGenThresholds[value.biome] && !this.maxNeighbors(keyObj.q, keyObj.r, value.biome)) {

            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               height: value.height
            }

            switch (value.biome) {
               case 'woodlands':
               case 'grasshill':
                  terrain.name = 'Forest'
                  terrain.type = 'modifier'
                  terrain.sprite = 'oaktree'
                  terrain.state = 0
                  terrain.tileHeight = 2
                  terrain.images = []
                  break;
               case 'tundra':
               case 'snowhill':
                  terrain.name = 'Forest'
                  terrain.type = 'modifier'
                  terrain.sprite = 'tundratree'
                  terrain.state = 0
                  terrain.tileHeight = 3
                  terrain.images = []
                  break;
               case 'desert':
               case 'sandhill':
                  terrain.name = 'Cacti'
                  terrain.type = 'modifier'
                  terrain.sprite = 'deserttree'
                  terrain.state = 0
                  terrain.tileHeight = 3
                  terrain.images = []
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

         } else if (this.rockGenThreshold[value.biome] && tileRockNoise > this.rockGenThreshold[value.biome]) {
            let terrain = {
               position: {
                  q: keyObj.q,
                  r: keyObj.r
               },
               height: value.height,
               name: 'Rocks',
               type: 'modifier',
               sprite: 'rocks',
               state: 0,
               tileHeight: 1,
               images: []
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

   maxNeighbors = (q, r, biome) => {

      let maxNeighbors = this.terrainGenMaxNeighbors[biome]

      let neighborKeys = this.hexMapData.getNeighborKeys(q, r)

      let terrainCount = 0;


      for (let i = 0; i < neighborKeys.length; i++) {
         let tile = this.hexMapData.getEntry(neighborKeys[i].q, neighborKeys[i].r)
         console.log(tile)
         if (tile.biome == biome && tile.terrain != null) terrainCount++
      }

      if (terrainCount > maxNeighbors) return true

      return false
   }

}