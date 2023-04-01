export default class HexMapControllerMouseClass {

    constructor(hexMapData, unitManager, renderer, pathFinder, utils, uiController, config) {
        this.hexMapData = hexMapData
        this.unitManager = unitManager
        this.renderer = renderer
        this.pathFinder = pathFinder
        this.utils = utils
        this.uiController = uiController
        this.config = config

    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let tileObj = this.hexMapData.getEntry(hoverTile.q, hoverTile.r)

        switch (this.hexMapData.state.current) {
            case 'placeUnit':
            case 'selectTile':
            case 'chooseRotation':
                this.hexMapData.selections.setSelection(tileObj.position.q, tileObj.position.r, 'hover')
                return
            case 'selectMovement':
            case 'animation':
            case 'selectAction':
                return
        }
    }

    selectTile = (tileClicked, tile) => {
        this.hexMapData.selections.resetSelected()

        if (this.unitManager.getUnit(tileClicked.q, tileClicked.r) != null) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'unit')
            let unit = this.unitManager.getUnit(tile.position.q, tile.position.r)
            this.unitManager.selectedUnit = unit
            this.utils.findMoveSet()
            this.hexMapData.state.current = this.hexMapData.state.selectMovement
        }
        else {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'tile')
            this.hexMapData.state.current = this.hexMapData.state.selectTile
        }
    }

    addUnit = (tile) => {

        if (tile != null) {
            // let unit = this.config.unit(tile.position)
            // this.renderer.spriteRenderer.units.render(unit)
            this.unitManager.addUnit(tile.position.q, tile.position.r)
        }

        this.hexMapData.state.current = this.hexMapData.state.selectTile

        this.hexMapData.selections.resetSelected()

    }

    updateUnitPath = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.hexMapData.selections.path

        let unit = this.unitManager.selectedUnit

        if (unit.data.position.q == hoverTile.q && unit.data.position.r == hoverTile.r) {
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
                if (path.length > 0) neighbors = this.hexMapData.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r)
                else neighbors = this.hexMapData.getNeighborKeys(unit.data.position.q, unit.data.position.r)

                if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                    this.hexMapData.selections.path = this.utils.findClosestAdjacentPath(unit.data.position, hoverTile)
                    return
                }
            }
        } else if (path.length == 0) {
            let neighbors = this.hexMapData.getNeighborKeys(unit.data.position.q, unit.data.position.r)
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
            let neighbors = this.hexMapData.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r)
            neighbors.push(path[path.length - 1])

            if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                findNewPath = true
            } else {
                path.push(hoverTile)
            }
        }


        if (this.utils.checkValidPath() == false) findNewPath = true

        if (findNewPath == false) return

        let newPath = this.utils.findPath(unit.data.position, hoverTile)

        this.hexMapData.selections.path = newPath
    }

    setUnitMouseDirection = (x, y) => {


        let unit = this.unitManager.selectedUnit

        if (unit == null) return

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        this.utils.setUnitDirection(unit, tileClicked)
        unit.renderer.render()

    }

    selectMovement = (tileClicked, tile, x, y) => {
        let unit = this.unitManager.selectedUnit

        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.data.position, unit.data.stats.movement)

        let moveSetPlus1 = this.pathFinder.findFullMoveSet(moveSet, unit.data.position)
        let mineMoveSet = moveSetPlus1.filter(tileObj => this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'resource')
        let flagMoveSet = moveSetPlus1.filter(tileObj => this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'flag')
        let attackMoveSet = moveSetPlus1.filter(tileObj => this.unitManager.getUnit(tileObj.tile.q, tileObj.tile.r) != null
            || (this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'base'))

        if (mineMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'target')
            this.unitManager.selectedUnit = unit
            this.hexMapData.state.current = this.hexMapData.state.selectAction

            this.uiController.setContextMenu(x, y, ['btnMine', 'btnCancel'])
            return
        }

        if (flagMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'target')
            this.unitManager.selectedUnit = unit
            this.hexMapData.state.current = this.hexMapData.state.selectAction

            this.uiController.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
            return
        }

        if (attackMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'target')
            this.unitManager.selectedUnit = unit
            this.hexMapData.state.current = this.hexMapData.state.selectAction

            this.uiController.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'target')
            this.unitManager.selectedUnit = unit
            this.hexMapData.state.current = this.hexMapData.state.selectAction

            this.uiController.setContextMenu(x, y, ['btnMove', 'btnCancel'])
            return
        }

        this.hexMapData.selections.resetSelected()
        let newUnit = this.unitManager.getUnit(tile.position.q, tile.position.r)
        if (newUnit == null) {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'tile')
            this.hexMapData.state.current = this.hexMapData.state.selectTile
        }
        else {
            this.hexMapData.selections.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.hexMapData.state.current = this.hexMapData.state.selectMovement
        }

    }
    
    endUnitTurn = () => {
        this.utils.setUnitIdle(this.unitManager.selectedUnit)
        this.unitManager.selectedUnit = null
    }

}

