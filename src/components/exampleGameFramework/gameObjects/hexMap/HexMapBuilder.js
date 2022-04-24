import noise from "../../utilities/perlin";

export default class HexMapBuilderClass {

   constructor(hexMapData, hexMapView) {

      this.hexMapData = hexMapData;

      this.hexMapView = hexMapView;

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

   setTilesHeight = (noiseFluctuation, noiseSeedMultiplier, lowerNoiseThreshold, upperNoiseThreshold) => {

      let seed = Math.random() * noiseSeedMultiplier;

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let tileNoise = noise(seed+keyObj.q/noiseFluctuation, seed+keyObj.r/noiseFluctuation);

         // if(tileNoise < lowerNoiseThreshold) this.hexMapData.setEntry(keyObj.q, keyObj.r, {
         //    height: -1
         // });

         // if(tileNoise > upperNoiseThreshold) this.hexMapData.setEntry(keyObj.q, keyObj.r, {
         //    height: 1
         // });

         this.hexMapData.setEntry(keyObj.q, keyObj.r, {
            height: Math.max(Math.floor(tileNoise * 13)-3, 1)
         });

      }

      this.hexMapData.setMaxHeight(Math.max(...this.hexMapData.getValues().map(value => value.height)));
      

   }

   deleteIslands = () => {

      let keyStrings = this.hexMapData.getKeyStrings();
      let tileGroups = [];

      let getNeighborKeysInList = (q, r) => {
         let neighbors = this.hexMapData.getNeighborKeys(q, r);
         let filteredNeighbors = [];

         for (let i = 0; i < neighbors.length; i++) {
            if (!keyStrings.includes(this.hexMapData.join(neighbors[i].q, neighbors[i].r))) continue;
            filteredNeighbors.push(neighbors[i]);
         }

         return filteredNeighbors;
      }

      let addNeighbors = (keyString, tileGroup) => {

         tileGroup.add(keyString);

         let keyIndex = keyStrings.indexOf(keyString);
         if (keyIndex != -1) keyStrings.splice(keyIndex, 1);

         let key = this.hexMapData.split(keyString);
         let neighbors = getNeighborKeysInList(key.q, key.r);

         for (let i = 0; i < neighbors.length; i++) {
            addNeighbors(this.hexMapData.join(neighbors[i].q, neighbors[i].r), tileGroup);
         }
      }

      while (keyStrings.length > 0) {

         let tileGroup = new Set();
         addNeighbors(keyStrings[0], tileGroup);
         tileGroups.push(Array.from(tileGroup));

      }

      let tileGroupLengths = tileGroups.map(tileGroup => tileGroup.length);
      let longestTileGroupIndex = tileGroupLengths.indexOf(Math.max(...tileGroupLengths));
      tileGroups.splice(longestTileGroupIndex, 1);

      let tilesToRemove = [].concat(...tileGroups);

      for (let i = 0; i < tilesToRemove.length; i++) {
         let key = this.hexMapData.split(tilesToRemove[i])
         this.hexMapData.deleteEntry(key.q, key.r);
      }

   }

   
   build = (q, r, mapSize, mapGeneration) => {

      //make a settings variable or some shit
      let noiseFluctuation = (mapSize == "small" ? 3 : mapSize == "medium" ? 4 : 6)
      let noiseSeedMultiplier = 10
      let lowerNoiseThreshold = 0.4
      let upperNoiseThreshold = 0.7

      if (mapGeneration == true) {
            this.generateMap(q, r);
            this.setTilesHeight(noiseFluctuation, noiseSeedMultiplier, lowerNoiseThreshold, upperNoiseThreshold);
            //this.deleteIslands();
      } else {
            this.generateMap(q, r);
      }
      this.hexMapView.initialize();
   }

}