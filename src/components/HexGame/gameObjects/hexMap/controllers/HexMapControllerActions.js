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
        this.unitData.selectedUnit.setMove(this.selectionData.getPath())
        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
    }

    mine = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position)
        if (targetStructure == null) return

        this.unitData.selectedUnit.target = targetStructure

        this.unitData.selectedUnit.setMine()
        this.selectionData.clearAllSelections()
    }

    attack = () => {

        if (this.unitData.selectedUnit == null) return

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget)

        let targetObject

        if (this.unitData.getUnit(targetTile.position) != null) {
            targetObject = this.unitData.getUnit(targetTile.position)
        } else {
            if (this.spriteManager.structures.data.getStructure(targetTile.position) == null) return
            targetObject = this.spriteManager.structures.data.getStructure(targetTile.position)
        }
        if (targetObject == null) return

        this.unitData.selectedUnit.target = targetObject

        this.unitData.selectedUnit.setAttack()
        this.selectionData.clearAllSelections()

    }

    capture = () => {

        if (this.unitData.selectedUnit == null) return

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position)
        if (targetStructure == null) return

        this.unitData.selectedUnit.target = targetStructure

        this.unitData.selectedUnit.captureFlag(targetTile)
        this.selectionData.clearAllSelections()
    }

    cancel = () => {
        this.selectionData.clearAllSelections()
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}