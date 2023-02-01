
import HexMapPathFinderClass from "../utils/HexMapPathFinder"
import CollisionClass from "../../../utilities/collision"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, camera, canvas, images, uiComponents, updateUi, renderer) {
        this.hexMapData = hexMapData
        this.camera = camera
        this.canvas = canvas
        this.images = images

        this.uiComponents = uiComponents

        this.updateUi = updateUi

        this.renderer = renderer

        this.pathFinder = new HexMapPathFinderClass(hexMapData, camera)

        this.collision = new CollisionClass();
    }

    getSelectionArr = () => {
        let selectionList = Object.entries(this.hexMapData.selections)

        let filteredSelectionList = []

        for(let sel of selectionList){
            if(sel[1] == null) continue
            if(Array.isArray(sel[1])){
                for(let arrSel of sel[1]){
                    filteredSelectionList.push({position: arrSel, selection: sel[0]})
                }
                continue
            }

            filteredSelectionList.push({position: sel[1], selection: sel[0]})

        }
        return filteredSelectionList
    }

    getSelectionObj = (q, r) => {
        let selectionArr = this.getSelectionArr()

        let selected = selectionArr.find(sel => sel.position.q == q && sel.position.r == r)
        if (!selected) return null
        return {
            position: {q: selected.position.q, r: selected.position.r},
            selection: selected.selection
        }
    }

    getSelection = (q, r) => {
        let selected = this.getSelectionObj(q, r)
        if(selected == null) return null
        return selected.selection
    }

    setSelection = (q, r, selection) => {
        if(selection == 'movement'){
            this.hexMapData.selections[selection].push({q: q, r: r})
        } else {
            this.hexMapData.selections[selection] = {q: q, r: r}
        }
    }

    removeSelection = (q, r) => {
        let selected = this.getSelectionObj(q, r)

        if(selected == null) return
        if(selected.selection == 'movement') this.hexMapData.selections['movement'] = []
        else this.hexMapData.selections[selected.selection] = null
    }

    resetSelected = () => {
        this.hexMapData.selections = {
            action: null,
            attack: null,
            info: null,
            path: null,
            unit: null,
            target: null,
            movement: [],
            hover_select: null,
            hover_place: null,
   
         }
    }

    resetHover = () => {
        this.hexMapData.selections['hover_select'] = null
        this.hexMapData.selections['hover_place'] = null
    }

    clearContextMenu = () => {
        this.uiComponents.contextMenu.show = false
        this.uiComponents.contextMenu.x = null
        this.uiComponents.contextMenu.y = null
        this.uiComponents.contextMenu.buttonList = []

        this.updateUi()
    }

    setContextMenu = (x, y, buttonList) => {
        this.uiComponents.contextMenu.show = true
        this.uiComponents.contextMenu.x = x
        this.uiComponents.contextMenu.y = y
        this.uiComponents.contextMenu.buttonList = buttonList

        this.updateUi()
    }

    setResourceBar = (resourceNum) => {
        this.uiComponents.resourceBar.resourceNum = resourceNum
        this.updateUi()
    }

    findPath = (startTile, targetTile) => {

        if(targetTile == null || startTile == null) return
        
        let target = targetTile.position
        let start = startTile.position

        let path = this.pathFinder.findPath(start, target)

        if(!path) return null

        return path
    }

    findClosestAdjacentPath = (startTile, targetTile) => {
        if(targetTile == null || startTile == null) return
        
        let target = targetTile.position
        let start = startTile.position

        let neighbors = this.hexMapData.getNeighborKeys(target.q, target.r)

        let path = this.pathFinder.findClosestPath(start, target, neighbors)

        if(!path) return null

        return path
    }

    hexPositionToXYPosition = (keyObj, tileHeight) => {
        let xOffset;
        let yOffset;

        if (this.camera.rotation % 2 == 1) {
            xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
            yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
        } else {
            xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
            yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
        }

        return {
            x: this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
            y: this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - tileHeight * this.hexMapData.tileHeight
        }

    }
    

    findMoveSet = () => {

        let unit = this.hexMapData.getSelectedUnit()

        if (unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

        let moveSetPlus1 = this.pathFinder.findFullMoveSet(unit.position, unit.movementRange+1)

        if (!moveSet) return

        for (let tileObj of moveSet) {
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)

            this.setSelection(tile.position.q, tile.position.r, 'movement')
        }

        //search for mines
        for(let tileObj of moveSetPlus1){
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)
            if(this.hexMapData.getTerrain(tile.position.q, tile.position.r) !== null && this.hexMapData.getTerrain(tile.position.q, tile.position.r).tag == 'mine'){
                this.setSelection(tile.position.q, tile.position.r, 'action')
            }
        }
    }

    updateTerrain = (q, r, terrain) => {
        this.renderer.renderSingleImageModifier(terrain)
        let terrainIndex = this.hexMapData.getTerrainIndex(q, r)
        this.hexMapData.terrainList[terrainIndex] = terrain
    }

    lerpUnit = (unit) => {

        if (unit == null) return

        let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)

        let targetPosition = this.hexMapData.getSelectedTargetTile()

        if (targetPosition == null) return

        console.log(startPosition, targetPosition)

        unit.path = this.findPath(startPosition, targetPosition).map(tileObj => tileObj.tile)

        let nextPosition = this.hexMapData.getEntry(unit.path[0].q, unit.path[0].r)

        unit.destination = unit.path[0]

        unit.destinationStartTime = Date.now()
        unit.destinationCurTime = Date.now()

        //set rotation
        let direction = {
            q: unit.destination.q - unit.position.q,
            r: unit.destination.r - unit.position.r
        }

        let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]

        unit.rotation = directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)

        unit.state = 'walk'
        unit.frame = 0

        if (nextPosition.height != startPosition.height) {
            unit.state = 'jumpUp'
        }

    }

    lerpToTarget = (unit, target) => {

        if (unit == null) return

        let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)

        unit.path = this.findClosestAdjacentPath(startPosition, target).map(tileObj => tileObj.tile)

        let nextPosition = this.hexMapData.getEntry(unit.path[0].q, unit.path[0].r)

        unit.destination = unit.path[0]

        unit.destinationStartTime = Date.now()
        unit.destinationCurTime = Date.now()

        //set rotation
        let direction = {
            q: unit.destination.q - unit.position.q,
            r: unit.destination.r - unit.position.r
        }

        let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]

        unit.rotation = directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)

        unit.state = 'walk'
        unit.frame = 0

        if (nextPosition.height != startPosition.height) {
            unit.state = 'jumpUp'
        }
    }

    mineOre = (unit, targetTile) => {

        unit.animationStartTime = Date.now()
        unit.animationCurTime = Date.now()

        //set rotation
        let direction = {
            q: targetTile.position.q - unit.position.q,
            r: targetTile.position.r - unit.position.r
        }

        let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]

        unit.rotation = directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)

        unit.state = 'mine'
        unit.frame = 0

        console.log(unit.state)
    }

    getSelectedTile = (x,y, rotatedMap) => {
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

        hexClicked = this.hexMapData.roundToNearestHex(hexClicked.q, hexClicked.r)



        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]


        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }


            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.hexPositionToXYPosition(testTile, this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                tileClicked = testTile
                continue
            }

            let tileTerrain = this.hexMapData.getTerrain(testTile.q, testTile.r)
            let tileUnit = this.hexMapData.getUnit(testTile.q, testTile.r)

            if (tileTerrain && tileTerrain.type == 'structures') {
                
                let spriteObj = this.images[tileTerrain.type][tileTerrain.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }

            }

            if(tileUnit && tileUnit.state == 'idle'){
                let spriteObj = this.images[tileUnit.type][tileUnit.sprite]

                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }
            }

        }

        return tileClicked

    }

    getCenterHexPos = () => {

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom
        
        let size = this.hexMapData.size;
        let squish = this.hexMapData.squish;

        let zoom = zoomLevel * zoomAmount

        let centerPos = {
            x: this.camera.position.x + zoom/2 + this.canvas.width / 2 - this.hexMapData.posMap.get(this.camera.rotation).x,
            y: this.camera.position.y + zoom/2 * (this.canvas.height/this.canvas.width) + this.canvas.height / 2 - this.hexMapData.posMap.get(this.camera.rotation).y
        }


        let centerHexPos;


        if (this.camera.rotation % 2 == 0) {
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