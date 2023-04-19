export default class HexMapControllerMouseClass {

    constructor(hexMapData, tileManager, spriteManager, pathFinder, utils, uiController, config) {
        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.pathFinder = pathFinder
        this.utils = utils
        this.uiController = uiController
        this.config = config

    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let tileObj = this.tileManager.data.getEntry(hoverTile.q, hoverTile.r)

        switch (this.hexMapData.state.current) {
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

    selectTile = (tileClicked, tile) => {
        this.hexMapData.resetSelected()

        if (this.spriteManager.units.data.getUnit(tileClicked.q, tileClicked.r) != null) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'unit')
            let unit = this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r)
            this.spriteManager.units.data.selectedUnit = unit
            this.utils.findMoveSet()
            this.hexMapData.setState('selectMovement')
        }
        else {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'tile')
            this.hexMapData.setState('selectTile')
        }
    }

    addUnit = (tile) => {

        if (tile != null) {
            let newUnit = this.spriteManager.units.data.addUnit(tile.position.q, tile.position.r)
            this.spriteManager.units.renderer.render(newUnit)
        }

        this.hexMapData.setState('selectTile')

        this.hexMapData.resetSelected()

    }

    updateUnitPath = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.hexMapData.selections.path

        let unit = this.spriteManager.units.data.selectedUnit

        if (unit.position.q == hoverTile.q && unit.position.r == hoverTile.r) {
            this.hexMapData.selections.path = []
            return
        }

        let findNewPath = false

        if (this.hexMapData.selections.pathing.movement.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {

            let actionSelections = [...this.hexMapData.selections.pathing.action, ...this.hexMapData.selections.pathing.attack]

            if (actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                this.hexMapData.selections.path = []
                return
            } else {
                let neighbors
                if (path.length > 0) neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r)
                else neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r)

                if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                    this.hexMapData.selections.path = this.utils.findClosestAdjacentPath(unit.position, hoverTile)
                    return
                }
            }
        } else if (path.length == 0) {
            let neighbors = this.tileManager.data.getNeighborKeys(unit.position.q, unit.position.r)
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
            let neighbors = this.tileManager.data.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r)
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

        this.hexMapData.selections.path = newPath
    }

    setUnitMouseDirection = (x, y) => {


        let unit = this.spriteManager.units.data.selectedUnit

        if (unit == null) return

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        unit.setDirection(tileClicked)
        this.spriteManager.units.renderer.render(unit)

    }

    selectMovement = (tileClicked, tile, x, y) => {
        let unit = this.spriteManager.units.data.selectedUnit

        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.stats.movement)

        let moveSetPlus1 = this.pathFinder.findFullMoveSet(moveSet, unit.position)
        let mineMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'resource')
        let flagMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'flag')
        let attackMoveSet = moveSetPlus1.filter(tileObj => this.spriteManager.units.data.getUnit(tileObj.tile.q, tileObj.tile.r) != null
            || (this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r) != null && this.spriteManager.structures.data.getStructure(tileObj.tile.q, tileObj.tile.r).type == 'bunker'))

        if (mineMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'target')
            this.spriteManager.units.data.selectedUnit = unit
            this.hexMapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnMine', 'btnCancel'])
            return
        }

        if (flagMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'target')
            this.spriteManager.units.data.selectedUnit = unit
            this.hexMapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
            return
        }

        if (attackMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'target')
            this.spriteManager.units.data.selectedUnit = unit
            this.hexMapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'target')
            this.spriteManager.units.data.selectedUnit = unit
            this.hexMapData.setState('selectAction')

            this.uiController.setContextMenu(x, y, ['btnMove', 'btnCancel'])
            return
        }

        this.hexMapData.resetSelected()
        let newUnit = this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r)
        if (newUnit == null) {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'tile')
            this.hexMapData.setState('selectTile')
        }
        else {
            this.tileManager.data.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.hexMapData.setState('selectMovement')
        }

    }
    
    endUnitTurn = () => {
        this.spriteManager.units.data.selectedUnit.setIdle()
        this.spriteManager.units.data.selectedUnit = null
    }

}

