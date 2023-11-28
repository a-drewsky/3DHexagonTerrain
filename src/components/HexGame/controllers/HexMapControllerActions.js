import HexMapControllerUtilsClass from "./utils/HexMapControllerUtils"

export default class HexMapControllerActionsClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.selectionData = gameData.selectionData
        this.tileData = gameData.tileData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData

        this.utils = new HexMapControllerUtilsClass(gameData)
    }

    move = () => {
        this.unitData.selectedUnit.setMove(this.selectionData.getPathSelection())
        this.utils.setStartAnimation()
    }

    attack = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startAttack(targetTile.position)

        this.utils.setStartAnimation()
    }

    mine = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startMining(targetTile.position)

        this.utils.setStartAnimation()
    }

    capture = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        let targetTile = this.tileData.getEntry(selectionTarget)

        this.unitData.startCapture(targetTile.position)

        this.utils.setStartAnimation()

    }

    cancel = () => {
        this.selectionData.clearAllSelections()
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}