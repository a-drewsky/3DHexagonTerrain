import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapControllerActionsClass from "./HexMapControllerActions"

export default class HexMapControllerMouseClass {

    constructor(hexMapData, tileManager, spriteManager, utils, uiController, config) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData

        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.utils = utils
        this.uiController = uiController
        this.config = config

        this.commonUtils = new CommonHexMapUtilsClass()
        this.actions = new HexMapControllerActionsClass(hexMapData, tileManager, spriteManager, utils, uiController)

    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectionNamesTile(x, y)

        if (this.unitData.placementUnit != null) {
            this.unitData.placementUnit.setPosition(hoverTile)
            if (!hoverTile) this.unitData.placementUnit.setPosition({ q: null, r: null })
        }

        if (!hoverTile) return

        let tileObj = this.tileManager.data.getEntry(hoverTile.q, hoverTile.r)

        switch (this.mapData.curState()) {
            case 'placeUnit':
            case 'selectTile':
            case 'chooseRotation':
                this.selectionData.setInfoSelection('hover', tileObj.position)
                return
            case 'selectMovement':
            case 'animation':
            case 'selectAction':
                return
        }
    }

    selectTile = (tile) => {
        this.selectionData.clearAllSelections()
        this.cardData.selectedCard = null

        if (this.unitData.getUnit(tile.position.q, tile.position.r) != null) {
            this.selectionData.setInfoSelection('unit', tile.position)
            this.unitData.selectUnit(tile.position.q, tile.position.r)
            this.utils.findMoveSet()
            this.mapData.setState('selectMovement')
        }
        else {
            this.selectionData.setInfoSelection('tile', tile.position)
            this.mapData.setState('selectTile')
        }
    }

    addUnit = (tile) => {

        if (tile === null || this.utils.checkUnitPlacementTile(tile) == false) return

        this.unitData.addUnit(tile.position.q, tile.position.r)

        this.unitData.eraseUnit()
        this.mapData.setState('selectTile')
        this.selectionData.clearAllSelections()

    }

    updatePathSelection = (x, y) => {

        if (this.selectionData.getPathLocked()) return

        this.selectionData.clearTarget()

        let hoverTile = this.utils.getSelectionNamesTile(x, y)

        if (!hoverTile) return

        let path = this.selectionData.getPath()

        if (path.length > 0) {
            let prevTile = path[path.length - 1]
            if (hoverTile.q == prevTile.q && hoverTile.r == prevTile.r) return
        }

        let unit = this.unitData.selectedUnit

        if (unit.position.q == hoverTile.q && unit.position.r == hoverTile.r) {
            this.selectionData.clearPath()
            return
        }

        let findNewPath = false

        if (this.selectionData.getPathingSelection('movement').findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {

            let actionSelections = [...this.selectionData.getPathingSelection('action')]
            let attackSelections = [...this.selectionData.getPathingSelection('attack')]

            if (actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
                this.selectionData.clearPath()
                this.selectionData.setActionHover(hoverTile)
            }
            else if (attackSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
                this.selectionData.clearPath()
                this.selectionData.setAttackHover(hoverTile)
            }

            if (this.unitData.selectedUnit.id == 'mountain_ranger') {
                this.selectionData.clearPath()
                return
            }

            let neighbors
            if (path.length > 0) neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r, 1)
            else neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r, 1)

            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                this.selectionData.setPath(this.utils.findClosestAdjacentPath(unit.position, hoverTile))
                return
            }

        } else if (path.length == 0) {
            let neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r, 1)
            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                findNewPath = true
            } else {
                this.selectionData.addToPath(hoverTile)
            }
        } else if (path.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
            if (path.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != path.length - 1) {
                findNewPath = true
            }
        } else {
            let neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r, 1)
            neighbors.push(path[path.length - 1])

            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                findNewPath = true
            } else {
                this.selectionData.addToPath(hoverTile)
            }
        }


        if (this.utils.checkValidPath() == false) findNewPath = true

        if (findNewPath == false) return

        let newPath = this.utils.findPath(unit.position, hoverTile)

        this.selectionData.setPath(newPath)
    }

    setUnitMouseDirection = (x, y) => {

        let unit = this.unitData.selectedUnit

        if (unit == null) return

        let tileClicked = this.utils.getSelectionNamesTile(x, y)

        if (!tileClicked) return

        if (unit.rotation == this.commonUtils.getDirection(unit.position, tileClicked)) return

        unit.setDirection(tileClicked)

    }

    selectMovement = (tile, x, y) => {
        let unit = this.unitData.selectedUnit

        if (unit == null) return

        //Check Actions
        if (this.selectionData.getPathingSelection('action').some(tileObj => tileObj.q == tile.position.q && tileObj.r == tile.position.r)) {
            let structure = this.structureData.getStructure(tile.position.q, tile.position.r)

            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'action')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (tile.position.q == target.q && tile.position.r == target.r) {
                    switch (structure.type) {
                        case 'resource':
                            this.actions.mine()
                            break
                        case 'flag':
                            this.actions.capture()
                            break
                    }
                }
                else {
                    this.selectionData.unlockPath()
                    this.selectionData.clearTarget()
                    this.updatePathSelection(x, y)
                }
            }

            return

        }

        //Check Attacks
        if (this.selectionData.getPathingSelection('attack').some(tileObj => tileObj.q == tile.position.q && tileObj.r == tile.position.r)) {
            
            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'attack')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (tile.position.q == target.q && tile.position.r == target.r) {
                    this.actions.attack()
                }
                else {
                    this.selectionData.unlockPath()
                    this.selectionData.clearTarget()
                    this.updatePathSelection(x, y)
                }
            }

            return
        }

        //Check Movement
        if (this.selectionData.getPathingSelection('movement').some(moveObj => moveObj.q == tile.position.q && moveObj.r == tile.position.r)) {
            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'move')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (tile.position.q == target.q && tile.position.r == target.r) this.actions.move()
                else {
                    this.selectionData.unlockPath()
                    this.selectionData.clearTarget()
                    this.updatePathSelection(x, y)
                }
            }
            return
        }

        //Reset State and check new tile
        this.unitData.unselectUnit()
        this.mapData.resetState()
        this.selectionData.clearAllSelections()
        this.selectTile(tile)

    }

    endUnitTurn = () => {
        this.unitData.unselectUnit()
        this.selectionData.clearAllSelections()
        this.mapData.resetState()
    }

}

