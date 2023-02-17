
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';
import HexMapPathFinderClass from "../utils/HexMapPathFinder"
import HexMapViewUtilsClass from '../view/HexMapViewUtils';
import HexMapConfigClass from '../config/hexMapConfig';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas, images, settings, uiComponents, updateUi, renderer, globalState) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas

        this.images = images



        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

        this.viewUtils = new HexMapViewUtilsClass(hexMapData, camera, settings, images)

        this.renderer = renderer
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera, canvas, images, uiComponents, updateUi, renderer, globalState);

        this.config = new HexMapConfigClass()

        this.uiComponents = uiComponents

        this.updateUi = updateUi

        this.selectedUnit = null

    }

    mouseUp = () => {

        if (this.hexMapData.clickPos !== null) this.clickTile(this.hexMapData.clickPos.x, this.hexMapData.clickPos.y)

        this.hexMapData.clickPos = null
    }

    mouseMove = (x, y) => {

        if (this.hexMapData.clickMovePos !== null) {
            this.hexMapData.clickMovePos.x = x
            this.hexMapData.clickMovePos.y = y
        }

        this.utils.resetHover()

        switch (this.hexMapData.state) {
            case 'selectTile':
            case 'placeUnit':
            case 'animation':
                this.setHover(x, y)
                return
            case 'chooseRotation':
                this.setUnitMouseDirection(x, y)
                this.setHover(x, y)
                return
            case 'selectAction':
                return
            case 'selectMovement':
                this.updateUnitPath(x, y)
        }
    }

    clickTile = (x, y) => {

        let tileClicked = this.utils.getSelectedTile(x, y)

        if (!tileClicked) return

        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

        switch (this.hexMapData.state) {
            case 'selectTile':
                this.selectTile(tileClicked, tile)
                return
            case 'selectMovement':
                this.selectMovement(tileClicked, tile, x, y)
                return
            case 'placeUnit':
                this.addUnit(tile)
                return
            case 'chooseRotation':
                this.endUnitTurn()
                return
            case 'selectAction':
                return
            case 'animation':
                return
        }
    }

    endUnitTurn = () => {
        let unit = this.hexMapData.getSelectedUnitToRotate()

        this.utils.setUnitIdle(unit)
    }

    click = (x, y) => {

        this.hexMapData.clickPos = { x: x, y: y }
        this.hexMapData.clickMovePos = { x: x, y: y }
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

    updateUnitPath = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let path = this.hexMapData.selections.path

        let unit = this.hexMapData.getSelectedUnit()

        if(unit.position.q == hoverTile.q && unit.position.r == hoverTile.r){
            this.hexMapData.selections.path = []
            return
        }

        let findNewPath = false

        if(this.hexMapData.selections.movement.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1){

            let actionSelections = [...this.hexMapData.selections.action, ...this.hexMapData.selections.attack]

            if(actionSelections.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1){
                this.hexMapData.selections.path = []
                return
            } else {
                let neighbors
                if(path.length>0) neighbors = this.hexMapData.getNeighborKeys(path[path.length-1].q, path[path.length-1].r)
                else neighbors = this.hexMapData.getNeighborKeys(unit.position.q, unit.position.r)
        
                if(neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1){
                    this.hexMapData.selections.path = this.utils.findClosestAdjacentPath(unit.position, hoverTile)
                    return
                }
            }
        } else if(path.length == 0) {
            let neighbors = this.hexMapData.getNeighborKeys(unit.position.q, unit.position.r)
            if(neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1) {
                findNewPath = true
            } else {
                path.push(hoverTile)
            }
        } else if (path.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != -1) {
            if(path.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) != path.length - 1){
                findNewPath = true
            }
        } else {
            let neighbors = this.hexMapData.getNeighborKeys(path[path.length-1].q, path[path.length-1].r)
            neighbors.push(path[path.length-1])
    
            if(neighbors.findIndex(pos => pos.q == hoverTile.q && pos.r == hoverTile.r) == -1){
                findNewPath = true
            } else {
                path.push(hoverTile)
            }
        }


        if(this.utils.checkValidPath() == false) findNewPath = true

        if(findNewPath == false) return

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

    moveUnit = () => {
        if (this.selectedUnit != null) this.utils.lerpUnit(this.selectedUnit)
        this.utils.resetSelected()
        this.utils.clearContextMenu()
    }

    mineOre = () => {

        if (this.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetStructure = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.selectedUnit.target = targetStructure

        let neighbors = this.hexMapData.getNeighborKeys(this.selectedUnit.position.q, this.selectedUnit.position.r)

        if (this.hexMapData.selections.path.length == 0) {
            this.utils.mineOre(this.selectedUnit, targetTile)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.selectedUnit, targetTile, 'mine')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    attack = () => {

        if (this.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetObject

        if (this.hexMapData.getUnit(targetTile.position.q, targetTile.position.r) != null) {
            targetObject = this.hexMapData.getUnit(targetTile.position.q, targetTile.position.r)
        } else {
            if (this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r) == null) return
            targetObject = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        }
        if (targetObject == null) return

        this.selectedUnit.target = targetObject

        let neighbors = this.hexMapData.getNeighborKeys(this.selectedUnit.position.q, this.selectedUnit.position.r)

        if (neighbors.filter(tile => tile.q == targetObject.position.q && tile.r == targetObject.position.r).length == 1) {
            this.utils.attackUnit(this.selectedUnit)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.selectedUnit, targetTile, 'attack')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    capture = () => {

        if (this.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetStructure = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.selectedUnit.target = targetStructure

        let neighbors = this.hexMapData.getNeighborKeys(this.selectedUnit.position.q, this.selectedUnit.position.r)

        if (neighbors.filter(tile => tile.q == targetStructure.position.q && tile.r == targetStructure.position.r).length == 1) {
            this.utils.captureFlag(this.selectedUnit, targetTile)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.selectedUnit, targetTile, 'capture')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    cancelMovement = () => {
        this.utils.resetSelected()

        this.hexMapData.state = 'selectTile'

        this.utils.clearContextMenu()
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
            this.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnMine', 'btnCancel'])
            return
        }

        if (flagMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnCapture', 'btnCancel'])
            return
        }

        if (attackMoveSet.some(tileObj => tileObj.tile.q == tile.position.q && tileObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.selectedUnit = unit
            this.hexMapData.state = 'selectAction'

            this.utils.setContextMenu(x, y, ['btnAttack', 'btnCancel'])
            return
        }

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'target')
            this.selectedUnit = unit
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

    rotateRight = () => {

        if (this.hexMapData.state == 'selectAction') return

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos();

            this.camera.rotateCameraRight()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 1) {

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.q - centerHexPos.r
                let newR = centerHexPos.r;
                let newS = centerHexPos.s;

                centerHexPos.q = -newR;
                centerHexPos.r = -newS;

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }
    }

    rotateLeft = () => {

        if (this.hexMapData.state == 'selectAction') return

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos();

            this.camera.rotateCameraLeft()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 0) {

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.r - centerHexPos.q
                let newQ = centerHexPos.q;
                let newS = centerHexPos.s;

                centerHexPos.r = -newQ;
                centerHexPos.q = -newS;

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }
    }

    setPlaceUnit = () => {
        if (this.hexMapData.state != 'selectTile') return

        this.utils.resetSelected()
        this.utils.resetHover()
        this.hexMapData.state = 'placeUnit'
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

}