export default class HexMapDataClass {

   constructor(settings, canvas) {
      this.hexMap = new Map();

      this.posMap = new Map();

      this.terrainList = [];

      this.unitList = [];

      this.size = canvas.width / 25;
      this.squish = settings.HEXMAP_SQUISH;

      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.flatTopVecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
      this.flatTopVecR = { x: 0, y: Math.sqrt(3) * this.size }

      this.sideLength = Math.PI / 3;

      this.shadowRotation = settings.SHADOW_ROTATION;

      this.tileHeight = settings.TILE_HEIGHT;

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

   //return index of terrain at tile (q, r) or -1 if the tile has no terrain
   getTerrainIndex = (q, r) => {
      return this.terrainList.findIndex(terrain => terrain.position.q == q && terrain.position.r == r)
   }

   //return terrain at tile (q, r) or null if the tile has no terrain
   getTerrain = (q, r) => {
      let index = this.terrainList.findIndex(terrain => terrain.position.q == q && terrain.position.r == r)
      if (index == -1) return null
      return this.terrainList[index]
   }

   //return terrain at tile (q, r) or null if the tile has no terrain
   getUnit = (q, r) => {
      let index = this.unitList.findIndex(unit => unit.position.q == q && unit.position.r == r)
      if (index == -1) return null
      return this.unitList[index]
   }

   //return the selected tile or null
   getSelected = () => {
      let selected = this.getValues().find(tile => tile.selected == 'general')
      if (selected === undefined) return null
      return selected
   }

   //return the selected unit tile or null
   getSelectedUnitTile = () => {
      let selectedTile = this.getValues().find(tile => tile.selected == 'unit')
      if (selectedTile === undefined) return null
      return selectedTile
   }

   //return the selected unit tile or null
   getSelectedUnit = () => {
      let selectedTile = this.getValues().find(tile => tile.selected == 'unit')
      if (selectedTile === undefined) return null
      return this.unitList.find(unit => unit.position.q == selectedTile.originalPos.q && unit.position.r == selectedTile.originalPos.r)
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

   //returns keys of all neighbors adjacent to (q, r)
   getDoubleNeighborKeys = (q, r) => {
      let neighbors = [];

      if (this.hasEntry(q, r - 1)) neighbors.push(this.join(q, r - 1));
      if (this.hasEntry(q + 1, r - 1)) neighbors.push(this.join(q + 1, r - 1));
      if (this.hasEntry(q + 1, r)) neighbors.push(this.join(q + 1, r));
      if (this.hasEntry(q, r + 1)) neighbors.push(this.join(q, r + 1));
      if (this.hasEntry(q - 1, r + 1)) neighbors.push(this.join(q - 1, r + 1));
      if (this.hasEntry(q - 1, r)) neighbors.push(this.join(q - 1, r));

      if (this.hasEntry(q, r - 2)) neighbors.push(this.join(q, r - 2));
      if (this.hasEntry(q + 1, r - 2)) neighbors.push(this.join(q + 1, r - 2));
      if (this.hasEntry(q + 2, r - 2)) neighbors.push(this.join(q + 2, r - 2));
      if (this.hasEntry(q + 2, r - 1)) neighbors.push(this.join(q + 2, r - 1));
      if (this.hasEntry(q + 2, r)) neighbors.push(this.join(q + 2, r));
      if (this.hasEntry(q + 1, r + 1)) neighbors.push(this.join(q + 1, r + 1));
      if (this.hasEntry(q, r + 2)) neighbors.push(this.join(q, r + 2));
      if (this.hasEntry(q - 1, r + 2)) neighbors.push(this.join(q - 1, r + 2));
      if (this.hasEntry(q - 2, r + 2)) neighbors.push(this.join(q - 2, r + 2));
      if (this.hasEntry(q - 2, r + 1)) neighbors.push(this.join(q - 2, r + 1));
      if (this.hasEntry(q - 2, r)) neighbors.push(this.join(q - 2, r));
      if (this.hasEntry(q - 1, r - 1)) neighbors.push(this.join(q - 1, r - 1));

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