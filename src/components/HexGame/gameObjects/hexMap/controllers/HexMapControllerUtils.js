
import HexMapPathFinderClass from "./HexMapPathFinder"
import CollisionClass from "../../../utilities/collision"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, tileManager, spriteManager, canvas, images, uiController, globalState) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.selectionData = hexMapData.selectionData

        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.canvas = canvas
        this.images = images
        this.globalState = globalState
        this.uiController = uiController

        this.pathFinder = new HexMapPathFinderClass(hexMapData, tileManager, spriteManager)
        this.collision = new CollisionClass();
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

        let neighbors = this.tileManager.data.getNeighborKeys(target.q, target.r, 1)

        let path = this.pathFinder.findClosestPath(start, target, neighbors)

        if (!path) return null

        return path.map(tileObj => tileObj.tile)
    }

    checkValidPath = () => {
        let unit = this.spriteManager.units.data.selectedUnit
        let path = [unit.position, ...this.selectionData.selections.path]
        let pathCost = this.pathFinder.pathCost(path)
        if (pathCost <= unit.stats.movement) return true
        return false
    }

    findMoveSet = () => {

        let unit = this.spriteManager.units.data.selectedUnit

        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.stats.movement)
        let actionMoveSet = this.pathFinder.findActionMoveSet(unit.position, 1)
        let attackMoveSet = this.pathFinder.findAttackMoveSet(unit.position, unit.stats.range)
        console.log(moveSet)
        console.log(actionMoveSet)
        console.log(attackMoveSet)

        if (!moveSet) return

        let pathing = {
            movement: [],
            action: [],
            attack: []
        }

        for (let tileObj of moveSet) {
            let tile = this.tileManager.data.getEntry(tileObj.tile.q, tileObj.tile.r)

            pathing.movement.push({ q: tile.position.q, r: tile.position.r })
        }

        //search for structures
        for (let tile of actionMoveSet) {
            if ((this.spriteManager.structures.data.hasStructure(tile.position.q, tile.position.r) && this.spriteManager.structures.data.getStructure(tile.position.q, tile.position.r).type == 'resource')
                || (this.spriteManager.structures.data.hasStructure(tile.position.q, tile.position.r) && this.spriteManager.structures.data.getStructure(tile.position.q, tile.position.r).type == 'flag')) {
                pathing.action.push({ q: tile.position.q, r: tile.position.r })
                continue
            }
        }

        for (let tile of attackMoveSet) {
            if (this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r) != null
                || (this.spriteManager.structures.data.hasStructure(tile.position.q, tile.position.r) && this.spriteManager.structures.data.getStructure(tile.position.q, tile.position.r).type == 'bunker')) {
                if(this.validTarget(unit.position, tile.position)) pathing.attack.push({ q: tile.position.q, r: tile.position.r })
                continue
            }
        }
        console.log(pathing)
        this.selectionData.setPathingSelections(pathing)
    }

    validTarget = (pos, target) => {

        let validateHalfTile = (tile) => {
            let secondTile = { q: tile.q, r: tile.r }
            if((secondTile.q-0.5) % 1 == 0 ) secondTile.q -= 0.01
            if((secondTile.r-0.5) % 1 == 0 ) secondTile.r -= 0.01

            tile = this.commonUtils.roundToNearestHex(tile.q, tile.r)
            tile = this.tileManager.data.getEntry(tile.q, tile.r)
            
            secondTile = this.commonUtils.roundToNearestHex(secondTile.q, secondTile.r)
            secondTile = this.tileManager.data.getEntry(secondTile.q, secondTile.r)

            let firstTileOpen = true
            let secondTileOpen = true

            if(tile === null || secondTile === null) return true

            if (this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r) != null) firstTileOpen = false
            if(this.spriteManager.structures.data.hasStructure(tile.position.q, tile.position.r) && this.spriteManager.structures.data.getStructure(tile.position.q, tile.position.r).type != 'modifier') firstTileOpen = false

            if (this.spriteManager.units.data.getUnit(secondTile.position.q, secondTile.position.r) != null) secondTileOpen = false
            if(this.spriteManager.structures.data.hasStructure(secondTile.position.q, secondTile.position.r) && this.spriteManager.structures.data.getStructure(secondTile.position.q, secondTile.position.r).type != 'modifier') secondTileOpen = false

            if(firstTileOpen == false && secondTileOpen == false) return false
            return true
        }

        let validateTile = (tile) => {
            tile = this.commonUtils.roundToNearestHex(tile.q, tile.r)
            tile = this.tileManager.data.getEntry(tile.q, tile.r)
            if(tile === null) return true
            if (this.spriteManager.units.data.getUnit(tile.position.q, tile.position.r) != null) return false
            if(this.spriteManager.structures.data.hasStructure(tile.position.q, tile.position.r) && this.spriteManager.structures.data.getStructure(tile.position.q, tile.position.r).type != 'modifier') return false
            return true
        }

        let dist = this.commonUtils.getDistance(pos, target)
        let dirVector = {q: target.q - pos.q, r: target.r - pos.r}
        dirVector.q /= dist
        dirVector.r /= dist

        for(let i = 1; i < dist; i++){
            let tile = { q: pos.q + dirVector.q * i, r: pos.r + dirVector.r * i }
            let validation
            if( (tile.q-0.5) % 1 == 0 || (tile.r-0.5) % 1 == 0 ) validation = validateHalfTile(tile)
            else validation = validateTile(tile)
            if(validation == false) return false
        }

        return true

    }

    checkUnitPlacementTile = (tile) => {

        let placementSet = [...this.selectionData.selections.placement]

        if (placementSet.findIndex(placementTile => placementTile.q == tile.position.q && placementTile.r == tile.position.r) != -1) return true
        return false
    }

    findPlacementSet = () => {

        let placementSet = new Set()

        let bunkers = this.spriteManager.structures.data.getBunkersArray()
        for (let bunker of bunkers) {
            let neighborKeys = this.tileManager.data.getNeighborKeys(bunker.position.q, bunker.position.r, 1)
            for (let neighborKey of neighborKeys) {
                if (this.pathFinder.isValid(neighborKey.q, neighborKey.r)) {
                    placementSet.add(this.commonUtils.join(neighborKey.q, neighborKey.r))
                }
            }

        }

        this.selectionData.setPlacementSelection(Array.from(placementSet).map(keyStr => this.commonUtils.split(keyStr)))

    }

    getSelectedTile = (x, y) => {

        let rotatedMap = this.tileManager.data.rotatedMapList[this.cameraData.rotation]

        x *= (this.canvas.width + this.cameraData.zoom * this.cameraData.zoomAmount) / this.canvas.width
        y *= (this.canvas.height + this.cameraData.zoom * this.cameraData.zoomAmount * (this.canvas.height / this.canvas.width)) / this.canvas.height


        let ogPos = {
            x: x,
            y: y
        }

        x += this.cameraData.position.x
        y += this.cameraData.position.y

        x -= this.tileManager.data.posMap.get(this.cameraData.rotation).x

        y -= this.tileManager.data.posMap.get(this.cameraData.rotation).y


        let hexClicked = {
            q: ((2 / 3 * x)) / this.mapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.mapData.squish))) / this.mapData.size
        }

        hexClicked = this.commonUtils.roundToNearestHex(hexClicked.q, hexClicked.r)



        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 2 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 3 }, { q: 1, r: 2 }, { q: 0, r: 3 }, { q: -1, r: 4 }, { q: 1, r: 3 }, { q: 0, r: 4 }]


        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {

            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }


            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let rotatedTile = this.tileManager.data.getEntryRotated(testTile.q, testTile.r, this.cameraData.rotation)

            let hexPos = this.tileManager.data.hexPositionToXYPosition(testTile, rotatedTile.height, this.cameraData.rotation)

            hexPos.x -= this.cameraData.position.x
            hexPos.y -= this.cameraData.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.mapData.size, this.mapData.squish)) {
                tileClicked = testTile
                continue
            }

            let structureData = null
            if (this.spriteManager.structures.data.hasStructure(rotatedTile.position.q, rotatedTile.position.r)) {
                structureData = this.spriteManager.structures.data.getStructure(rotatedTile.position.q, rotatedTile.position.r).data
            }
            let unitData = null
            if (this.spriteManager.units.data.hasUnit(rotatedTile.position.q, rotatedTile.position.r)) {
                unitData = this.spriteManager.units.data.getUnit(rotatedTile.position.q, rotatedTile.position.r)
            }

            if (structureData && structureData.type != 'modifier') {

                let spriteObj = this.images[structureData.type][structureData.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.mapData.size * 2 * (spriteObj.spriteSize.width - spriteObj.padding[structureData.state.current.name][this.cameraData.rotation].x / 32 * 2),
                    height: this.mapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.padding[structureData.state.current.name][this.cameraData.rotation].y / 32)
                }

                spritePos.x -= this.mapData.size + (spriteObj.spriteOffset.x - spriteObj.padding[structureData.state.current.name][this.cameraData.rotation].x / 32) * this.mapData.size * 2
                spritePos.y -= (this.mapData.size * this.mapData.squish) + (spriteObj.spriteOffset.y - spriteObj.padding[structureData.state.current.name][this.cameraData.rotation].y / 32) * this.mapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }

            }

            if (unitData && unitData.state == 'idle') {
                let spriteObj = this.images[unitData.type][unitData.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.mapData.size * 2 * (spriteObj.spriteSize.width - spriteObj.padding[unitData.frame][this.cameraData.rotation].x / 32 * 2),
                    height: this.mapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.padding[unitData.frame][this.cameraData.rotation].y / 32)
                }

                spritePos.x -= this.mapData.size + (spriteObj.spriteOffset.x - spriteObj.padding[unitData.frame][this.cameraData.rotation].x / 32) * this.mapData.size * 2
                spritePos.y -= (this.mapData.size * this.mapData.squish) + (spriteObj.spriteOffset.y - spriteObj.padding[unitData.frame][this.cameraData.rotation].y / 32) * this.mapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }
            }

        }

        if (tileClicked === null) return null

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        let tileClickedObj = this.tileManager.data.getEntry(rotatedTile.q, rotatedTile.r)

        if (!tileClickedObj || !tileClickedObj.images || tileClickedObj.images.length == 0) return null

        return rotatedTile

    }

    getCenterHexPos = (newRotation) => {

        let zoomAmount = this.cameraData.zoomAmount
        let zoomLevel = this.cameraData.zoom

        let size = this.mapData.size;
        let squish = this.mapData.squish;

        let zoom = zoomLevel * zoomAmount

        let rotation = this.cameraData.rotation
        if (newRotation !== undefined && newRotation !== null) rotation = newRotation

        let centerPos = {
            x: this.cameraData.position.x + zoom / 2 + this.canvas.width / 2 - this.tileManager.data.posMap.get(rotation).x,
            y: this.cameraData.position.y + zoom / 2 * (this.canvas.height / this.canvas.width) + this.canvas.height / 2 - this.tileManager.data.posMap.get(rotation).y
        }


        let centerHexPos;


        centerHexPos = {
            q: ((2 / 3) * centerPos.x) / size,
            r: ((-1 / 3) * centerPos.x + Math.sqrt(3) / 3 * (centerPos.y * (1 / squish))) / size
        }


        return centerHexPos;
    }

}