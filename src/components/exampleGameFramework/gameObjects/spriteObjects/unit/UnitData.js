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
        this.placementUnit = null
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

    createUnit = (unitId) => {
        let newUnit = new UnitClass({q: null, r: null}, unitId, this.hexMapData, this.tileData, this.images.unit, this.uiController, this.globalState)
        this.placementUnit = newUnit
    }

    eraseUnit = () => {
        this.placementUnit = null
    }

    addUnit = (q, r) => {
        let newUnit = this.placementUnit
        this.placementUnit = null
        newUnit.position = {q: q, r: r}
        this.unitList.push(newUnit)
        return newUnit
    }

    selectUnit = (q, r) => {
        this.selectedUnit = this.getUnit(q, r)
    }

    unselectUnit = () => {
        this.selectedUnit.setIdle()
        this.selectedUnit = null
        this.hexMapData.resetState()
    }

}