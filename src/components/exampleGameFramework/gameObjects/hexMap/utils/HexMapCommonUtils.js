export default class HexMapCommonUtilsClass {

    constructor(hexMapData, camera) {

        this.hexMapData = hexMapData
        this.camera = camera

    }

    //round floating hex coords to nearest integer hex coords
    roundToNearestHex = (q, r) => {
        let fracQ = q;
        let fracR = r;
        let fracS = -1 * q - r

        let roundQ = Math.round(fracQ);
        let roundR = Math.round(fracR);
        let roundS = Math.round(fracS);

        let diffQ = Math.abs(roundQ - fracQ);
        let diffR = Math.abs(roundR - fracR);
        let diffS = Math.abs(roundS - fracS);

        if (diffQ > diffR && diffQ > diffS) {
            roundQ = -1 * roundR - roundS
        } else if (diffR > diffS) {
            roundR = -1 * roundQ - roundS
        } else {
            roundS = -1 * roundQ - roundR
        }

        return {
            q: roundQ,
            r: roundR
        }

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

    onScreenCheck = (spritePos, spriteSize, canvasDims) => {

        let zoom = this.camera.zoomAmount * this.camera.zoom

        let position = this.camera.position

        //check if sprite is on screen
        if (spritePos.x < position.x - spriteSize.width
            || spritePos.y < position.y - spriteSize.height
            || spritePos.x > position.x + canvasDims.width + zoom
            || spritePos.y > position.y + canvasDims.height + zoom * (canvasDims.height / canvasDims.width)) return false;

        return true
    }

    checkImagesLoaded = (spriteObject) => {
        if (!spriteObject.images || spriteObject.images.length == 0) return false
        return true
    }

}