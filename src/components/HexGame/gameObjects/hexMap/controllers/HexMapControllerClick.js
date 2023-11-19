import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapControllerActionsClass from "./HexMapControllerActions"
import HexMapControllerUtilsClass from "./utils/HexMapControllerUtils"
import HexMapPathFinderClass from "./utils/HexMapPathFinder"

export default class HexMapControllerClickClass {

    constructor(hexMapData, hoverController) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.tileData = hexMapData.tileData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData

        this.pathfinder = new HexMapPathFinderClass(hexMapData)
        this.utils = new HexMapControllerUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()

        this.hoverController = hoverController
        this.actions = new HexMapControllerActionsClass(hexMapData)
    }

    click = (tileClicked, clickPos) => {

        let tile = this.tileData.getEntry(tileClicked)

        switch (this.mapData.curState()) {
            case 'selectTile':
                this.selectTile(tile)
                return
            case 'selectMovement':
                this.selectMovement(tile, clickPos.x, clickPos.y)
                return
            case 'placeUnit':
                this.placeUnit(tile, clickPos.x, clickPos.y)
                return
            case 'chooseRotation':
                this.endUnitTurn(tile)
                return
            case 'animation':
                return
            default:
                return
        }

    }

    selectTile = (tile) => {
        this.selectionData.clearAllSelections()
        this.cardData.selectedCard = null

        if (this.unitData.getUnit(tile.position) !== null) {
            this.utils.setSelectedUnit(tile.position)
            return
        }

        this.selectionData.setInfoSelection('tile', tile.position)
        this.mapData.setState('selectTile')

    }

    selectMovement = (tile, x, y) => {

        if (this.selectionData.getPathingSelection('action').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            let actioning = this.confirmAction(tile)
            if (!actioning) this.hoverController.updatePathHover(x, y)
            return
        }

        if (this.selectionData.getPathingSelection('attack').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            let attacking = this.confirmAttack(tile)
            if (!attacking) this.hoverController.updatePathHover(x, y)
            return
        }

        if (this.selectionData.getPathingSelection('movement').some(moveObj => this.commonUtils.tilesEqual(moveObj, tile.position))) {
            let moving = this.confirmMovement(tile)
            if (!moving) this.hoverController.updatePathHover(x, y)
            return
        }

        this.actions.cancel()
        this.selectTile(tile)
    }

    placeUnit = (tile, x, y) => {

        if (tile === null) {
            this.utils.unlockPlacementSelection()
            return
        }

        if (!this.selectionData.getPathingSelection('placement').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            this.utils.unlockPlacementSelection()
            this.hoverController.updatePlacementHover(x, y)
            return
        }

        if (!this.selectionData.getPathLocked()) {
            this.utils.lockPlacementSelection(tile.position)
            return
        }

        if (this.commonUtils.tilesEqual(tile.position, this.selectionData.getTargetSelection())) {
            this.unitData.addUnit(tile.position)
            this.utils.setEndPlacement(tile.position)
            return
        }

        this.utils.unlockPlacementSelection()
        this.hoverController.updatePlacementHover(x, y)

    }

    endUnitTurn = (tile) => {
        if (this.selectionData.getPathingSelection('action').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            this.confirmAction(tile)
            return
        }

        if (this.selectionData.getPathingSelection('attack').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            this.confirmAttack(tile)
            return
        }

        if (!this.selectionData.getPathLocked()) {
            this.actions.cancel()
            return
        }

        this.selectionData.clearPath()
        this.selectionData.clearTarget()
    }

    confirmAction = (tile) => {

        if (!this.selectionData.getPathLocked()) {
            this.selectionData.lockPath()
            this.selectionData.setTargetSelection(tile.position, 'action')
            return
        }

        let target = this.selectionData.getTargetSelection()
        if (this.commonUtils.tilesEqual(tile.position, target)) {
            let structure = this.structureData.getStructure(tile.position)
            switch (structure.type) {
                case 'resource':
                    this.actions.mine()
                    return true
                case 'flag':
                    this.actions.capture()
                    return true
                default:
                    break
            }
        }

        this.selectionData.unlockPath()
        this.selectionData.clearTarget()
        return false
    }

    confirmAttack = (tile) => {
        if (!this.selectionData.getPathLocked()) {
            this.selectionData.lockPath()
            this.selectionData.setTargetSelection(tile.position, 'attack')
            return true
        }

        let target = this.selectionData.getTargetSelection()
        if (this.commonUtils.tilesEqual(tile.position, target)) {
            this.actions.attack()
            return true
        }

        this.selectionData.unlockPath()
        this.selectionData.clearTarget()
        return false
    }

    confirmMovement = (tile) => {
        if (!this.selectionData.getPathLocked()) {
            this.selectionData.lockPath()
            this.selectionData.setTargetSelection(tile.position, 'move')
            return true
        }

        let target = this.selectionData.getTargetSelection()
        if (this.commonUtils.tilesEqual(tile.position, target)) {
            this.actions.move()
            return true
        }

        this.selectionData.unlockPath()
        this.selectionData.clearTarget()
        return false
    }

}