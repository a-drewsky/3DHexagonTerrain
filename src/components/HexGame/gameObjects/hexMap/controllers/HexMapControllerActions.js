export default class HexMapControllerActionsClass {

    constructor(hexMapData, tileManager, spriteManager, canvas, utils, uiController) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.unitData = hexMapData.unitData

        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.canvas = canvas
        this.utils = utils
        this.uiController = uiController
    }

    move = () => {
        this.unitData.selectedUnit.setMove()
        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
    }

    mine = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.unitData.selectedUnit.target = targetStructure

        if (this.selectionData.getPath().length == 0) {
            this.unitData.selectedUnit.setMine()
            this.selectionData.clearAllSelections()
        } else {
            this.unitData.selectedUnit.futureState = 'mine'
            this.unitData.selectedUnit.setMove()
            this.selectionData.clearAllSelections()
        }
    }

    attack = () => {

        if (this.unitData.selectedUnit == null) return

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetObject

        if (this.unitData.getUnit(targetTile.position.q, targetTile.position.r) != null) {
            targetObject = this.unitData.getUnit(targetTile.position.q, targetTile.position.r)
        } else {
            if (this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r) == null) return
            targetObject = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        }
        if (targetObject == null) return

        this.unitData.selectedUnit.target = targetObject

        if (this.selectionData.getPath().length == 0 || this.unitData.selectedUnit.id == 'mountain_ranger') {
            this.unitData.selectedUnit.setAttack()
            this.selectionData.clearAllSelections()
        } else {
            this.unitData.selectedUnit.futureState = 'attack'
            this.unitData.selectedUnit.setMove()
            this.selectionData.clearAllSelections()
        }
    }

    capture = () => {

        if (this.unitData.selectedUnit == null) return

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.unitData.selectedUnit.target = targetStructure

        let neighbors = this.tileManager.data.getNeighborKeys(this.unitData.selectedUnit.position.q, this.unitData.selectedUnit.position.r, 1)

        if (neighbors.filter(tile => tile.q == targetStructure.position.q && tile.r == targetStructure.position.r).length == 1) {
            this.unitData.selectedUnit.captureFlag(targetTile)
            this.selectionData.clearAllSelections()
        } else {
            this.unitData.selectedUnit.futureState = 'capture'
            this.unitData.selectedUnit.setMove()
            this.selectionData.clearAllSelections()
        }
    }

    cancel = () => {
        this.selectionData.clearAllSelections()
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}