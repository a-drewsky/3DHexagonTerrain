import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapControllerUtilsClass from "./HexMapControllerUtils"

export default class HexMapControllerHoverClass {

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
    }

    hover = (x, y) => {
        this.selectionData.clearHover()

        switch (this.mapData.curState()) {
            case 'selectTile':
            case 'animation':
                this.setHover(x, y)
                return
            case 'placeUnit':
                this.updatePlacementSelection(x, y)
                return
            case 'selectMovement':
                this.updatePathSelection(x, y)
                return
            case 'chooseRotation':
                this.setUnitMouseDirection(x, y)
                this.updateEndMoveSelection(x, y)
                return
            default:
                return
        }
    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let tileObj = this.tileData.getEntry(hoverTile)

        switch (this.mapData.curState()) {
            case 'selectTile':
                this.selectionData.setInfoSelection('hover', tileObj.position)
                return
            case 'placeUnit':
            case 'chooseRotation':
            case 'selectMovement':
            case 'animation':
                return
            default:
                return
        }
    }

    updatePlacementSelection = (x, y) => {

        if (this.unitData.placementUnit !== null) {
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

    setUnitMouseDirection = (x, y) => {

        if (this.selectionData.getPathLocked()) return

        let unit = this.unitData.selectedUnit
        if (unit === null) return

        let tileClicked = this.utils.getSelectedTile(x, y)
        if (!tileClicked) return

        if (unit.rotation === this.commonUtils.getDirection(unit.position, tileClicked)) return

        unit.setDirection(tileClicked)

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

}