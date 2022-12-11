
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../utilities/collision';

import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas


        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera);

        this.collision = new CollisionClass();
        
        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

    }

    

    findPath = () => {

        let targetTile = this.hexMapData.getSelected()

        if(targetTile == null) return
        
        let target = targetTile.originalPos
        let start = {
            q: -7,
            r: 28
        }

        let path = this.pathFinder.findPath(start, target)

        if(!path) return

        for(let tileObj of path){
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)
            tile.selected = true
            tile.test = tileObj.moveCost + ' : ' + tileObj.estimateCost
            this.hexMapData.setEntry(tileObj.tile.q, tileObj.tile.r, tile)
        }

    }

    findMoveSet = () => {
        let moveAmount = 3
        let start = {
            q: -7,
            r: 28
        }

        let moveSet = this.pathFinder.findMoveSet(start, moveAmount)

        if(!moveSet) return

        for(let tileObj of moveSet){
            let tile = this.hexMapData.getEntry(tileObj.tile.q, tileObj.tile.r)
            tile.selected = true
            tile.test = tileObj.moveCost
            this.hexMapData.setEntry(tileObj.tile.q, tileObj.tile.r, tile)
        }
    }

    lerp = () => {

        let unit = this.hexMapData.unitList[0]

        if(unit == null) return

        let targetPosition = this.hexMapData.getSelected()

        if(targetPosition == null) return

        unit.destination = targetPosition.originalPos

        unit.destinationStartTime = Date.now()
        unit.destinationCurTime = 0

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


        let rotatedMap = this.utils.rotateMap()



        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]


        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }

            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, rotatedMap.get(testTile.q + ',' + testTile.r).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                tileClicked = testTile
            }

        }


        //reset selected
        for (let [key, value] of this.hexMapData.getMap()) {
            if (value.selected == true) {
                let keyObj = this.hexMapData.split(key)
                value.selected = false
                this.hexMapData.setEntry(keyObj.q, keyObj.r, value)
            }
        }


        if(!tileClicked) return

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        tileClicked = {
            q: rotatedTile.originalPos.q,
            r: rotatedTile.originalPos.r
        }

        console.log(tileClicked)


        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)
        tile.selected = true
        this.hexMapData.setEntry(tileClicked.q, tileClicked.r, tile)
    }

    keyPress = (key) => {

    }

}