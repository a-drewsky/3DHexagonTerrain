export default class HexMapDataClass {

   constructor(settings, canvas) {

      this.state = {
         selectTile: 'selectTile',
         selectMovement: 'selectMovement',
         placeUnit: 'placeUnit',
         chooseRotation: 'chooseRotation',
         selectAction: 'selectAction',
         animation: 'animation',
         current: null
      }
      this.state.current = this.state.selectTile


      this.tileMap = new Map();
      this.shadowMap = new Map();
      this.posMap = new Map();
      this.rotatedMapList = []
      this.terrainList = [];
      this.unitList = [];

      this.selections = {
         info: null,
         unit: null,
         target: null,
         rotate: null,
         path: [],
         movement: [],
         action: [],
         attack: [],
         hover_select: null,
         hover_place: null
      }

      // this.selections = {
      //    hover: null,
      //    tile: null,
      //    unit: null,
      //    pathing: {
      //       path: [],
      //       movement: [],
      //       action: [],
      //       attack: []
      //    }
      // }

      this.size = canvas.width / settings.TILE_SIZE;
      this.squish = settings.HEXMAP_SQUISH;
      this.tileHeight = settings.TILE_HEIGHT;
      this.shadowRotation = settings.SHADOW_ROTATION;

      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }
      this.flatTopVecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
      this.flatTopVecR = { x: 0, y: Math.sqrt(3) * this.size }
      this.sideLength = Math.PI / 3;

      this.maxHeight = null;

      //should be camera data
      this.clickDist = 20
      this.clickPos = null
      this.clickMovePos = null

      //will be player data
      this.resources = 0
      this.selectedUnit = null
   }


   //SET METHODS
   //Set an entry in the tileMap (void)
   setEntry = (q, r, obj) => {
      this.tileMap.set(q + ',' + r, obj);
   }

   //delete an entry in the tileMap (void)
   deleteEntry = (q, r) => {
      this.tileMap.delete(q + "," + r);
   }

   setDimensions = (x, y) => {
      this.x = x;
      this.y = y;
   }

   setMaxHeight = (maxHeight) => {
      this.maxHeight = maxHeight;
   }

   setRotatedMapList = () => {
      let rotateTile = (q, r, rotation) => {


         let s = -q - r;
         let angle = rotation * 15;
         if (rotation % 2 == 1) angle -= 15;

         let newQ = q;
         let newR = r;
         let newS = s;

         for (let i = 0; i < angle; i += 30) {
            q = -newR;
            r = -newS;
            s = -newQ;

            newQ = q;
            newR = r;
            newS = s;
         }

         return {
            q: newQ,
            r: newR
         }

      }

      for (let i = 0; i < 12; i++) {
         //Rotate the hexmap and set the rotatedMap object
         let sortedArr = this.getKeys();

         for (let j = 0; j < sortedArr.length; j++) {
            let rotatedTile = rotateTile(sortedArr[j].q, sortedArr[j].r, i)
            sortedArr[j] = {
               rotPosQ: rotatedTile.q,
               rotPosR: rotatedTile.r,
               ogPosQ: sortedArr[j].q,
               ogPosR: sortedArr[j].r
            };
         }

         sortedArr.sort((a, b) => { return a.rotPosR - b.rotPosR || a.rotPosQ - b.rotPosQ });

         let rotatedMap = new Map();

         for (let j = 0; j < sortedArr.length; j++) {
            rotatedMap.set(this.join(sortedArr[j].rotPosQ, sortedArr[j].rotPosR), {q: sortedArr[j].ogPosQ, r: sortedArr[j].ogPosR});
         }

         this.rotatedMapList[i] = rotatedMap
      }
   }

   setMapPos = (rotation, renderCanvasDims) => {

      //Set map hyp
      let keys = [...this.rotatedMapList[rotation].keys()].map(key => this.split(key))

      let mapWidthMax = Math.max(...keys.map(key => this.VecQ.x * key.q + this.VecR.x * key.r));
      let mapHeightMax = Math.max(...keys.map(key => this.VecQ.y * key.q * this.squish + this.VecR.y * key.r * this.squish));
      let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.VecQ.x * key.q + this.VecR.x * key.r)));
      let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.VecQ.y * key.q * this.squish + this.VecR.y * key.r * this.squish)));

      let mapWidth = Math.max(mapWidthMax, mapWidthMin)
      let mapHeight = Math.max(mapHeightMax, mapHeightMin)

      let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);


      //Set the hexmap position to the center of the canvas

      let renderHexMapPos = {
          x: 0,
          y: 0
      }

      switch (rotation) {
          case 0:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 8)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 4.5)
              break;
          case 1:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 13)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 3.5)
              break;
          case 2:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7.5)
              break;
          case 3:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9.5)
              break;
          case 4:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 12.5)
              break;
          case 5:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 15)
              break;
          case 6:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19.5)
              break;
          case 7:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 20.5)
              break;
          case 8:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 16.5)
              break;
          case 9:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 14.5)
              break;
          case 10:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11.5)
              break;
          case 11:
              renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 5)
              renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9)
              break;
      }


      this.posMap.set(rotation, {
          x: renderHexMapPos.x,
          y: renderHexMapPos.y
      })
  }
   //END SET METHODS


   //GET METHODS
   //get an entry in the tileMap (returns a hex tile object)
   getEntry = (q, r) => {
      return this.tileMap.get(q + "," + r);
   }

   getEntryRotated = (q, r, rotation) => {
      let rotatedTile = this.rotatedMapList[rotation].get(this.join(q, r))
      return this.tileMap.get(rotatedTile.q + "," + rotatedTile.r)
   }

   //returns the tileMap
   getMap = () => {
      return this.tileMap
   }

   //returns the number of entries in the tileMap
   getMapSize = () => {
      return this.tileMap.size
   }

   //returns all keys for the tileMap
   getKeys = () => {
      return [...this.tileMap.keys()].map(key => this.split(key))
   }

   getValues = () => {
      return [...this.tileMap.values()]
   }

   //return all key strings
   getKeyStrings = () => {
      return [...this.tileMap.keys()]
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

   //delete unit at position (q, r)
   deleteUnit = (q, r) => {
      let index = this.unitList.findIndex(unit => unit.position.q == q && unit.position.r == r)
      if (index == -1) return
      this.unitList.splice(index, 1)
   }

   //return the selected tile or null
   getSelectedTile = () => {
      let selected = this.selections['tile']
      if (selected === null) return null
      return this.getEntry(selected.q, selected.r)
   }

   //return the selected unit tile or null
   getSelectedUnitTile = () => {
      let selected = this.selections['unit']
      if (selected === null) return null
      return this.getEntry(selected.q, selected.r)
   }

   //return the selected unit tile or null
   // getSelectedTargetTile = () => {
   //    let selected = this.selections['target']
   //    if (selected === null) return null
   //    return this.getEntry(selected.q, selected.r)
   // }

   //return the selected unit tile or null
   getSelectedUnit = () => {
      let selected = this.selections['unit']
      if (selected === null) return null
      return this.unitList.find(unit => unit.position.q == selected.q && unit.position.r == selected.r)
   }

   //return the selected unit tile or null
   // getSelectedUnitToRotate = () => {
   //    let selected = this.selections['rotate']
   //    if (selected === null) return null
   //    return this.unitList.find(unit => unit.position.q == selected.q && unit.position.r == selected.r)
   // }

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
      return this.tileMap.has([q, r].join(','));
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