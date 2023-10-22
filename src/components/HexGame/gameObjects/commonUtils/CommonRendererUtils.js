import CommonHexMapUtilsClass from "./CommonHexMapUtils"

import { SHADOW_SIZE } from '../commonConstants/CommonConstants'

export default class CommonRendererUtilsClass {

    constructor(hexMapData) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.commonUtils = new CommonHexMapUtilsClass()
    }



    getShadowRow = (rowNum, tilePos) => {
        return { l: { q: tilePos.q + (-1 * rowNum), r: tilePos.r + (rowNum - 1) }, c: { q: tilePos.q + (-1 * rowNum), r: tilePos.r + (rowNum) }, r: { q: tilePos.q + (-1 * rowNum + 1), r: tilePos.r + (rowNum) } }
    }

    getShadowRows = (numRows, tilePos) => {

        let rows = {}

        for (let i = 1; i <= numRows; i++) {
            rows[i] = this.getShadowRow(i, tilePos)
        }

        return rows

    }

    getShadowRowHeightsDifference = (numRows, position, height) => {

        let rows = this.getShadowRows(numRows, position)

        let heightRows = {}

        for (let rowNum in rows) {
            let row = rows[rowNum]

            let l = -1
            if (this.tileData.hasTileEntry(row.l.q, row.l.r)) l = this.tileData.getEntry(row.l.q, row.l.r).height - height

            let c = -1
            if (this.tileData.hasTileEntry(row.c.q, row.c.r)) c = this.tileData.getEntry(row.c.q, row.c.r).height - height

            let r = -1
            if (this.tileData.hasTileEntry(row.r.q, row.r.r)) r = this.tileData.getEntry(row.r.q, row.r.r).height - height

            heightRows[rowNum] = { l: l, c: c, r: r }
        }

        return heightRows

    }

    getShadowDistance = (rowNum, tileHeight) => {
        return (tileHeight + 2) - 2 * rowNum
    }

    getSideShadowDistance = (rowNum, tileHeight) => {
        return (tileHeight + 3) - 2 * rowNum
    }

    darkenImage = (canvas) => {
        console.log("ACT")
        let tempctx = canvas.getContext('2d')

        tempctx.globalCompositeOperation = 'source-atop'
        tempctx.fillStyle = 'rgba(0,0,0,0.25)'

        tempctx.fillRect(0, 0, canvas.width, canvas.height)
        tempctx.globalCompositeOperation = 'source-over'
    }

    darkenSprite = (canvas, spriteObject, movementTile, extraHeight) => {

        let shadowDirection = { q: -1, r: 1 }

        let spriteTile
        if(movementTile !== undefined) spriteTile = this.tileData.getEntry(movementTile.q, movementTile.r)
        else spriteTile = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r)

        let spriteTileHeight = spriteTile.height

        let distance = 0

        let shadowHeight = 0

        while (shadowHeight < this.tileData.maxHeight) {

            shadowHeight = spriteTileHeight + spriteObject.height + 2 * distance

            if(extraHeight) shadowHeight += extraHeight

            let shadowTile = this.tileData.getEntry(spriteTile.position.q + shadowDirection.q + shadowDirection.q * distance, spriteTile.position.r + shadowDirection.r + shadowDirection.r * distance)

            if (shadowTile && shadowTile.height > shadowHeight) {

                this.darkenImage(canvas)
                return
            }

            distance += 1;

            shadowHeight += 1 / (SHADOW_SIZE / 2) * Math.sqrt(3);

        }
    }

    cropStructureShadow = (image, imageSize, imageOffset, keyObj, rotatedMap) => {

        if (!this.needsShadowCropIn(keyObj, rotatedMap) && !this.needsShadowCropOut(keyObj, rotatedMap)) return image

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)
        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)
        let tileHeight = tile.height
        let ogPos = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.cameraData.rotation)
        let newPos = this.tileData.hexPositionToXYPosition(tileObj, tileHeight, this.cameraData.rotation)

        let diff = {
            x: newPos.x - ogPos.x,
            y: newPos.y - ogPos.y
        }

        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.mapData.size * 2 * imageSize.w
        tempCanvas.height = this.mapData.size * 2 * imageSize.h
        let tempctx = tempCanvas.getContext('2d')

        let cropList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

        tempctx.beginPath();

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue
            if (!cropListTile.rendered) continue
            if (cropListTile.height == tileHeight) {

                let tilePos = {
                    x: this.mapData.size + this.mapData.size * 2 * imageOffset.x + diff.x,
                    y: (this.mapData.size * this.mapData.squish) + this.mapData.size * 2 * imageOffset.y + diff.y
                }

                tilePos.x += this.mapData.flatTopVecQ.x * cropList[i].q + this.mapData.flatTopVecR.x * cropList[i].r
                tilePos.y += this.mapData.flatTopVecQ.y * cropList[i].q * this.mapData.squish + this.mapData.flatTopVecR.y * cropList[i].r * this.mapData.squish

                this.clipFlatHexagonPath(
                    tempctx,
                    tilePos.x,
                    tilePos.y
                );
            }
        }

        tempctx.save();
        tempctx.clip();

        tempctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height)

        tempctx.restore();

        this.cropOutShadowTiles(tempCanvas, imageOffset, keyObj, rotatedMap)

        return tempCanvas
    }

    needsCropping = (keyObj, rotatedMap) => {

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)

            let distance = this.commonUtils.getDistance(tileRef, cropListTileRef)
            if (cropListTile.height - (distance - 1) * 2 > tileHeight) {
                return true
            }
        }

        return false
    }

    needsShadowCropIn = (keyObj, rotatedMap) => {

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let cropList = [{ q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) return true
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)

            if (cropListTile.height != tileHeight) {
                return true
            }
        }

        return false

    }

    needsShadowCropOut = (keyObj, rotatedMap) => {

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let cropList = [{ q: 0, r: -1 }, { q: -1, r: 0 }, { q: 1, r: -1 }, { q: -1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 2 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 3 }, { q: 1, r: 2 }, { q: 0, r: 3 }, { q: -1, r: 4 }, { q: 1, r: 3 }, { q: 0, r: 4 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)

            let distance = this.commonUtils.getDistance(tileRef, cropListTileRef)
            if (cropListTile.height - (distance - 1) * 2 > tileHeight) {
                return true
            }
        }

        return false

    }

    //create common function
    cropOutTiles = (canvas, imageOffset, keyObj, rotatedMap) => {

        if (!this.needsCropping(keyObj, rotatedMap)) return

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.cameraData.rotation)

        zeroPoint.x = (zeroPoint.x - this.mapData.size - imageOffset.x * this.mapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.mapData.size * this.mapData.squish) - imageOffset.y * this.mapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image
                let clipXOffset;
                let clipYOffset;

                clipXOffset = this.mapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.mapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                clipYOffset = this.mapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.mapData.squish + this.mapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.mapData.squish;


                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.cameraData.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.cameraData.rotation).y + clipYOffset - cropListTile.height * this.mapData.tileHeight,
                    height
                );


                //clear the canvas in that area

                tempctx.save();
                tempctx.clip();

                tempctx.clearRect(0, 0, canvas.width, canvas.height)

                tempctx.restore();
            }
        }
    }

    cropOutShadowTiles = (canvas, imageOffset, keyObj, rotatedMap) => {

        if (!this.needsShadowCropOut(keyObj, rotatedMap)) return

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getAnyEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.cameraData.rotation)

        zeroPoint.x = (zeroPoint.x - this.mapData.size - imageOffset.x * this.mapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.mapData.size * this.mapData.squish) - imageOffset.y * this.mapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: 0, r: -1 }, { q: -1, r: 0 }, { q: 1, r: -1 }, { q: -1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 2 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 3 }, { q: 1, r: 2 }, { q: 0, r: 3 }, { q: -1, r: 4 }, { q: 1, r: 3 }, { q: 0, r: 4 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image
                let clipXOffset;
                let clipYOffset;

                clipXOffset = this.mapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.mapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                clipYOffset = this.mapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.mapData.squish + this.mapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.mapData.squish;


                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.cameraData.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.cameraData.rotation).y + clipYOffset - cropListTile.height * this.mapData.tileHeight,
                    height
                );


                //clear the canvas in that area

                tempctx.save();
                tempctx.clip();

                tempctx.clearRect(0, 0, canvas.width, canvas.height)

                tempctx.restore();
            }
        }
    }

    cropOutTilesJump = (canvas, imageOffset, keyObj, rotatedMap, height) => {

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + (this.mapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
            ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileHeight = height
        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.cameraData.rotation)

        zeroPoint.x = (zeroPoint.x - this.mapData.size - imageOffset.x * this.mapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.mapData.size * this.mapData.squish) - imageOffset.y * this.mapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getAnyEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image (CREATE FUNCTION)
                let clipXOffset;
                let clipYOffset;

                clipXOffset = this.mapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.mapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                clipYOffset = this.mapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.mapData.squish + this.mapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.mapData.squish;


                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.cameraData.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.cameraData.rotation).y + clipYOffset - cropListTile.height * this.mapData.tileHeight,
                    height
                );


                //clear the canvas in that area
                tempctx.save();
                tempctx.clip();

                tempctx.clearRect(0, 0, canvas.width, canvas.height)

                tempctx.restore();
            }
        }
    }

    clipFlatHexagonPath = (ctx, x, y) => {
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
    }

    clipHexagonShadowPath = (ctx, x, y, shadowX, shadowY, rotation) => {

        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6 - this.mapData.sideLength * rotation - Math.PI / 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6 - this.mapData.sideLength * rotation - Math.PI / 6) * (this.mapData.size * this.mapData.squish));

    }

}