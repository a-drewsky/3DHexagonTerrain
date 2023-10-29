import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

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

    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

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

        if (this.unitData.getUnit(tile.position.q, tile.position.r) != null) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'unit')
            this.unitData.selectUnit(tile.position.q, tile.position.r)
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

        this.unitData.addUnit(tile.position.q, tile.position.r)

        this.unitData.eraseUnit()
        this.mapData.setState('selectTile')
        this.selectionData.resetSelected()

    }

    updatePathSelection = (x, y) => {

        this.selectionData.resetTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.selectionData.selections.path

        if (path.length > 0) {
            let prevTile = path[path.length - 1]
            if (hoverTile.q == prevTile.q && hoverTile.r == prevTile.r) return
        }

        let unit = this.unitData.selectedUnit

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
            if (path.length > 0) neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r, 1)
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

        let pathing = this.selectionData.selections.pathing

        //Check Actions
        if (pathing.action.some(tileObj => tileObj.q == tile.position.q && tileObj.r == tile.position.r)) {
            let structure = this.structureData.getStructure(tile.position.q, tile.position.r)

            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'action')
            this.mapData.setState('selectAction')

            switch (structure.type) {
                case 'resource':
                    this.uiController.setContextMenu(x, y, ['btnMine', 'btnCancel'])
                    return
                case 'flag':
                    this.uiController.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
                    return
            }

        }

        //Check Attacks
        if (pathing.attack.some(tileObj => tileObj.q == tile.position.q && tileObj.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'attack')
            this.mapData.setState('selectAction')
            this.uiController.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        //Check Movement
        if (pathing.movement.some(moveObj => moveObj.q == tile.position.q && moveObj.r == tile.position.r)) {
            this.selectionData.setTargetSelection(tile.position.q, tile.position.r, 'move')
            this.mapData.setState('selectAction')
            this.uiController.setContextMenu(x, y, ['btnMove', 'btnCancel'])
            return
        }

        //Reset State and check new tile
        this.unitData.unselectUnit()
        this.mapData.resetState()
        this.selectTile(tile)

    }

    endUnitTurn = () => {
        this.unitData.unselectUnit()
        this.mapData.resetState()
    }

}

