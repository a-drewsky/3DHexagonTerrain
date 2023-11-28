
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

        let moveSet = this.utils.findMoveSet(unit.position, unit.stats.movement)
        let actionMoveSet = this.utils.findActionMoveSet(unit.position)
        let attackMoveSet = this.utils.findAttackMoveSet(unit.position, unit.stats.range)

        let movementSet = []
        let actionSet = []
        let attackSet = []

        for (let tileObj of moveSet) {
            let tile = this.tileData.getEntry(tileObj.tile)
            movementSet.push({ ...tile.position })
        }

        //search for structures
        for (let tile of actionMoveSet) if (this.structureData.hasAction(tile.position)) actionSet.push({ ...tile.position })  
        

        for (let tile of attackMoveSet) {
            if (this.unitData.getUnit(tile.position) !== null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'bunker')) {
                if (this.validTarget(unit.position, tile.position, unit.stats['drop_attack'])) attackSet.push({ ...tile.position })
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
            if (this.unitData.getUnit(tile.position) !== null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType === 'bunker')) {
                if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                if (this.validTarget(unit.position, tile.position, unit.stats['drop_attack'])) attackSet.push({ ...tile.position })
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
                if (this.validTarget(tilePos, tile.position, unit.stats['drop_attack'])) attackSet.push({ ...tile.position })
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

    validTarget = (pos, target, dropAttack) => {

        let validateTargetHeight = (pos, target) => {
            let distance = this.commonUtils.getDistance(pos, target)
            let heightDiff = this.tileData.getEntry(target).height - this.tileData.getEntry(pos).height

            if(heightDiff <= 0 && dropAttack === true) return true

            heightDiff = Math.abs(heightDiff)

            if(heightDiff > distance) return false
            return true
        }

        let validateTileHeight = (tile, percent) => {
            let posHeight = this.tileData.getEntry(pos).height
            let targetHeight = this.tileData.getEntry(target).height
            let projectileHeight = posHeight + (targetHeight - posHeight) * percent + 1
            if (tile.height > projectileHeight) return false
            return true
        }

        let validateTile = (tile, percent) => {
            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)

            if (tile === null) return true
            if(!validateTileHeight(tile, percent)) return false
            if (this.unitData.getUnit(tile.position) !== null) return false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType !== 'modifier') return false

            return true
        }

        if(!validateTargetHeight(pos, target)) return false

        let dist = this.commonUtils.getDistance(pos, target)
        let dirVector = { q: target.q - pos.q, r: target.r - pos.r }
        dirVector.q /= dist
        dirVector.r /= dist

        for (let i = 1; i < dist; i++) {
            let tile = { q: pos.q + dirVector.q * i, r: pos.r + dirVector.r * i }
            if (validateTile(tile, i/dist) === false) return false
        }

        return true

    }

}