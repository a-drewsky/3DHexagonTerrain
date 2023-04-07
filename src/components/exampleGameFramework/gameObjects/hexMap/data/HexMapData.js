import HexMapSelectionsClass from "./HexMapDataSelections";
import HexMapCommonUtilsClass from "../utils/HexMapCommonUtils";

export default class HexMapDataClass {

   constructor(settings, canvas) {

      this.state = {
         selectTile: 'selectTile',
         selectMovement: 'selectMovement',
         placeUnit: 'placeUnit',
         chooseRotation: 'chooseRotation',
         selectAction: 'selectAction',
         animation: 'animation'
      }
      this.state.current = this.state.selectTile

      this.renderBackground = true

      this.tileMap = new Map();
      this.posMap = new Map();
      this.rotatedMapList = []

      //to be removed
      this.shadowMap = new Map();

      this.size = canvas.width / settings.TILE_SIZE;
      this.squish = settings.HEXMAP_SQUISH;
      this.tileHeight = settings.TILE_HEIGHT;
      this.shadowRotation = settings.SHADOW_ROTATION;
      this.maxHeight = null;

      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }
      this.flatTopVecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
      this.flatTopVecR = { x: 0, y: Math.sqrt(3) * this.size }
      this.sideLength = Math.PI / 3;

      this.utils = new HexMapCommonUtilsClass()
      this.selections = new HexMapSelectionsClass()

      //will be player data
      this.resources = 0
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

      for (let i = 0; i < 12; i++) {
         //Rotate the hexmap and set the rotatedMap object
         let sortedArr = this.getKeys();

         for (let j = 0; j < sortedArr.length; j++) {
            let rotatedTile = this.utils.rotateTile(sortedArr[j].q, sortedArr[j].r, i)
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
            rotatedMap.set(this.utils.join(sortedArr[j].rotPosQ, sortedArr[j].rotPosR), { q: sortedArr[j].ogPosQ, r: sortedArr[j].ogPosR });
         }

         this.rotatedMapList[i] = rotatedMap
      }
   }

   setMapPos = (drawCanvas) => {

      for (let rotation = 0; rotation < 12; rotation++) {

         //Set map hyp
         let keys = [...this.rotatedMapList[rotation].keys()].map(key => this.utils.split(key))

         let mapWidthMax = Math.max(...keys.map(key => this.VecQ.x * key.q + this.VecR.x * key.r));
         let mapHeightMax = Math.max(...keys.map(key => this.VecQ.y * key.q * this.squish + this.VecR.y * key.r * this.squish));
         let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.VecQ.x * key.q + this.VecR.x * key.r)));
         let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.VecQ.y * key.q * this.squish + this.VecR.y * key.r * this.squish)));

         let mapWidth = Math.max(mapWidthMax, mapWidthMin)
         let mapHeight = Math.max(mapHeightMax, mapHeightMin)

         let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight) - 250; //need a variable for this or something (must be half of value used for hyp in hex map view)


         //Set the hexmap position to the center of the canvas

         let renderHexMapPos = {
            x: 0,
            y: 0
         }

         switch (rotation) {
            case 0:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 8)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 4.5)
               break;
            case 1:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 13)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 3.5)
               break;
            case 2:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7.5)
               break;
            case 3:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9.5)
               break;
            case 4:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 12.5)
               break;
            case 5:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 15)
               break;
            case 6:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19.5)
               break;
            case 7:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 20.5)
               break;
            case 8:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 16.5)
               break;
            case 9:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 14.5)
               break;
            case 10:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11.5)
               break;
            case 11:
               renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 5)
               renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9)
               break;
         }


         this.posMap.set(rotation, {
            x: renderHexMapPos.x,
            y: renderHexMapPos.y
         })
      }
   }

   setMaxHeight = () => {
      this.haxHeight = Math.max(this.getTileMap().map(entry => entry.value.height))

   }
   //END SET METHODS


   //GET METHODS
   //get an entry in the tileMap (returns a hex tile object)
   getSelectionArr = () => {
      let hoverSelection = () => {
         if (this.state.current == this.state.selectTile) return 'hover_select'
         if (this.state.current == this.state.chooseRotation) return 'hover_select'
         else if (this.state.current == this.state.placeUnit) return 'hover_place'
         else return null
      }

      let unitSelection = () => {
         if (this.state.current == this.state.chooseRotation) return 'rotate'
         if (this.state.current == this.state.selectMovement) return 'unit'
         if (this.state.current == this.state.selectAction) return 'unit'
         else return null
      }

      let selectionList = this.selections

      let filteredSelectionList = []

      if (selectionList.hover !== null && hoverSelection() !== null) filteredSelectionList.push({ position: selectionList.hover, selection: hoverSelection() })
      if (selectionList.unit !== null && unitSelection() !== null) filteredSelectionList.push({ position: selectionList.unit, selection: unitSelection() })
      if (selectionList.tile !== null) filteredSelectionList.push({ position: selectionList.tile, selection: 'tile' })
      if (selectionList.target !== null) filteredSelectionList.push({ position: selectionList.target, selection: 'target' })

      for (let item of selectionList.path) {
         filteredSelectionList.push({ position: item, selection: 'path' })
      }

      for (let selList in selectionList.pathing) {
         for (let item of selectionList.pathing[selList]) {
            filteredSelectionList.push({ position: item, selection: selList })
         }
      }
      return filteredSelectionList
   }

   getEntry = (q, r) => {
      return this.tileMap.get(q + "," + r);
   }

   getEntryRotated = (q, r, rotation) => {
      let rotatedTile = this.rotatedMapList[rotation].get(this.utils.join(q, r))
      return this.tileMap.get(rotatedTile.q + "," + rotatedTile.r)
   }

   //returns the tileMap
   getTileMap = () => {
      let map = Array.from(this.tileMap, ([key, value]) => ({ key, value }));

      let filteredMap = map.filter(entry => entry.value.groundShadowTile == false)

      return filteredMap

   }

   //returns the tileMap
   getFullMap = () => {
      return this.tileMap
   }

   //returns the number of entries in the tileMap
   getMapSize = () => {
      return this.tileMap.size
   }

   //returns all keys for the tileMap
   getKeys = () => {
      return [...this.tileMap.keys()].map(key => this.utils.split(key))
   }

   getValues = () => {
      return [...this.tileMap.values()]
   }

   //return all key strings
   getKeyStrings = () => {
      let map = this.getTileMap()
      return map.map(entry => entry.key)
   }

   //returns keys of all neighbors adjacent to (q, r)
   getNeighborKeys = (q, r) => {
      let neighbors = [];

      if (this.hasTileEntry(q, r - 1)) neighbors.push(this.utils.join(q, r - 1));
      if (this.hasTileEntry(q + 1, r - 1)) neighbors.push(this.utils.join(q + 1, r - 1));
      if (this.hasTileEntry(q + 1, r)) neighbors.push(this.utils.join(q + 1, r));
      if (this.hasTileEntry(q, r + 1)) neighbors.push(this.utils.join(q, r + 1));
      if (this.hasTileEntry(q - 1, r + 1)) neighbors.push(this.utils.join(q - 1, r + 1));
      if (this.hasTileEntry(q - 1, r)) neighbors.push(this.utils.join(q - 1, r));

      return neighbors.map(key => this.utils.split(key));
   }

   //returns keys of all neighbors adjacent to (q, r)
   getDoubleNeighborKeys = (q, r) => {
      let neighbors = [];

      if (this.hasTileEntry(q, r - 1)) neighbors.push(this.utils.join(q, r - 1));
      if (this.hasTileEntry(q + 1, r - 1)) neighbors.push(this.utils.join(q + 1, r - 1));
      if (this.hasTileEntry(q + 1, r)) neighbors.push(this.utils.join(q + 1, r));
      if (this.hasTileEntry(q, r + 1)) neighbors.push(this.utils.join(q, r + 1));
      if (this.hasTileEntry(q - 1, r + 1)) neighbors.push(this.utils.join(q - 1, r + 1));
      if (this.hasTileEntry(q - 1, r)) neighbors.push(this.utils.join(q - 1, r));

      if (this.hasTileEntry(q, r - 2)) neighbors.push(this.utils.join(q, r - 2));
      if (this.hasTileEntry(q + 1, r - 2)) neighbors.push(this.utils.join(q + 1, r - 2));
      if (this.hasTileEntry(q + 2, r - 2)) neighbors.push(this.utils.join(q + 2, r - 2));
      if (this.hasTileEntry(q + 2, r - 1)) neighbors.push(this.utils.join(q + 2, r - 1));
      if (this.hasTileEntry(q + 2, r)) neighbors.push(this.utils.join(q + 2, r));
      if (this.hasTileEntry(q + 1, r + 1)) neighbors.push(this.utils.join(q + 1, r + 1));
      if (this.hasTileEntry(q, r + 2)) neighbors.push(this.utils.join(q, r + 2));
      if (this.hasTileEntry(q - 1, r + 2)) neighbors.push(this.utils.join(q - 1, r + 2));
      if (this.hasTileEntry(q - 2, r + 2)) neighbors.push(this.utils.join(q - 2, r + 2));
      if (this.hasTileEntry(q - 2, r + 1)) neighbors.push(this.utils.join(q - 2, r + 1));
      if (this.hasTileEntry(q - 2, r)) neighbors.push(this.utils.join(q - 2, r));
      if (this.hasTileEntry(q - 1, r - 1)) neighbors.push(this.utils.join(q - 1, r - 1));

      return neighbors.map(key => this.utils.split(key));
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

   getTablePosition = (rotation) => {

      let keys = this.getKeys();

      let minR = Math.min(...keys.map(key => key.r));
      let maxR = Math.max(...keys.map(key => key.r));
      let minRminQ = Math.min(...keys.filter(key => key.r == minR).map(key => key.q));
      let minRmaxQ = Math.max(...keys.filter(key => key.r == minR).map(key => key.q));
      let maxRminQ = Math.min(...keys.filter(key => key.r == maxR).map(key => key.q));
      let maxRmaxQ = Math.max(...keys.filter(key => key.r == maxR).map(key => key.q));

      let tableDims = {
         q1: this.utils.rotateTile(minRminQ - 1, minR - 2, rotation).q,
         r1: this.utils.rotateTile(minRminQ - 1, minR - 2, rotation).r,

         q2: this.utils.rotateTile(minRmaxQ + 3, minR - 2, rotation).q,
         r2: this.utils.rotateTile(minRmaxQ + 3, minR - 2, rotation).r,

         q3: this.utils.rotateTile(maxRmaxQ + 1, maxR + 2, rotation).q,
         r3: this.utils.rotateTile(maxRmaxQ + 1, maxR + 2, rotation).r,

         q4: this.utils.rotateTile(maxRminQ - 3, maxR + 2, rotation).q,
         r4: this.utils.rotateTile(maxRminQ - 3, maxR + 2, rotation).r
      }

      let hexVecQ = rotation % 2 == 0 ? { ...this.VecQ } : { ...this.flatTopVecQ }
      let hexVecR = rotation % 2 == 0 ? { ...this.VecR } : { ...this.flatTopVecR }

      let tablePosition = [
         {
            x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q1 + hexVecR.x * tableDims.r1,
            y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q1 * this.squish + hexVecR.y * tableDims.r1 * this.squish
         },

         {
            x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q2 + hexVecR.x * tableDims.r2,
            y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q2 * this.squish + hexVecR.y * tableDims.r2 * this.squish
         },

         {
            x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q3 + hexVecR.x * tableDims.r3,
            y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q3 * this.squish + hexVecR.y * tableDims.r3 * this.squish
         },

         {
            x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q4 + hexVecR.x * tableDims.r4,
            y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q4 * this.squish + hexVecR.y * tableDims.r4 * this.squish
         }
      ]

      return [...tablePosition];
   }
   //END GET METHODS


   //CHECK METHODS
   //check if hexmap has an entry (returns a boolean)
   hasEntry = (q, r) => {
      return this.tileMap.has(this.utils.join(q, r));
   }
   hasTileEntry = (q, r) => {
      if (!this.hasEntry(q, r)) return false
      let tileObj = this.tileMap.get(this.utils.join(q, r));
      if (tileObj.groundShadowTile == true) return false
      return true
   }
   //END CHECK METHODS

   //HELPER METHODS
   hexPositionToXYPosition = (keyObj, tileHeight, rotation) => {
      let xOffset;
      let yOffset;

      if (rotation % 2 == 1) {
         xOffset = this.flatTopVecQ.x * keyObj.q + this.flatTopVecR.x * keyObj.r;
         yOffset = this.flatTopVecQ.y * keyObj.q * this.squish + this.flatTopVecR.y * keyObj.r * this.squish;
      } else {
         xOffset = this.VecQ.x * keyObj.q + this.VecR.x * keyObj.r;
         yOffset = this.VecQ.y * keyObj.q * this.squish + this.VecR.y * keyObj.r * this.squish;
      }

      return {
         x: this.posMap.get(rotation).x + xOffset,
         y: this.posMap.get(rotation).y + yOffset - tileHeight * this.tileHeight
      }

   }
}