
import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapControllerUtilsClass {

    constructor(hexMapData, camera) {
        this.hexMapData = hexMapData
        this.camera = camera

        this.pathFinder = new HexMapPathFinderClass(hexMapData, camera)
    }

    rotateTile = (q, r, rotation) => {


        let s = -q - r;
        let angle = rotation * 15;
        if (rotation % 2 == 1) angle -= 15;

        let newQ = q;
        let newR = r;
        let newS = s;

        for (let i = 0; i < angle; i += 30) {
            q = -newR;
            r = -newS;
            s = -newQ;

            newQ = q;
            newR = r;
            newS = s;
        }

        return {
            q: newQ,
            r: newR
        }

    }

    resetSelected = () => {
        for (let [key, value] of this.hexMapData.getMap()) {
            if (value.selected != null) {
                let keyObj = this.hexMapData.split(key)
                value.selected = null
            }
        }
    }

    findPath = (startTile, targetTile) => {

        if(targetTile == null || startTile == null) return
        
        let target = targetTile.originalPos
        let start = startTile.originalPos

        let path = this.pathFinder.findPath(start, target)

        if(!path) return null

        return path
    }

    rotateMap = () => {
        //Rotate the hexmap and set the rotatedMap object
        let sortedArr = this.hexMapData.getKeys();

        for (let i = 0; i < sortedArr.length; i++) {
            sortedArr[i] = {
                value: this.hexMapData.getEntry(sortedArr[i].q, sortedArr[i].r),
                position: this.rotateTile(sortedArr[i].q, sortedArr[i].r, this.camera.rotation)
            };
        }

        sortedArr.sort((a, b) => { return a.position.r - b.position.r || a.position.q - b.position.q });

        let rotatedMap = new Map();

        for (let i = 0; i < sortedArr.length; i++) {
            rotatedMap.set(this.hexMapData.join(sortedArr[i].position.q, sortedArr[i].position.r), sortedArr[i].value);
        }

        return rotatedMap
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