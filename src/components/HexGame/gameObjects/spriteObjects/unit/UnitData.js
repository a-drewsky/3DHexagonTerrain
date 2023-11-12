import UnitClass from "./Unit"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitDataClass {

    constructor(mapData, tileData, images, uiController) {
        this.mapData = mapData
        this.tileData = tileData
        this.images = images
        this.uiController = uiController

        this.unitList = [];
        this.selectedUnit = null
        this.placementUnit = null
        this.unitTarget = null

        this.commonUtils = new CommonHexMapUtilsClass()
    }

    //unit functions
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
        let newUnit = new UnitClass({q: null, r: null}, unitId, this.mapData, this.tileData, this.images, this.uiController)
        this.placementUnit = newUnit
    }

    addUnit = (pos) => {
        let newUnit = this.placementUnit
        this.placementUnit = null
        newUnit.position = { ...pos }
        this.unitList.push(newUnit)
        return newUnit
    }

    //selections
    eraseUnit = () => {
        this.placementUnit = null
    }
    
    selectUnit = (pos) => {
        this.selectedUnit = this.getUnit(pos)
    }

    unselectUnit = () => {
        this.selectedUnit = null
    }

    selectTarget = (pos) => {
        this.unitTarget = { ...pos }
    }

    clearTarget = () => {
        this.unitTarget = null
    }

    //action functions
    startAttack = (targetPos) => {
        this.selectedUnit.setDirection(targetPos)
        this.selectedUnit.setAnimation('attack')
    }

}