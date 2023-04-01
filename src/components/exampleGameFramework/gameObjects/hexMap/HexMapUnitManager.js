import UnitClass from '../unit/Unit'

export default class HexMapUnitManagerClass {

    constructor(hexMapData, camera, images, settings) {
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.settings = settings

        this.unitList = [];
        this.selectedUnit = null
    }

    //return terrain at tile (q, r) or null if the tile has no terrain
    getUnit = (q, r) => {
        let index = this.unitList.findIndex(unit => unit.data.position.q == q && unit.data.position.r == r)
        if (index == -1) return null
        return this.unitList[index]
    }

    //delete unit at position (q, r)
    deleteUnit = (q, r) => {
        let index = this.unitList.findIndex(unit => unit.data.position.q == q && unit.data.position.r == r)
        if (index == -1) return
        this.unitList.splice(index, 1)
    }

    addUnit = (q, r, unitName) => {
        let newUnit = new UnitClass({ q: q, r: r }, this.hexMapData, this.camera, this.images, this.settings)
        newUnit.renderer.render()
        // newUnit.initialize(unitName)
        this.unitList.push(newUnit)
    }

}