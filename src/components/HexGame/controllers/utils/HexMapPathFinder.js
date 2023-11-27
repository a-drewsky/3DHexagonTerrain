
import HexMapPathFinderUtilsClass from "./HexMapPathFinderUtils"
import CollisionClass from "../../commonUtils/CollisionUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapPathFinderClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.selectionData = hexMapData.selectionData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData
        this.tileData = hexMapData.tileData

        this.utils = new HexMapPathFinderUtilsClass(hexMapData)
        this.collision = new CollisionClass()
        this.commonUtils = new CommonHexMapUtilsClass()

    }

    findPath = (startTile, targetTile) => {

        if (targetTile === null || startTile === null) return

        let target = targetTile
        let start = startTile

        let path = this.utils.findPath(start, target)

        if (!path) return null

        return path.map(tileObj => tileObj.tile)
    }

    findMoveSet = () => {

        let unit = this.unitData.selectedUnit
        if (unit === null) return

        let moveSet = this.utils.findMoveSet(unit.position, unit.stats.movement)
        let actionMoveSet = this.utils.findActionMoveSet(unit.position)
        let attackMoveSet = this.utils.findAttackMoveSet(unit.position, unit.stats.range)

        if (!moveSet) return

        let movementSet = []
        let actionSet = []
        let attackSet = []

        for (let tileObj of moveSet) {
            let tile = this.tileData.getEntry(tileObj.tile)

            movementSet.push({ ...tile.position })
        }

        //search for structures
        for (let tile of actionMoveSet) {
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'flag')) {
                actionSet.push({ ...tile.position })
            }
        }

        for (let tile of attackMoveSet) {
            if (this.unitData.getUnit(tile.position) !== null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'bunker')) {
                if (this.validTarget(unit.position, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('movement', movementSet)
        this.selectionData.setPathingSelection('action', actionSet)
        this.selectionData.setPathingSelection('attack', attackSet)
    }

    findActionSet = () => {
        let unit = this.unitData.selectedUnit
        if (unit === null) return

        let actionMoveSet = this.utils.findActionMoveSet(unit.position)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'flag')) {
                if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                actionSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('action', actionSet)
    }

    findAttackSet = () => {
        let unit = this.unitData.selectedUnit
        if (unit === null) return

        let attackMoveSet = this.utils.findAttackMoveSet(unit.position, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.commonUtils.tilesEqual(tile.position, unit.position)) continue
            if (this.unitData.getUnit(tile.position) !== null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'bunker')) {
                if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                if (this.validTarget(unit.position, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('attack', attackSet)
    }

    findActionMoveSet = (tilePos) => {
        let actionMoveSet = this.utils.findActionMoveSet(tilePos)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'flag')) {
                if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                actionSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('actionMove', actionSet)
    }

    findAttackMoveSet = (tilePos) => {
        let unit = this.unitData.selectedUnit
        if (unit === null) return

        let attackMoveSet = this.utils.findAttackMoveSet(tilePos, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.commonUtils.tilesEqual(tile.position, unit.position)) continue
            if (this.unitData.getUnit(tile.position) !== null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'bunker')) {
                if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                if (this.validTarget(tilePos, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('attackMove', attackSet)
    }

    findPlacementSet = () => {

        let placementSet = new Set()

        let bunkers = this.structureData.getBunkersArray()
        for (let bunker of bunkers) {
            let neighborKeys = this.tileData.getNeighborKeys(bunker.position, 1)
            for (let neighborKey of neighborKeys) {
                if (this.utils.isValidPathTile(neighborKey)) {
                    placementSet.add(this.commonUtils.join(neighborKey))
                }
            }

        }

        this.selectionData.setPathingSelection('placement', Array.from(placementSet).map(keyStr => this.commonUtils.split(keyStr)))

    }

    setPath = (hoverTile) => {

        //check action moveset and attack moveset
        let actionSelections = this.selectionData.getPathingSelection('action')
        let attackSelections = this.selectionData.getPathingSelection('attack')

        if (actionSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            this.selectionData.setActionHover(hoverTile)
            return
        }
        if (attackSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            this.selectionData.setAttackHover(hoverTile)
            return
        }


        let path = this.selectionData.getPath()
        let unit = this.unitData.selectedUnit

        let prevTile = unit.position
        if (path.length > 0) prevTile = path[path.length - 1]

        //check if path contains hoverTile
        let tileIndex = path.findIndex(pos => this.commonUtils.tilesEqual(hoverTile, pos))
        if (tileIndex !== -1) {
            this.selectionData.setPath(path.slice(0, tileIndex + 1))
            this.findActionMoveSet(hoverTile)
            this.findAttackMoveSet(hoverTile)
            return
        }

        //check if tile is in move range
        if (!this.selectionData.getPathingSelection('movement').some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.clearPath()
            return
        }
        //check if hoverTile is adjacent to prevTile
        let prevTileNeighbors = this.tileData.getNeighborKeys(prevTile)
        if (prevTileNeighbors.some(tileKey => this.commonUtils.tilesEqual(tileKey, hoverTile))) {
            this.selectionData.addToPath(hoverTile)
            this.findActionMoveSet(hoverTile)
            this.findAttackMoveSet(hoverTile)
            if (this.utils.pathCost(path) <= unit.stats.movement) return
            else this.selectionData.clearPath()
        }

        //find new path
        let newPath = this.findPath(unit.position, hoverTile)
        this.selectionData.setPath(newPath)
        this.findActionMoveSet(hoverTile)
        this.findAttackMoveSet(hoverTile)


    }

    validTarget = (pos, target) => {

        let validateHalfTile = (tile) => {
            let secondTile = { ...tile }
            if ((secondTile.q - 0.5) % 1 === 0) secondTile.q -= 0.01
            if ((secondTile.r - 0.5) % 1 === 0) secondTile.r -= 0.01

            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)

            secondTile = this.commonUtils.roundToNearestHex(secondTile)
            secondTile = this.tileData.getEntry(secondTile)

            let firstTileOpen = true
            let secondTileOpen = true

            if (tile === null || secondTile === null) return true

            if (this.unitData.getUnit(tile.position) !== null) firstTileOpen = false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType !== 'modifier') firstTileOpen = false

            if (this.unitData.getUnit(secondTile.position) !== null) secondTileOpen = false
            if (this.structureData.hasStructure(secondTile.position) && this.structureData.getStructure(secondTile.position).spriteType !== 'modifier') secondTileOpen = false

            if (firstTileOpen === false && secondTileOpen === false) return false
            return true
        }

        let validateTile = (tile) => {
            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)
            if (tile === null) return true
            if (this.unitData.getUnit(tile.position) !== null) return false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType !== 'modifier') return false
            return true
        }

        let dist = this.commonUtils.getDistance(pos, target)
        let dirVector = { q: target.q - pos.q, r: target.r - pos.r }
        dirVector.q /= dist
        dirVector.r /= dist

        for (let i = 1; i < dist; i++) {
            let tile = { q: pos.q + dirVector.q * i, r: pos.r + dirVector.r * i }
            let validation
            if ((tile.q - 0.5) % 1 === 0 || (tile.r - 0.5) % 1 === 0) validation = validateHalfTile(tile)
            else validation = validateTile(tile)
            if (validation === false) return false
        }

        return true

    }

}