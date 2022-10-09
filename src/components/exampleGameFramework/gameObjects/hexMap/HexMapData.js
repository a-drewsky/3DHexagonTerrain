export default class HexMapDataClass {

   constructor(size, squish, tileHeight, initShadowRotation) {
      this.hexMap = new Map();

      this.posMap = new Map();

      this.size = size;
      this.squish = squish;

      this.VecQ = { x: Math.sqrt(3) * size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * size, y: 3 / 2 * size }
      
      this.flatTopVecQ = { x: 3 / 2 * size, y: Math.sqrt(3) / 2 * size }
      this.flatTopVecR = { x: 0, y: Math.sqrt(3) * size }

      this.sideLength = Math.PI / 3;
      
      this.rotation = initShadowRotation;

      this.tileHeight = tileHeight;

      this.maxHeight = null;
   }


   //SET METHODS
   //Set an entry in the hexmap (void)
   setEntry = (q, r, obj) => {
      this.hexMap.set(q + ',' + r, obj);
   }

   //delete an entry in the hexmap (void)
   deleteEntry = (q, r) => {
      this.hexMap.delete(q + "," + r);
   }

   setDimensions = (x, y) => {
      this.x = x;
      this.y = y;
   }

   setMaxHeight = (maxHeight) => {
      this.maxHeight = maxHeight;
   }
   //END SET METHODS

   
   //GET METHODS
   //get an entry in the hexmap (returns a hex tile object)
   getEntry = (q, r) => {
      return this.hexMap.get(q + "," + r);
   }

   //returns the hexmap
   getMap = () => {
      return this.hexMap
   }

   //returns the number of entries in the hexmap
   getMapSize = () => {
      return this.hexMap.size
   }

   //returns all keys for the hexmap
   getKeys = () => {
      return [...this.hexMap.keys()].map(key => this.split(key))
   }

   getValues = () => {
      return [...this.hexMap.values()]
   }

   //return all key strings
   getKeyStrings = () => {
      return [...this.hexMap.keys()]
   }

   //returns keys of all neighbors adjacent to (q, r)
   getNeighborKeys = (q, r) => {
      let neighbors = [];

      if (this.hasEntry(q, r - 1)) neighbors.push(this.join(q, r - 1));
      if (this.hasEntry(q + 1, r - 1)) neighbors.push(this.join(q + 1, r - 1));
      if (this.hasEntry(q + 1, r)) neighbors.push(this.join(q + 1, r));
      if (this.hasEntry(q, r + 1)) neighbors.push(this.join(q, r + 1));
      if (this.hasEntry(q - 1, r + 1)) neighbors.push(this.join(q - 1, r + 1));
      if (this.hasEntry(q - 1, r)) neighbors.push(this.join(q - 1, r));

      return neighbors.map(key => this.split(key));
   }

   //returns keys of all neighbors adjacent to (q, r) that have 6 neighbors
   getNeighborKeysExceptEdges = (q, r) => {

      let neighborKeys = this.getNeighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighborKeys.length; i++) {
         let key = neighborKeys[i];
         if (this.getNeighborKeys(key.q, key.r).length != 6) continue;
         filteredNeighbors.push(key);
      }

      return filteredNeighbors;

   }

   //returns keys of all neighbors adjacent to (q, r) that have less than 6 neighbors
   getNeighborKeysOnlyEdges = (q, r) => {

      let neighborKeys = this.getNeighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighborKeys.length; i++) {
         let key = neighborKeys[i];
         if (this.getNeighborKeys(key.q, key.r).length == 6) continue;
         filteredNeighbors.push(key);
      }

      return filteredNeighbors;

   }

   //returns a random tile
   getRandomTile = () => {
      let keys = this.getKeys();

      return keys[Math.floor(Math.random() * keys.length)];
   }

   //Returns a random 
   getRandomTileExceptEdges = () => {
      let keys = this.getKeys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.getNeighborKeys(key.q, key.r).length != 6) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]
   }

   getRandomTileOnlyEdges = () => {
      let keys = this.getKeys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.getNeighborKeys(key.q, key.r).length == 6) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]
   }
   //END GET METHODS


   //CHECK METHODS
   //check if hexmap has an entry (returns a boolean)
   hasEntry = (q, r) => {
      return this.hexMap.has([q, r].join(','));
   }
   //END CHECK METHODS


   //HELPER METHODS
   //converts key string to key object (returns a key object)
   split = (key) => {
      let nums = key.split(',').map(Number);
      return {
         q: nums[0],
         r: nums[1]
      }
   }

   //converts a key object to a key string (returns a key string)
   join = (q, r) => {
      return [q, r].join(',')
   }
   
   //round floating hex coords to nearest integer hex coords
   roundToNearestHex = (q, r) => {
      let fracQ = q;
      let fracR = r;
      let fracS = -1 * q - r

      let roundQ = Math.round(fracQ);
      let roundR = Math.round(fracR);
      let roundS = Math.round(fracS);

      let diffQ = Math.abs(roundQ - fracQ);
      let diffR = Math.abs(roundR - fracR);
      let diffS = Math.abs(roundS - fracS);

      if (diffQ > diffR && diffQ > diffS) {
         roundQ = -1 * roundR - roundS
      } else if (diffR > diffS) {
         roundR = -1 * roundQ - roundS
      } else {
         roundS = -1 * roundQ - roundR
      }

      return {
         q: roundQ,
         r: roundR
      }

   }
   //END HELPER METHODS
}