
import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, camera) {
        this.hexMapData = hexMapData
        this.camera = camera

        this.pathFinder = new HexMapPathFinderClass(hexMapData, camera)
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

}