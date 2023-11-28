
import HexMapPathFinderUtilsClass from "./HexMapPathFinderUtils"
import CollisionClass from "../../commonUtils/CollisionUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapPathFinderClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.cameraData = gameData.cameraData
        this.selectionData = gameData.selectionData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData
        this.tileData = gameData.tileData

        this.utils = new HexMapPathFinderUtilsClass(gameData)
        this.collision = new CollisionClass()
        this.commonUtils = new CommonHexMapUtilsClass()

    }

    setMoveSet = () => {

        let unit = this.unitData.selectedUnit

        let moveSet = this.utils.getMoveSet(unit.position, unit.stats.movement)
        let movementSet = []

        for (let tile of moveSet) movementSet.push({ ...tile.position })

        this.selectionData.setPathingSelection('movement', movementSet)
    }

    setActionSet = () => {
        let unit = this.unitData.selectedUnit

        let actionMoveSet = this.utils.getActionSet(unit.position)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if (!this.structureData.hasAction(tile.position)) continue
            if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue

            actionSet.push({ ...tile.position })
        }

        this.selectionData.setPathingSelection('action', actionSet)
    }

    setAttackSet = () => {
        let unit = this.unitData.selectedUnit

        let attackMoveSet = this.utils.getAttackSet(unit.position, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.unitData.getUnit(tile.position) === null && !this.structureData.hasAttack(tile.position)) continue
            if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
            if (!this.utils.validateAttackTarget(unit.position, tile.position, unit.stats['drop_attack'])) continue

            attackSet.push({ ...tile.position })
        }

        this.selectionData.setPathingSelection('attack', attackSet)
    }

    setActionMoveSet = (tilePos) => {
        let actionMoveSet = this.utils.getActionSet(tilePos)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if (!this.structureData.hasAction(tile.position)) continue
            if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue

            actionSet.push({ ...tile.position })
        }

        this.selectionData.setPathingSelection('actionMove', actionSet)
    }

    setAttackMoveSet = (tilePos) => {
        let unit = this.unitData.selectedUnit

        let attackMoveSet = this.utils.getAttackSet(tilePos, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.commonUtils.tilesEqual(tile.position, unit.position)) continue
            if (this.unitData.getUnit(tile.position) === null && !this.structureData.hasAttack(tile.position)) continue
            if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
            if (!this.utils.validateAttackTarget(tilePos, tile.position, unit.stats['drop_attack'])) continue

            attackSet.push({ ...tile.position })
        }

        this.selectionData.setPathingSelection('attackMove', attackSet)
    }

    setPlacementSet = () => {

        let placementSet = new Set()

        let bunkers = this.structureData.getAllBunkers()
        for (let bunker of bunkers) {
            let neighborKeys = this.tileData.getNeighborKeys(bunker.position, 1)
            for (let neighborKey of neighborKeys) {
                if (!this.utils.validatePathTile(neighborKey)) continue
                placementSet.add(this.commonUtils.join(neighborKey))
            }
        }

        this.selectionData.setPathingSelection('placement', Array.from(placementSet).map(keyStr => this.commonUtils.split(keyStr)))

    }

    setPath = (hoverTile) => {

        let unit = this.unitData.selectedUnit
        let path = this.selectionData.getPathSelection()

        //check action selections
        let actionSelections = this.selectionData.getPathingSelection('action')
        if (actionSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            this.selectionData.setActionHover(hoverTile)
            return
        }

        //check attack selections
        let attackSelections = this.selectionData.getPathingSelection('attack')
        if (attackSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            this.selectionData.setAttackHover(hoverTile)
            return
        }

        //check if tile is in move range
        if (!this.selectionData.getPathingSelection('movement').some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            return
        }

        //check if path contains hoverTile
        let tileIndex = path.findIndex(pos => this.commonUtils.tilesEqual(hoverTile, pos))
        if (tileIndex !== -1) {
            this.selectionData.setPath(path.slice(0, tileIndex + 1))
            this.setActionMoveSet(hoverTile)
            this.setAttackMoveSet(hoverTile)
            return
        }

        //check if hoverTile is adjacent to prevTile
        let prevTile = unit.position
        if (path.length > 0) prevTile = path[path.length - 1]
        let prevTileNeighbors = this.tileData.getNeighborKeys(prevTile)
        if (prevTileNeighbors.some(tileKey => this.commonUtils.tilesEqual(tileKey, hoverTile))) {
            this.selectionData.addToPath(hoverTile)
            if (this.utils.getPathCost(unit.position, path) <= unit.stats.movement) {
                this.setActionMoveSet(hoverTile)
                this.setAttackMoveSet(hoverTile)
                return
            }
            else this.selectionData.clearPath()
        }

        //find new path
        let newPath = this.utils.getPath(unit.position, hoverTile)
        this.selectionData.setPath(newPath)
        this.setActionMoveSet(hoverTile)
        this.setAttackMoveSet(hoverTile)


    }

}