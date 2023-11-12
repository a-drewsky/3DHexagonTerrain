import HexMapControllerUtilsClass from "./HexMapControllerUtils"

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

        if (this.unitData.selectedUnit == null) return

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileData.getEntry(selectionTarget)

        let targetObject = this.utils.getTargetObject(targetTile.position)
        if (targetObject == null) return

        this.unitData.selectTarget(targetTile.position)
        this.unitData.startAttack(targetTile.position)

        this.selectionData.clearAllSelections()

    }

    mine = () => {

        let selectionTarget = this.selectionData.getTargetSelection()
        if (selectionTarget == null) return
        let targetTile = this.tileData.getEntry(selectionTarget)

        let targetStructure = this.structureData.getStructure(targetTile.position)
        if (targetStructure == null) return

        this.unitData.selectTarget(targetTile.position)
        this.unitData.selectedUnit.setDirection(targetTile.position)
        this.unitData.selectedUnit.setAnimation('mine')
        this.selectionData.clearAllSelections()
    }

    capture = () => {

        if (this.selectionData.getTargetSelection() == null) return
        let targetTile = this.tileData.getEntry(this.selectionData.getTargetSelection())

        let targetStructure = this.structureData.getStructure(targetTile.position)
        if (targetStructure == null || targetStructure.type != 'flag') return

        this.unitData.selectedUnit.setDirection(targetTile.position)
        targetStructure.setCaptured()

    }

    cancel = () => {
        this.selectionData.clearAllSelections()
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}