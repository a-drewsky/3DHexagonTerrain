export default class HexMapDataUnits {

   constructor() {
      this.unitList = [];
      this.selectedUnit = null
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