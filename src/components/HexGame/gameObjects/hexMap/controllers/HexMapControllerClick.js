import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapControllerActionsClass from "./HexMapControllerActions"
import HexMapControllerUtilsClass from "./HexMapControllerUtils"

export default class HexMapControllerClickClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.tileData = hexMapData.tileData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData

        this.utils = new HexMapControllerUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()

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
        }

    }

    selectTile = (tile) => {
        this.selectionData.clearAllSelections()
        this.cardData.selectedCard = null

        if (this.unitData.getUnit(tile.position) != null) {
            this.selectionData.setInfoSelection('unit', tile.position)
            this.unitData.selectUnit(tile.position)
            this.utils.findMoveSet()
            this.mapData.setState('selectMovement')
        }
        else {
            this.selectionData.setInfoSelection('tile', tile.position)
            this.mapData.setState('selectTile')
        }
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
                this.unitData.selectUnit(tile.position)
                this.mapData.setState('chooseRotation')

            } else {
                this.selectionData.unlockPath()
                this.selectionData.clearTarget()
                this.updatePlacementSelection(x, y)
            }
        }

        return


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