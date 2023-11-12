
import HexMapPathFinderClass from "./HexMapPathFinder"
import CollisionClass from "../../../utilities/collision"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.selectionData = hexMapData.selectionData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData
        this.tileData = hexMapData.tileData

        this.pathFinder = new HexMapPathFinderClass(hexMapData)
        this.collision = new CollisionClass()
        this.commonUtils = new CommonHexMapUtilsClass()

    }

    findPath = (startTile, targetTile) => {

        if (targetTile == null || startTile == null) return

        let target = targetTile
        let start = startTile

        let path = this.pathFinder.findPath(start, target)

        if (!path) return null

        return path.map(tileObj => tileObj.tile)
    }

    findClosestAdjacentPath = (startTile, targetTile) => {
        if (targetTile == null || startTile == null) return

        let target = targetTile
        let start = startTile

        let neighbors = this.tileData.getNeighborKeys(target, 1)

        let path = this.pathFinder.findClosestPath(start, target, neighbors)

        if (!path) return null

        return path.map(tileObj => tileObj.tile)
    }

    checkValidPath = () => {
        let unit = this.unitData.selectedUnit
        let path = [unit.position, ...this.selectionData.getPath()]
        let pathCost = this.pathFinder.pathCost(path)
        if (pathCost <= unit.stats.movement) return true
        return false
    }

    findMoveSet = () => {

        let unit = this.unitData.selectedUnit
        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.stats.movement)
        let actionMoveSet = this.pathFinder.findActionMoveSet(unit.position)
        let attackMoveSet = this.pathFinder.findAttackMoveSet(unit.position, unit.stats.range)

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
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'flag')) {
                actionSet.push({ ...tile.position })
            }
        }

        for (let tile of attackMoveSet) {
            if (this.unitData.getUnit(tile.position) != null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'bunker')) {
                if (this.validTarget(unit.position, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('movement', movementSet)
        this.selectionData.setPathingSelection('action', actionSet)
        this.selectionData.setPathingSelection('attack', attackSet)
    }

    findActionSet = () => {
        let unit = this.unitData.selectedUnit
        if (unit == null) return

        let actionMoveSet = this.pathFinder.findActionMoveSet(unit.position)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'flag')) {
                if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                actionSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('action', actionSet)
    }

    findAttackSet = () => {
        let unit = this.unitData.selectedUnit
        if (unit == null) return

        let attackMoveSet = this.pathFinder.findAttackMoveSet(unit.position, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.commonUtils.tilesEqual(tile.position, unit.position)) continue
            if (this.unitData.getUnit(tile.position) != null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'bunker')) {
                if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                if (this.validTarget(unit.position, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('attack', attackSet)
    }

    findActionMoveSet = (tilePos) => {
        let actionMoveSet = this.pathFinder.findActionMoveSet(tilePos)
        let actionSet = []

        for (let tile of actionMoveSet) {
            if ((this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'resource')
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'flag')) {
                if (this.selectionData.getPathingSelection('action').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                actionSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('actionMove', actionSet)
    }

    findAttackMoveSet = (tilePos) => {
        let unit = this.unitData.selectedUnit
        if (unit == null) return

        let attackMoveSet = this.pathFinder.findAttackMoveSet(tilePos, unit.stats.range)
        let attackSet = []

        for (let tile of attackMoveSet) {
            if (this.commonUtils.tilesEqual(tile.position, unit.position)) continue
            if (this.unitData.getUnit(tile.position) != null
                || (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type == 'bunker')) {
                if (this.selectionData.getPathingSelection('attack').some(pos => this.commonUtils.tilesEqual(tile.position, pos))) continue
                if (this.validTarget(tilePos, tile.position)) attackSet.push({ ...tile.position })
            }
        }

        this.selectionData.setPathingSelection('attackMove', attackSet)
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
        if (tileIndex != -1) {
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
            if (this.pathFinder.pathCost(path) <= unit.stats.movement) return
            else this.selectionData.clearPath()
        }

        //find new path
        let newPath = this.findPath(unit.position, hoverTile)
        this.selectionData.setPath(newPath)
        this.findActionMoveSet(hoverTile)
        this.findAttackMoveSet(hoverTile)


    }

    setEndMove = (hoverTile) => {
        //check action moveset and attack moveset
        let actionSelections = this.selectionData.getPathingSelection('action')
        let attackSelections = this.selectionData.getPathingSelection('attack')

        this.selectionData.clearPath()

        if (actionSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.setActionHover(hoverTile)
            return
        }
        if (attackSelections.some(pos => this.commonUtils.tilesEqual(hoverTile, pos))) {
            this.selectionData.setAttackHover(hoverTile)
            return
        }
    }

    validTarget = (pos, target) => {

        let validateHalfTile = (tile) => {
            let secondTile = { ...tile }
            if ((secondTile.q - 0.5) % 1 == 0) secondTile.q -= 0.01
            if ((secondTile.r - 0.5) % 1 == 0) secondTile.r -= 0.01

            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)

            secondTile = this.commonUtils.roundToNearestHex(secondTile)
            secondTile = this.tileData.getEntry(secondTile)

            let firstTileOpen = true
            let secondTileOpen = true

            if (tile === null || secondTile === null) return true

            if (this.unitData.getUnit(tile.position) != null) firstTileOpen = false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type != 'modifier') firstTileOpen = false

            if (this.unitData.getUnit(secondTile.position) != null) secondTileOpen = false
            if (this.structureData.hasStructure(secondTile.position) && this.structureData.getStructure(secondTile.position).type != 'modifier') secondTileOpen = false

            if (firstTileOpen == false && secondTileOpen == false) return false
            return true
        }

        let validateTile = (tile) => {
            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)
            if (tile === null) return true
            if (this.unitData.getUnit(tile.position) != null) return false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).type != 'modifier') return false
            return true
        }

        let dist = this.commonUtils.getDistance(pos, target)
        let dirVector = { q: target.q - pos.q, r: target.r - pos.r }
        dirVector.q /= dist
        dirVector.r /= dist

        for (let i = 1; i < dist; i++) {
            let tile = { q: pos.q + dirVector.q * i, r: pos.r + dirVector.r * i }
            let validation
            if ((tile.q - 0.5) % 1 == 0 || (tile.r - 0.5) % 1 == 0) validation = validateHalfTile(tile)
            else validation = validateTile(tile)
            if (validation == false) return false
        }

        return true

    }

    findPlacementSet = () => {

        let placementSet = new Set()

        let bunkers = this.structureData.getBunkersArray()
        for (let bunker of bunkers) {
            let neighborKeys = this.tileData.getNeighborKeys(bunker.position, 1)
            for (let neighborKey of neighborKeys) {
                if (this.pathFinder.isValidPathTile(neighborKey)) {
                    placementSet.add(this.commonUtils.join(neighborKey))
                }
            }

        }

        this.selectionData.setPathingSelection('placement', Array.from(placementSet).map(keyStr => this.commonUtils.split(keyStr)))

    }

    getSelectedTile = (x, y) => {

        let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]

        x *= (this.mapData.canvas.width + this.cameraData.zoom * this.cameraData.zoomAmount) / this.mapData.canvas.width
        y *= (this.mapData.canvas.height + this.cameraData.zoom * this.cameraData.zoomAmount * (this.mapData.canvas.height / this.mapData.canvas.width)) / this.mapData.canvas.height

        let ogPos = {
            x: x,
            y: y
        }

        x += this.cameraData.position.x
        y += this.cameraData.position.y
        x -= this.tileData.posMap.get(this.cameraData.rotation).x
        y -= this.tileData.posMap.get(this.cameraData.rotation).y

        let hexClicked = {
            q: ((2 / 3 * x)) / this.mapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.mapData.squish))) / this.mapData.size
        }

        hexClicked = this.commonUtils.roundToNearestHex(hexClicked)


        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 2 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 3 }, { q: 1, r: 2 }, { q: 0, r: 3 }, { q: -1, r: 4 }, { q: 1, r: 3 }, { q: 0, r: 4 }]
        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {

            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }


            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue

            let rotatedTile = this.tileData.getEntryRotated(testTile, this.cameraData.rotation)

            let hexPos = this.tileData.hexPositionToXYPosition(testTile, rotatedTile.height, this.cameraData.rotation)
            hexPos.x -= this.cameraData.position.x
            hexPos.y -= this.cameraData.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.mapData.size, this.mapData.squish)) {
                tileClicked = testTile
                continue
            }

        }

        if (tileClicked === null) return null
        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)
        let tileClickedObj = this.tileData.getEntry(rotatedTile)
        if (!tileClickedObj || !tileClickedObj.images || tileClickedObj.images.length == 0) return null

        return rotatedTile

    }

    getCenterHexPos = (newRotation) => {

        let zoomAmount = this.cameraData.zoomAmount
        let zoomLevel = this.cameraData.zoom

        let size = this.mapData.size
        let squish = this.mapData.squish

        let zoom = zoomLevel * zoomAmount

        let rotation = this.cameraData.rotation
        if (newRotation !== undefined && newRotation !== null) rotation = newRotation

        let centerPos = {
            x: this.cameraData.position.x + zoom / 2 + this.mapData.canvas.width / 2 - this.tileData.posMap.get(rotation).x,
            y: this.cameraData.position.y + zoom / 2 * (this.mapData.canvas.height / this.mapData.canvas.width) + this.mapData.canvas.height / 2 - this.tileData.posMap.get(rotation).y
        }

        let centerHexPos = {
            q: ((2 / 3) * centerPos.x) / size,
            r: ((-1 / 3) * centerPos.x + Math.sqrt(3) / 3 * (centerPos.y * (1 / squish))) / size
        }


        return centerHexPos
    }

    getTargetObject = (pos) => {
        let targetObject
        if (this.unitData.getUnit(pos) != null) {
            targetObject = this.unitData.getUnit(pos)
        } else {
            if (this.structureData.getStructure(pos) == null) return
            targetObject = this.structureData.getStructure(pos)
        }
        return targetObject
    }

}