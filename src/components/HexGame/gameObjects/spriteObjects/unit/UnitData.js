import UnitClass from "./Unit"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitDataClass {

    constructor(mapData, tileData, images, uiController, globalState) {
        this.mapData = mapData
        this.tileData = tileData
        this.images = images
        this.uiController = uiController
        this.globalState = globalState

        this.unitList = [];
        this.selectedUnit = null
        this.placementUnit = null

        this.commonUtils = new CommonHexMapUtilsClass()
    }

    //return terrain at tile (q, r) or null if the tile has no terrain
    getUnit = (pos) => {
        let index = this.unitList.findIndex(unit => this.commonUtils.tilesEqual(unit.position, pos))
        if (index == -1) return null
        return this.unitList[index]
    }

    hasUnit = (pos) => {
        let index = this.unitList.findIndex(unit => this.commonUtils.tilesEqual(unit.position, pos))
        if (index == -1) return false
        return true
    }

    //delete unit at position (q, r)
    deleteUnit = (pos) => {
        let index = this.unitList.findIndex(unit => this.commonUtils.tilesEqual(unit.position, pos))
        if (index == -1) return
        this.unitList.splice(index, 1)
    }

    createUnit = (unitId) => {
        let newUnit = new UnitClass({q: null, r: null}, unitId, this.mapData, this.tileData, this.images, this.uiController, this.globalState)
        this.placementUnit = newUnit
    }

    eraseUnit = () => {
        this.placementUnit = null
    }

    addUnit = (pos) => {
        let newUnit = this.placementUnit
        this.placementUnit = null
        newUnit.position = { ...pos }
        this.unitList.push(newUnit)
        return newUnit
    }

    //should be removed
    selectUnit = (q, r) => {
        this.selectedUnit = this.getUnit({ q: q, r: r })
    }

    unselectUnit = () => {
        this.selectedUnit = null
    }

}