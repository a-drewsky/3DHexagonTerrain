
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../utilities/collision';

import HexMapPathFinderClass from "./HexMapPathFinder"

import HexMapViewSpritesRendererClass from './HexMapViewSpritesRenderer';
import HexMapViewUtilsClass from './HexMapViewUtils';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas, images, settings) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas


        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera);

        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

        this.viewUtils = new HexMapViewUtilsClass(hexMapData, camera, settings)

        this.renderer = new HexMapViewSpritesRendererClass(hexMapData, camera, images, this.viewUtils, settings)

    }

    findMoveSet = () => {

        let unit = this.hexMapData.getSelectedUnit()

        if(unit == null) return

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

        if (!moveSet) return

        for (let tileObj of moveSet) {
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)
            
            this.hexMapData.selectionList.push({
                q: tile.position.q,
                r: tile.position.r,
                selection: 'movement'
            })
        }
    }

    lerp = (unit) => {

        if (unit == null) return

        let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)

        let targetPosition = this.hexMapData.getSelectedUnitTile()

        if (targetPosition == null) return

        unit.path = this.utils.findPath(startPosition, targetPosition).map(tileObj => tileObj.tile)

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

        //make setState function (todo)
        unit.state = 'walk'
        unit.frame = 0

        if (nextPosition.height != startPosition.height) {
            unit.state = 'jumpUp'
        }

    }

    addUnit = () => {

        let selectedTile = this.hexMapData.getSelected()

        if(selectedTile != null && this.getSelection(selectedTile.position.q, selectedTile.position.r) == 'info'){
            let unit = {
                position: {
                   q: selectedTile.position.q,
                   r: selectedTile.position.r
                },
                path: [],
                destination: null,
                destinationStartTime: null,
                destinationCurTime: null,
                name: 'Example Unit',
                type: 'units',
                sprite: 'exampleUnit',
                state: 'idle',
                frame: 0,
                frameStartTime: Date.now(),
                frameCurTime: Date.now(),
                rotation: 3,
                tileHeight: 3,
                movementRange: 5,
                renderImages: [],
                renderShadowImages: []
             }
             this.renderer.renderUnit(unit)
             this.hexMapData.unitList.push(unit)
        }

        this.utils.resetSelected()

    }

    mouseMove = (x, y) => {

        this.utils.resetHover()

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

        let hoverHex = {
            q: ((2 / 3 * x)) / this.hexMapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.hexMapData.squish))) / this.hexMapData.size
        }

        hoverHex = this.hexMapData.roundToNearestHex(hoverHex.q, hoverHex.r)


        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        let hoverTile = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hoverHex.q + testList[i].q,
                r: hoverHex.r + testList[i].r
            }

            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                hoverTile = testTile
            }

        }


        if (!hoverTile) return

        let rotatedTile = rotatedMap.get(hoverTile.q + ',' + hoverTile.r)

        hoverTile = {
            q: rotatedTile.q,
            r: rotatedTile.r
        }

        let tileObj = this.hexMapData.getEntry(hoverTile.q, hoverTile.r)

        if(this.getSelection(tileObj.position.q, tileObj.position.r) == null){
            this.setSelection(tileObj.position.q, tileObj.position.r, 'hover')
        }
    }

    getSelection = (q, r) => {
        let selected = this.hexMapData.selectionList.find(sel => sel.q == q && sel.r == r)
        if(!selected) return null
        return selected.selection
    }

    setSelection = (q, r, selection) => {
        this.hexMapData.selectionList.push({
            q: q,
            r: r,
            selection: selection
        })
    }

    click = (x, y) => {

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

        console.log(x, y)


        let hexClicked = {
            q: ((2 / 3 * x)) / this.hexMapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.hexMapData.squish))) / this.hexMapData.size
        }

        hexClicked = this.hexMapData.roundToNearestHex(hexClicked.q, hexClicked.r)


        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]



        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]


        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }


            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                tileClicked = testTile
            }

        }
        
        console.log(tileClicked)

        if (!tileClicked) return

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        tileClicked = {
            q: rotatedTile.q,
            r: rotatedTile.r
        }

        console.log(tileClicked)


        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

        let unit = this.hexMapData.getSelectedUnit()

        if (unit != null) {

            if (this.getSelection(tile.position.q, tile.position.r) == 'unit') return

            this.utils.resetSelected()

            let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

            console.log()

            if(moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)){
                this.setSelection(tile.position.q, tile.position.r, 'unit')
                this.lerp(unit)
            } else {
                let newUnit = this.hexMapData.getUnit(tile.position.q, tile.position.r)
                if(newUnit == null){
                    this.setSelection(tile.position.q, tile.position.r, 'info')
                    console.log("ACT")
                } 
                else {
                    this.setSelection(tile.position.q, tile.position.r, 'unit')
                    this.findMoveSet()
                }
            }

            return
        }

        this.utils.resetSelected()

        if (this.hexMapData.getUnit(tileClicked.q, tileClicked.r) != null){
            this.setSelection(tile.position.q, tile.position.r, 'unit')
            this.findMoveSet()
        } 
        else this.setSelection(tile.position.q, tile.position.r, 'info')
    }

    keyPress = (key) => {

    }

}