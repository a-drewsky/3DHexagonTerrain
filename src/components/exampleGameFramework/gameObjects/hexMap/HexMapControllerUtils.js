
import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, camera) {
        this.hexMapData = hexMapData
        this.camera = camera

        this.pathFinder = new HexMapPathFinderClass(hexMapData, camera)
    }

    getSelection = (q, r) => {
        let selected = this.hexMapData.selectionList.find(sel => sel.q == q && sel.r == r)
        if (!selected) return null
        return selected.selection
    }

    setSelection = (q, r, selection) => {
        this.hexMapData.selectionList.push({
            q: q,
            r: r,
            selection: selection
        })
    }

    resetSelected = () => {
        this.hexMapData.selectionList = []
    }

    resetHover = () => {
        for(let i=0; i< this.hexMapData.selectionList.length; i++){
            if(this.hexMapData.selectionList[i].selection == 'hover') this.hexMapData.selectionList.splice(i, 1)
        }
    }

    findPath = (startTile, targetTile) => {

        if(targetTile == null || startTile == null) return
        
        let target = targetTile.position
        let start = startTile.position

        let path = this.pathFinder.findPath(start, target)

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

    lerpUnit = (unit) => {

        if (unit == null) return

        let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)

        let targetPosition = this.hexMapData.getSelectedUnitTile()

        if (targetPosition == null) return

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

        //make setState function (todo)
        unit.state = 'walk'
        unit.frame = 0

        if (nextPosition.height != startPosition.height) {
            unit.state = 'jumpUp'
        }

    }

}