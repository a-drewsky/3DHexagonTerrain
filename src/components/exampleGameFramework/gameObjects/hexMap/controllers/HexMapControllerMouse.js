export default class HexMapControllerMouseClass {

    constructor(hexMapData, renderer, pathFinder, utils, config) {
        this.hexMapData = hexMapData
        this.renderer = renderer
        this.pathFinder = pathFinder
        this.utils = utils
        this.config = config

    }
    
    endUnitTurn = () => {
        let unit = this.hexMapData.getSelectedUnitToRotate()

        this.utils.setUnitIdle(unit)
    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let tileObj = this.hexMapData.getEntry(hoverTile.q, hoverTile.r)

        switch (this.hexMapData.state) {
            case 'placeUnit':
                this.utils.setSelection(tileObj.position.q, tileObj.position.r, 'hover_place')
                return
            case 'selectTile':
                this.utils.setSelection(tileObj.position.q, tileObj.position.r, 'hover_select')
                return
            case 'selectMovement':
            case 'chooseRotation':
            case 'animation':
            case 'selectAction':
                return
        }
    }

    addUnit = (tile) => {

        if (tile != null) {
            let unit = this.config.unit(tile.position)
            this.renderer.renderUnit(unit)
            this.hexMapData.unitList.push(unit)
        }

        this.hexMapData.state = 'selectTile'

        this.utils.resetSelected()

    }

    updateUnitPath = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.hexMapData.selections.path

        let unit = this.hexMapData.getSelectedUnit()

        if (unit.position.q == hoverTile.q && unit.position.r == hoverTile.r) {
            this.hexMapData.selections.path = []
            return
        }

        let findNewPath = false

        if (this.hexMapData.selections.movement.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {

            let actionSelections = [...this.hexMapData.selections.action, ...this.hexMapData.selections.attack]

            if (actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                this.hexMapData.selections.path = []
                return
            } else {
                let neighbors
                if (path.length > 0) neighbors = this.hexMapData.getNeighborKeys(path[path.length - 1].q, path[path.length - 1].r)
                else neighbors = this.hexMapData.getNeighborKeys(unit.position.q, unit.position.r)

                if (neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                    this.hexMapData.selections.path = this.utils.findClosestAdjacentPath(unit.position, hoverTile)
                    return
                }
            }
        } else if (path.length == 0) {
            let neighbors = this.hexMapData.getNeighborKeys(unit.position.q, unit.position.r)
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

        let newPath = this.utils.findPath(unit.position, hoverTile)

        this.hexMapData.selections.path = newPath
    }

    setUnitMouseDirection = (x, y) => {


        let unit = this.hexMapData.getSelectedUnitToRotate()

        if (unit == null) return

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        this.utils.setUnitDirection(unit, tileClicked)
        this.renderer.renderUnit(unit)

    }

    selectTile = (tileClicked, tile) => {
        this.utils.resetSelected()

        if (this.hexMapData.getUnit(tileClicked.q, tileClicked.r) != null) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.hexMapData.state = 'selectMovement'
        }
        else {
            this.utils.setSelection(tile.position.q, tile.position.r, 'info')
            this.hexMapData.state = 'selectTile'
        }
    }

    selectMovement = (tileClicked, tile, x, y) => {
        let unit = this.hexMapData.getSelectedUnit()

        if (unit == null) return

        if (this.utils.getSelection(tile.position.q, tile.position.r) == 'unit') return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

        let moveSetPlus1 = this.pathFinder.findFullMoveSet(moveSet, unit.position)
        let mineMoveSet = moveSetPlus1.filter(tileObj => this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'resource')
        let flagMoveSet = moveSetPlus1.filter(tileObj => this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'flag')
        let attackMoveSet = moveSetPlus1.filter(tileObj => this.hexMapData.getUnit(tileObj.tile.q, tileObj.tile.r) != null
            || (this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r) != null && this.hexMapData.getTerrain(tileObj.tile.q, tileObj.tile.r).type == 'base'))

        if (mineMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.hexMapData.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnMine', 'btnCancel'])
            return
        }

        if (flagMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.hexMapData.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
            return
        }

        if (attackMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.hexMapData.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.hexMapData.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnMove', 'btnCancel'])
            return
        }

        this.utils.resetSelected()
        let newUnit = this.hexMapData.getUnit(tile.position.q, tile.position.r)
        if (newUnit == null) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'info')
            this.hexMapData.state = 'selectTile'
        }
        else {
            this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.hexMapData.state = 'selectMovement'
        }

    }

}

