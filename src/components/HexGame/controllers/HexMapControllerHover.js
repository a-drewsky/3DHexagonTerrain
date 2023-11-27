import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import HexMapControllerUtilsClass from "./utils/HexMapControllerUtils"
import HexMapPathFinderClass from "./utils/HexMapPathFinder"

export default class HexMapControllerHoverClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.cameraData = gameData.cameraData
        this.tileData = gameData.tileData
        this.selectionData = gameData.selectionData
        this.cardData = gameData.cardData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData

        this.utils = new HexMapControllerUtilsClass(gameData)
        this.pathfinder = new HexMapPathFinderClass(gameData)
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
                this.updatePlacementHover(x, y)
                return
            case 'selectMovement':
                this.updatePathHover(x, y)
                return
            case 'chooseRotation':
                this.setUnitMouseDirection(x, y)
                this.updateEndMoveHover(x, y)
                return
            default:
                return
        }
    }

    setHover = (x, y) => {

        let hoverTile = this.utils.getSelectedTile(x, y)

        if (!hoverTile) return

        let tileObj = this.tileData.getEntry(hoverTile)
        this.selectionData.setInfoSelection('hover', tileObj.position)
    }

    updatePlacementHover = (x, y) => {

        this.utils.setPlacementUnitRotation()

        if (this.selectionData.getPathLocked()) return
        this.selectionData.clearPath()

        let hoverTile = this.utils.getSelectedTile(x, y)
        this.utils.setPlacementUnitPosition(hoverTile)

        if (hoverTile && this.selectionData.getPathingSelection('placement').some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.setPlacementHover(hoverTile)
            return
        }
        this.selectionData.setInfoSelection('hover', hoverTile)

    }

    updatePathHover = (x, y) => {

        if (this.selectionData.getPathLocked()) return

        this.selectionData.clearHover()
        this.selectionData.clearTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)
        if (!hoverTile) {
            this.selectionData.clearPath()
            return
        }
        this.pathfinder.setPath(hoverTile)

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

    updateEndMoveHover = (x, y) => {
        if (this.selectionData.getPathLocked()) return
        this.selectionData.clearTarget()

        let hoverTile = this.utils.getSelectedTile(x, y)
        if (!hoverTile) {
            this.selectionData.clearPath()
            return
        }

        this.utils.setEndMoveHover(hoverTile)
    }

}