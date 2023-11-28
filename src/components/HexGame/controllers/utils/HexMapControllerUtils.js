
import CollisionClass from "../../commonUtils/CollisionUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapControllerUtilsClass {

    constructor(gameData) {
        this.mapData = gameData.mapData
        this.cameraData = gameData.cameraData
        this.selectionData = gameData.selectionData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData
        this.tileData = gameData.tileData
        this.cardData = gameData.cardData

        this.collision = new CollisionClass()
        this.commonUtils = new CommonHexMapUtilsClass()
        this.pathfinder = new HexMapPathFinderClass(gameData)

    }

    setEndMoveHover = (hoverTile) => {
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

    setChooseRotation = () => {
        let unit = this.unitData.selectedUnit

        this.selectionData.setInfoSelection('unit', unit.position)

        this.mapData.setState('chooseRotation')
        this.pathfinder.setActionSet()
        this.pathfinder.setAttackSet()

        let hoverTile = this.selectionData.getInfoSelection('hover')
        if (hoverTile) {
            unit.setDirection(hoverTile)
            this.setEndMoveHover(hoverTile)
            this.selectionData.clearHover()
        }
    }

    setPlacementUnitRotation = () => {
        this.unitData.placementUnit.rotation = -1 * this.cameraData.rotation + 3
        if (this.unitData.placementUnit.rotation < 0) this.unitData.placementUnit.rotation += 6
    }

    setPlacementUnitPosition = (position) => {
        this.unitData.placementUnit.setPosition(position)
        if (!position) {
            this.unitData.placementUnit.setPosition({ q: null, r: null })
            return
        }
    }

    lockPlacementSelection = (position) => {
        this.selectionData.lockPath()
        this.selectionData.setTargetSelection(position, 'placement')
    }

    unlockPlacementSelection = () => {
        this.selectionData.unlockPath()
        this.selectionData.clearTarget()
    }

    setStartPlacement = () => {
        this.selectionData.clearAllSelections()
        this.pathfinder.setPlacementSet()
        this.unitData.createUnit(this.cardData.getSelectedCard().unitId)
        this.mapData.setState('placeUnit')
    }
    
    setEndPlacement = (position) => {
        this.selectionData.clearAllSelections()
        this.selectionData.setInfoSelection('unit', position)
        this.unitData.selectUnit(position)
        this.mapData.setState('chooseRotation')
    }

    setSelectedUnit = (pos) => {
        this.selectionData.setInfoSelection('unit', pos)
        this.unitData.selectUnit(pos)
        this.pathfinder.setMoveSet()
        this.pathfinder.setActionSet()
        this.pathfinder.setAttackSet()
        this.mapData.setState('selectMovement')
    }

    setStartAnimation = () => {
        this.selectionData.clearAllSelections()
        this.mapData.setState('animation')
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
        if (!tileClickedObj || !tileClickedObj.images || tileClickedObj.images.length === 0) return null

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
        if (this.unitData.getUnit(pos) !== null) {
            targetObject = this.unitData.getUnit(pos)
        } else {
            if (this.structureData.getStructure(pos) === null) return
            targetObject = this.structureData.getStructure(pos)
        }
        return targetObject
    }

}