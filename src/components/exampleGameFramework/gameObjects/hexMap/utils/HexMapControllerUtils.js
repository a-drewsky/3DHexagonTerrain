
import HexMapPathFinderClass from "./HexMapPathFinder"
import CollisionClass from "../../../utilities/collision"
import HexMapCommonUtilsClass from "./HexMapCommonUtils"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, unitManager, camera, canvas, images, uiController, renderer, globalState) {
        this.hexMapData = hexMapData
        this.unitManager = unitManager
        this.camera = camera
        this.canvas = canvas
        this.images = images
        this.globalState = globalState

        this.uiController = uiController

        this.renderer = renderer

        this.pathFinder = new HexMapPathFinderClass(hexMapData, unitManager, camera)
        this.collision = new CollisionClass();
        this.commonUtils = new HexMapCommonUtilsClass()

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

        let neighbors = this.hexMapData.getNeighborKeys(target.q, target.r)

        let path = this.pathFinder.findClosestPath(start, target, neighbors)

        if (!path) return null

        return path.map(tileObj => tileObj.tile)
    }

    checkValidPath = () => {
        let unit = this.unitManager.selectedUnit
        let path = [unit.data.position, ...this.hexMapData.selections.path]
        let pathCost = this.pathFinder.pathCost(path)
        if (pathCost <= unit.data.stats.movement) return true
        return false
    }


    findMoveSet = () => {

        let unit = this.unitManager.selectedUnit

        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.data.position, unit.data.stats.movement)

        let moveSetPlus1 = this.pathFinder.findFullMoveSet(moveSet, unit.data.position)

        console.log(moveSet)

        if (!moveSet) return

        let pathing = {
            movement: [],
            action: [],
            attack: []
        }

        for (let tileObj of moveSet) {
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)

            pathing.movement.push({ q: tile.position.q, r: tile.position.r })
        }

        //search for structures
        for (let tileObj of moveSetPlus1) {
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)
            if ((this.hexMapData.getTerrain(tile.position.q, tile.position.r) !== null && this.hexMapData.getTerrain(tile.position.q, tile.position.r).type == 'resource')
                || (this.hexMapData.getTerrain(tile.position.q, tile.position.r) !== null && this.hexMapData.getTerrain(tile.position.q, tile.position.r).type == 'flag')) {
                pathing.action.push({ q: tile.position.q, r: tile.position.r })
                continue
            }
            if (this.unitManager.getUnit(tile.position.q, tile.position.r) != null
                || (this.hexMapData.getTerrain(tile.position.q, tile.position.r) !== null && this.hexMapData.getTerrain(tile.position.q, tile.position.r).type == 'base')) {
                pathing.attack.push({ q: tile.position.q, r: tile.position.r })
                continue
            }
        }
        this.hexMapData.selections.setPathingSelections(pathing)
    }

    updateTerrain = (q, r, terrain) => {
        if (terrain.modifierType == 'singleImage') this.renderer.spriteRenderer.modifiers.renderSingleImage(terrain)

        this.hexMapData.setTerrain(q, r, terrain)
    }

    lerpUnit = (unit) => {

        if (unit == null) return

        let startTile = this.hexMapData.getEntry(unit.data.position.q, unit.data.position.r)

        unit.data.path = this.hexMapData.selections.path

        let nextPosition = this.hexMapData.getEntry(unit.data.path[0].q, unit.data.path[0].r)

        unit.data.destination = unit.data.path[0]

        unit.data.destinationStartTime = Date.now()
        unit.data.destinationCurTime = Date.now()

        this.setUnitDirection(unit, unit.data.destination)

        if (nextPosition.height != startTile.height) {
            this.setUnitAnimation(unit, 'jump')
        } else {
            this.setUnitAnimation(unit, 'walk')
        }


    }

    lerpToTarget = (unit, target, futureState) => {

        if (unit == null) return

        unit.data.futureState = futureState

        let startPosition = this.hexMapData.getEntry(unit.data.position.q, unit.data.position.r)

        unit.data.path = this.hexMapData.selections.path

        let nextPosition = this.hexMapData.getEntry(unit.data.path[0].q, unit.data.path[0].r)

        unit.data.destination = unit.data.path[0]

        unit.data.destinationStartTime = Date.now()
        unit.data.destinationCurTime = Date.now()

        this.setUnitDirection(unit, unit.data.destination)

        if (nextPosition.height != startPosition.height) {
            this.setUnitAnimation(unit, 'jump')
        } else {
            this.setUnitAnimation(unit, 'walk')
        }
    }

    setUnitIdle = (unit) => {
        unit.data.target = null
        unit.data.animationCurTime = null
        unit.data.animationStartTime = null

        unit.data.state.current = unit.data.state.idle
        unit.data.frame = 0

        unit.renderer.render()

        this.resetHexMapState()
    }

    resetHexMapState = () => {
        this.hexMapData.selections.resetSelected()
        this.hexMapData.state.current = this.hexMapData.state.selectTile
    }

    setUnitFutureState = (unit) => {

        switch (unit.data.futureState) {
            case 'mine':
                this.mineOre(unit, unit.data.target)
                break
            case 'attack':
                this.attackUnit(unit, unit.data.target)
                break
            case 'capture':
                this.captureFlag(unit, unit.data.target)
                break

        }

        unit.data.futureState = null
        this.hexMapData.selections.resetSelected()

    }

    getDistance = (pos1, pos2) => {
        return (Math.abs(pos1.q - pos2.q)
            + Math.abs(pos1.q + pos1.r - pos2.q - pos2.r)
            + Math.abs(pos1.r - pos2.r)) / 2
    }

    getClosestPos = (pos, posMap) => {
        let distMap = posMap.map(mapPos => mapPos === null ? Infinity : this.getDistance(pos, mapPos))

        let index = distMap.indexOf(Math.min(...distMap))
        return posMap[index]
    }

    setUnitDirection = (unit, targetPos) => {

        //find closest neighbor to targetPos

        let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]
        let rotatePosMap = directionMap.map(pos => pos === null ? null : { q: unit.data.position.q - pos.q, r: unit.data.position.r - pos.r })

        let closestPos
        if (rotatePosMap.findIndex(pos => pos !== null && pos.q == targetPos.q && pos.r == targetPos.r) != -1) {
            closestPos = targetPos
        } else {
            closestPos = this.getClosestPos(targetPos, rotatePosMap)
        }

        let direction = {
            q: closestPos.q - unit.data.position.q,
            r: closestPos.r - unit.data.position.r
        }

        unit.data.rotation = directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)
    }

    setUnitAnimation = (unit, state) => {
        this.hexMapData.state.current = this.hexMapData.state.animation
        unit.data.state.current = unit.data.state[state]
        unit.data.frame = 0
        unit.data.animationStartTime = Date.now()
        unit.data.animationCurTime = Date.now()
        unit.data.frameStartTime = Date.now()
        unit.data.frameCurTime = Date.now()
    }

    mineOre = (unit, targetTile) => {

        this.setUnitDirection(unit, targetTile.position)

        this.setUnitAnimation(unit, 'mine')
    }

    attackUnit = (unit) => {


        this.setUnitDirection(unit, unit.data.target.position)

        this.setUnitAnimation(unit, 'attack')
    }

    setChooseRotation = (unit) => {

        unit.data.target = null
        unit.data.animationCurTime = null
        unit.data.animationStartTime = null

        unit.data.state.current = unit.data.state.idle
        unit.data.frame = 0

        console.log(this.renderer)

        unit.renderer.render()

        this.hexMapData.selections.setSelection(unit.data.position.q, unit.data.position.r, 'unit')

        this.hexMapData.state.current = this.hexMapData.state.chooseRotation

    }

    captureFlag = (unit, targetTile) => {

        this.setUnitDirection(unit, targetTile.position)

        this.globalState.current = this.globalState.pause
        this.uiController.setEndGameMenu(true)
    }

    getSelectedTile = (x, y) => {

        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        x *= (this.canvas.width + this.camera.zoom * this.camera.zoomAmount) / this.canvas.width
        y *= (this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width)) / this.canvas.height


        let ogPos = {
            x: x,
            y: y
        }

        x += this.camera.position.x
        y += this.camera.position.y

        x -= this.hexMapData.posMap.get(this.camera.rotation).x

        y -= this.hexMapData.posMap.get(this.camera.rotation).y


        let hexClicked = {
            q: ((2 / 3 * x)) / this.hexMapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.hexMapData.squish))) / this.hexMapData.size
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

            let rotatedTile = this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation)

            let hexPos = this.hexMapData.hexPositionToXYPosition(testTile, rotatedTile.height, this.camera.rotation)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                tileClicked = testTile
                continue
            }

            let tileTerrain = this.hexMapData.getTerrain(rotatedTile.position.q, rotatedTile.position.r)
            let tileUnit = this.unitManager.getUnit(rotatedTile.position.q, rotatedTile.position.r)

            if (tileTerrain && tileTerrain.type != 'modifier') {

                let spriteObj = this.images[tileTerrain.type][tileTerrain.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * (spriteObj.spriteSize.width - spriteObj.padding[tileTerrain.state][this.camera.rotation].x / 32 * 2),
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.padding[tileTerrain.state][this.camera.rotation].y / 32)
                }

                spritePos.x -= this.hexMapData.size + (spriteObj.spriteOffset.x - spriteObj.padding[tileTerrain.state][this.camera.rotation].x / 32) * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.padding[tileTerrain.state][this.camera.rotation].y / 32) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }

            }

            if (tileUnit && tileUnit.state == 'idle') {
                let spriteObj = this.images[tileUnit.type][tileUnit.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * (spriteObj.spriteSize.width - spriteObj.padding[tileUnit.frame][this.camera.rotation].x / 32 * 2),
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.padding[tileUnit.frame][this.camera.rotation].y / 32)
                }

                spritePos.x -= this.hexMapData.size + (spriteObj.spriteOffset.x - spriteObj.padding[tileUnit.frame][this.camera.rotation].x / 32) * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.padding[tileUnit.frame][this.camera.rotation].y / 32) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }
            }

        }

        if (tileClicked === null) return null

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        let tileClickedObj = this.hexMapData.getEntry(rotatedTile.q, rotatedTile.r)

        if (!tileClickedObj.images || tileClickedObj.images.length == 0) return null

        return rotatedTile

    }

    getCenterHexPos = (newRotation) => {

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let size = this.hexMapData.size;
        let squish = this.hexMapData.squish;

        let zoom = zoomLevel * zoomAmount

        let rotation = this.camera.rotation
        if (newRotation !== undefined && newRotation !== null) rotation = newRotation

        let centerPos = {
            x: this.camera.position.x + zoom / 2 + this.canvas.width / 2 - this.hexMapData.posMap.get(rotation).x,
            y: this.camera.position.y + zoom / 2 * (this.canvas.height / this.canvas.width) + this.canvas.height / 2 - this.hexMapData.posMap.get(rotation).y
        }


        let centerHexPos;


        if (rotation % 2 == 0) {
            centerHexPos = {
                q: (Math.sqrt(3) / 3 * centerPos.x - 1 / 3 * (centerPos.y * (1 / squish))) / size,
                r: ((centerPos.y * (1 / squish)) * (2 / 3)) / size
            }
        } else {
            centerHexPos = {
                q: ((2 / 3) * centerPos.x) / size,
                r: ((-1 / 3) * centerPos.x + Math.sqrt(3) / 3 * (centerPos.y * (1 / squish))) / size
            }
        }

        return centerHexPos;
    }

}