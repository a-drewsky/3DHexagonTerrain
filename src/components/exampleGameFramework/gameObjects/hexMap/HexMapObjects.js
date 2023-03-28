export default class HexMapObjectClass {

   constructor(utils) {
      this.terrainList = [];
      this.unitList = [];
      this.selectedUnit = null

      this.utils = utils
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

}