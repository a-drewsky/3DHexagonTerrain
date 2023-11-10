import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapControllerActionsClass from "./HexMapControllerActions"

export default class HexMapControllerMouseClass {

    constructor(hexMapData, tileManager, spriteManager, utils, uiController, config) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
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

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (this.unitData.placementUnit != null) {
            this.unitData.placementUnit.setPosition(hoverTile)
            if (!hoverTile) this.unitData.placementUnit.setPosition({ q: null, r: null })
        }

        if (!hoverTile) return

        let tileObj = this.tileManager.data.getEntry(hoverTile)

        switch (this.mapData.curState()) {
            case 'selectTile':
                this.selectionData.setInfoSelection('hover', tileObj.position)
                return
            case 'placeUnit':
            case 'chooseRotation':
            case 'selectMovement':
            case 'animation':
                return
        }
    }

    selectTile = (tile) => {
        this.selectionData.clearAllSelections()
        this.cardData.selectedCard = null

        if (this.unitData.getUnit(tile.position) != null) {
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

    placeUnit = (tile, x, y) => {

        if (tile === null) return

        if (!this.selectionData.getPathingSelection('placement').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            this.selectionData.unlockPath()
            this.selectionData.clearTarget()
            this.updatePlacementSelection(x, y)
            return
        }

        if (!this.selectionData.getPathLocked()) {
            this.selectionData.lockPath()
            this.selectionData.setTargetSelection(tile.position, 'placement')
        } else {
            let target = this.selectionData.getTargetSelection()
            if (this.commonUtils.tilesEqual(tile.position, target)) {

                this.unitData.addUnit(tile.position)
                this.unitData.eraseUnit()
                this.selectionData.clearAllSelections()
                this.selectionData.setInfoSelection('unit', tile.position)
                this.unitData.selectUnit(tile.position.q, tile.position.r)
                this.mapData.setState('chooseRotation')

            } else {
                this.selectionData.unlockPath()
                this.selectionData.clearTarget()
                this.updatePlacementSelection(x, y)
            }
        }

        return


    }

    updatePlacementSelection = (x, y) => {

        if (this.unitData.placementUnit != null) {
            this.unitData.placementUnit.rotation = -1 * this.cameraData.rotation + 3
            if (this.unitData.placementUnit.rotation < 0) this.unitData.placementUnit.rotation += 6
        }

        if (this.selectionData.getPathLocked()) return

        this.selectionData.clearPath()
        let hoverTile = this.utils.getSelectedTile(x, y)

        this.unitData.placementUnit.setPosition(hoverTile)

        if (!hoverTile) {
            this.unitData.placementUnit.setPosition({ q: null, r: null })
            return
        }

        let placementSelections = this.selectionData.getPathingSelection('placement')

        if (placementSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.setPlacementHover(hoverTile)
            return
        } else {
            this.selectionData.setInfoSelection('hover', hoverTile)
        }
    }

    updatePathSelection = (x, y) => {

        if (this.selectionData.getPathLocked()) return

        this.selectionData.clearHover()
        this.selectionData.clearTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) {
            this.selectionData.clearPath()
            return
        }

        this.utils.setPath(hoverTile)

    }

    updateEndMoveSelection = (x, y) => {
        if (this.selectionData.getPathLocked()) return

        this.selectionData.clearTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) {
            this.selectionData.clearPath()
            return
        }

        this.utils.setEndMove(hoverTile)
    }

    setUnitMouseDirection = (x, y) => {

        if (this.selectionData.getPathLocked()) return

        let unit = this.unitData.selectedUnit

        if (unit == null) return

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        if (unit.rotation == this.commonUtils.getDirection(unit.position, tileClicked)) return

        unit.setDirection(tileClicked)

    }

    selectMovement = (tile, x, y) => {
        let unit = this.unitData.selectedUnit

        if (unit == null) return

        //Check Actions
        if (this.selectionData.getPathingSelection('action').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            let structure = this.structureData.getStructure(tile.position)

            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'action')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (this.commonUtils.tilesEqual(tile.position, target)) {
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
        if (this.selectionData.getPathingSelection('attack').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {

            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'attack')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (this.commonUtils.tilesEqual(tile.position, target)) {
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
        if (this.selectionData.getPathingSelection('movement').some(moveObj => this.commonUtils.tilesEqual(moveObj, tile.position))) {
            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'move')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (this.commonUtils.tilesEqual(tile.position, target)) this.actions.move()
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

    endUnitTurn = (tile) => {
        let unit = this.unitData.selectedUnit

        if (unit == null) return

        //Check Actions
        if (this.selectionData.getPathingSelection('action').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {
            let structure = this.structureData.getStructure(tile.position)

            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'action')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (this.commonUtils.tilesEqual(tile.position, target)) {
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
                    this.selectionData.clearPath()
                    this.selectionData.clearTarget()
                }
            }

            return

        }

        //Check Attacks
        if (this.selectionData.getPathingSelection('attack').some(tileObj => this.commonUtils.tilesEqual(tileObj, tile.position))) {

            if (!this.selectionData.getPathLocked()) {
                this.selectionData.lockPath()
                this.selectionData.setTargetSelection(tile.position, 'attack')
            } else {
                let target = this.selectionData.getTargetSelection()
                if (this.commonUtils.tilesEqual(tile.position, target)) {
                    this.actions.attack()
                }
                else {
                    this.selectionData.clearPath()
                    this.selectionData.clearTarget()
                }
            }

            return
        }

        if (!this.selectionData.getPathLocked()) {
            //end turn
            this.unitData.unselectUnit()
            this.selectionData.clearAllSelections()
            this.mapData.resetState()
        } else {
            this.selectionData.clearPath()
            this.selectionData.clearTarget()
        }
    }

}

