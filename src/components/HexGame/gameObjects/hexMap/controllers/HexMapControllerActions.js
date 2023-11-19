import HexMapControllerUtilsClass from "./utils/HexMapControllerUtils"

export default class HexMapControllerActionsClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.tileData = hexMapData.tileData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData

        this.utils = new HexMapControllerUtilsClass(hexMapData)
    }

    move = () => {
        this.unitData.selectedUnit.setMove(this.selectionData.getPath())
        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
    }

    attack = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startAttack(targetTile.position)

        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
    }

    mine = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startMining(targetTile.position)

        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
    }

    capture = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startCapture(targetTile.position)

        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')

    }

    cancel = () => {
        this.selectionData.clearAllSelections()
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}