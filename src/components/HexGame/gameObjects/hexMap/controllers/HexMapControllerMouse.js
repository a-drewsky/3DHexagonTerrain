import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapControllerMouseClass {

    constructor(hexMapData, tileManager, spriteManager, utils, uiController, config) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData

        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.utils = utils
        this.uiController = uiController
        this.config = config

        this.commonUtils = new CommonHexMapUtilsClass()

    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (this.spriteManager.units.data.placementUnit != null) {
            this.spriteManager.units.data.placementUnit.setPosition(hoverTile)
            if (!hoverTile) this.spriteManager.units.data.placementUnit.setPosition({ q: null, r: null })
        }

        if (!hoverTile) return

        let tileObj = this.tileManager.data.getEntry(hoverTile.q, hoverTile.r)

        switch (this.mapData.curState()) {
            case 'placeUnit':
            case 'selectTile':
            case 'chooseRotation':
                this.tileManager.data.setSelection(tileObj.position.q, tileObj.position.r, 'hover')
                return
            case 'selectMovement':
            case 'animation':
            case 'selectAction':
                return
        }
    }

    selectTile = (tile) => {
        this.selectionData.resetSelected()
        this.cardData.selectedCard = null

        if (this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r) != null) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'unit')
            this.spriteManager.units.data.selectUnit(tile.position.q, tile.position.r)
            this.utils.findMoveSet()
            this.mapData.setState('selectMovement')
        }
        else {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'tile')
            this.mapData.setState('selectTile')
        }
    }

    addUnit = (tile) => {

        if (tile === null || this.utils.checkUnitPlacementTile(tile) == false) return

        this.spriteManager.units.data.addUnit(tile.position.q, tile.position.r)

        this.spriteManager.units.data.eraseUnit()
        this.mapData.setState('selectTile')
        this.selectionData.resetSelected()

    }

    updatePathSelection = (x, y) => {

        this.selectionData.resetTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.selectionData.selections.path

        if(path.length > 0){
            let prevTile = path[path.length-1]
            if(hoverTile.q == prevTile.q && hoverTile.r == prevTile.r) return
        }

        let unit = this.spriteManager.units.data.selectedUnit

        if (unit.position.q == hoverTile.q && unit.position.r == hoverTile.r) {
            this.selectionData.selections.path = []
            return
        }

        let findNewPath = false

        if (this.selectionData.selections.pathing.movement.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {

            let actionSelections = [...this.selectionData.selections.pathing.action]
            let attackSelections = [...this.selectionData.selections.pathing.attack]

            if (actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1 && attackSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                this.selectionData.selections.path = []
                return
            }

            if (actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
                this.selectionData.setTargetSelection(hoverTile.q, hoverTile.r, 'action')
            }
            else if (attackSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
                this.selectionData.setTargetSelection(hoverTile.q, hoverTile.r, 'attack')
            }
            else this.selectionData.setTargetSelection(hoverTile.q, hoverTile.r, 'move')

            if (this.unitData.selectedUnit.id == 'mountain_ranger') {
                this.selectionData.selections.path = []
                return
            }

            let neighbors
            if (path.length > 0) neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r,1)
            else neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r, 1)

            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                this.selectionData.selections.path = this.utils.findClosestAdjacentPath(unit.position, hoverTile)
                return
            }

        } else if (path.length == 0) {
            let neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r, 1)
            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                findNewPath = true
            } else {
                path.push(hoverTile)
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
                path.push(hoverTile)
            }
        }


        if (this.utils.checkValidPath() == false) findNewPath = true

        if (findNewPath == false) return

        let newPath = this.utils.findPath(unit.position, hoverTile)

        this.selectionData.selections.path = newPath
    }

    setUnitMouseDirection = (x, y) => {

        let unit = this.spriteManager.units.data.selectedUnit

        if (unit == null) return

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        if (unit.rotation == this.commonUtils.getDirection(unit.position, tileClicked)) return

        unit.setDirection(tileClicked)

    }

    selectMovement = (tile, x, y) => {
        let unit = this.spriteManager.units.data.selectedUnit

        if (unit == null) return

        let moveSet = this.utils.pathFinder.findMoveSet(unit.position, unit.stats.movement)

        let moveSetPlus1 = this.utils.pathFinder.findFullMoveSet(moveSet, unit.position)
        let mineMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'resource')
        let flagMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'flag')
        let attackMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.units.data.getUnit(tileObj.tile.q, tileObj.tile.r) != null
            || (this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'bunker'))

        if (mineMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'action')
            this.spriteManager.units.data.selectedUnit = unit
            this.mapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnMine', 'btnCancel'])
            return
        }

        if (flagMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'action')
            this.spriteManager.units.data.selectedUnit = unit
            this.mapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
            return
        }

        if (attackMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'attack')
            this.spriteManager.units.data.selectedUnit = unit
            this.mapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'move')
            this.spriteManager.units.data.selectedUnit = unit
            this.mapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnMove', 'btnCancel'])
            return
        }

        this.selectionData.resetSelected()
        let newUnit = this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r)
        if (newUnit == null) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'tile')
            this.spriteManager.units.data.selectedUnit = null
            this.mapData.setState('selectTile')
        }
        else {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.mapData.setState('selectMovement')
        }

    }

    endUnitTurn = () => {
        this.spriteManager.units.data.unselectUnit()
    }

}

