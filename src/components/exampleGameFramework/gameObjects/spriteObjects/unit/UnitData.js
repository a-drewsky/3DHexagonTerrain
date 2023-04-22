import UnitClass from "./Unit"

export default class UnitDataClass {

    constructor(hexMapData, tileData, images, uiController, globalState) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.images = images
        this.uiController = uiController
        this.globalState = globalState

        this.unitList = [];
        this.selectedUnit = null
    }

    //return terrain at tile (q, r) or null if the tile has no terrain
    getUnit = (q, r) => {
        let index = this.unitList.findIndex(unit => unit.position.q == q && unit.position.r == r)
        if (index == -1) return null
        return this.unitList[index]
    }

    hasUnit = (q, r) => {
        let index = this.unitList.findIndex(unit => unit.position.q == q && unit.position.r == r)
        if (index == -1) return false
        return true
    }

    //delete unit at position (q, r)
    deleteUnit = (q, r) => {
        let index = this.unitList.findIndex(unit => unit.position.q == q && unit.position.r == r)
        if (index == -1) return
        this.unitList.splice(index, 1)
    }

    addUnit = (q, r) => {
        let newUnit = new UnitClass({ q: q, r: r }, this.hexMapData, this.tileData, this.images.unit, this.uiController, this.globalState)
        this.unitList.push(newUnit)
        return this.getUnit(q, r)
    }

}