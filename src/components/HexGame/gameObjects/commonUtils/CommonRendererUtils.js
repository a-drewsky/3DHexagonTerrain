import CommonHexMapUtilsClass from "./CommonHexMapUtils"

import { SHADOW_SIZE } from '../commonConstants/CommonConstants'

export default class CommonRendererUtilsClass {

    constructor(hexMapData, images) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.images = images

        this.commonUtils = new CommonHexMapUtilsClass()

        this.shadowPositions = {
            0: {
                distance: { q: -1, r: 1 },
                startingPoints: [{ q: -1, r: 1 }]
            },
            1: {
                distance: { q: -1, r: 0 },
                startingPoints: [{ q: -1, r: 0 }]
            },
            2: {
                distance: { q: 0, r: -1 },
                startingPoints: [{ q: 0, r: -1 }]
            },
            3: {
                distance: { q: 1, r: -1 },
                startingPoints: [{ q: 1, r: -1 }]
            },
            4: {
                distance: { q: 1, r: 0 },
                startingPoints: [{ q: 1, r: 0 }]
            },
            5: {
                distance: { q: 0, r: 1 },
                startingPoints: [{ q: 0, r: 1 }]
            }
        }

    }

    darkenImage = (canvas) => {
        let tempctx = canvas.getContext('2d')

        tempctx.globalCompositeOperation = 'source-atop'
        tempctx.fillStyle = 'rgba(0,0,0,0.25)'

        tempctx.fillRect(0, 0, canvas.width, canvas.height)
        tempctx.globalCompositeOperation = 'source-over'
    }

    darkenSprite = (canvas, spriteObject) => {


        let shadowHeight = spriteObject.height + 1

        let distance = 0
        let shadowPosition = this.shadowPositions[this.mapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.tileData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.mapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.tileData.getAnyEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getAnyEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.tileData.getAnyEntry(spriteObject.position.q, spriteObject.position.r).height + shadowHeight + 1 / (SHADOW_SIZE / 2) * Math.sqrt(3)) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.tileData.getAnyEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getAnyEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.tileData.getAnyEntry(spriteObject.position.q, spriteObject.position.r).height + shadowHeight) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.mapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (SHADOW_SIZE / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (SHADOW_SIZE / 2);
            }

        }
    }

    darkenSpriteJump = (canvas, unit, closestTile, height) => {
        let shadowHeight = unit.height + 1

        let distance = 0
        let shadowPosition = this.shadowPositions[this.mapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.tileData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.mapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.tileData.getAnyEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getAnyEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight + 1 / (SHADOW_SIZE / 2) * Math.sqrt(3)) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.tileData.getAnyEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getAnyEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.mapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (SHADOW_SIZE / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (SHADOW_SIZE / 2);
            }

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
        tempCanvas.width = this.mapData.size * 2 * imageSize.width
        tempCanvas.height = this.mapData.size * 2 * imageSize.height
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

    addHealthBar = (canvas, object) => {
        if (object.stats.health == 100) return

        let tempctx = canvas.getContext('2d')

        let healthBarIndex = 10 - Math.floor(object.stats.health / 10)

        let healthBarSprite = this.images.ui.healthbar

        let healthbarSpriteSize = {
            width: this.mapData.size * 2 * healthBarSprite.spriteSize.width,
            height: this.mapData.size * 2 * healthBarSprite.spriteSize.height
        }

        let healthbarPos = {
            x: canvas.width / 2 - healthbarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(healthBarSprite.images[healthBarIndex], healthbarPos.x, healthbarPos.y, healthbarSpriteSize.width, healthbarSpriteSize.height)

    }

    addResourceBar = (canvas, object) => {

        if (object.stats.resources == object.stats.maxResources) return canvas

        let tempctx = canvas.getContext('2d')

        let resourceBarIndex = 10 - Math.floor(object.stats.resources / object.stats.maxResources * 10)

        let resourceBarSprite = this.images.ui.resourcebar

        let resourcebarSpriteSize = {
            width: this.mapData.size * 2 * resourceBarSprite.spriteSize.width,
            height: this.mapData.size * 2 * resourceBarSprite.spriteSize.height
        }

        let resourcebarPos = {
            x: canvas.width / 2 - resourcebarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(resourceBarSprite.images[resourceBarIndex], resourcebarPos.x, resourcebarPos.y, resourcebarSpriteSize.width, resourcebarSpriteSize.height)

    }

    clipPointyHexagonPath = (ctx, x, y) => {
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6) * (this.mapData.size * this.mapData.squish));
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

    clipHexagonShadowPath = (ctx, x, y, shadowX, shadowY, rotation, orientation) => {

        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(shadowX + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, shadowY + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6 - this.mapData.sideLength * rotation - Math.PI/6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6 - this.mapData.sideLength * rotation - Math.PI/6) * (this.mapData.size * this.mapData.squish));



    }

    drawFlatHexagon = (ctx, x, y, fillColor, lineColor, tileGroup) => {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        if (fillColor) ctx.fill();
        if (lineColor) ctx.stroke();

        if (this.debug) {
            ctx.font = '10px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(tileGroup, x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size + 12, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) - 18)
        }
    }

    drawPointyHexagon = (ctx, x, y, fillColor, lineColor, tileGroup) => {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 3) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 3) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 4) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 4) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 6) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 6) * (this.mapData.size * this.mapData.squish));
        ctx.fill();
        if (lineColor) ctx.stroke();
        if (lineColor) ctx.stroke();

        if (this.debug) {
            ctx.font = '10px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(tileGroup, x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size + 12, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) - 18)
        }
    }

    drawFlatHexagonWall = (ctx, x, y, leftFillColor, leftLineColor, centerFillColor, centerLineColor, rightFillColor, rightLineColor) => {

        //draw left side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

        ctx.fillStyle = leftFillColor;
        ctx.strokeStyle = leftLineColor;
        ctx.fill();
        ctx.stroke();

        //draw center side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 0 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

        ctx.fillStyle = centerFillColor;
        ctx.strokeStyle = centerLineColor;
        ctx.fill();
        ctx.stroke();

        //draw right side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 2 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1 - this.mapData.sideLength / 2) * (this.mapData.size * this.mapData.squish));

        ctx.fillStyle = rightFillColor;
        ctx.strokeStyle = rightLineColor;
        ctx.fill();
        ctx.stroke();

    }

    drawPointyHexagonWall = (ctx, x, y, leftFillColor, leftLineColor, rightFillColor, rightLineColor) => {

        //draw left side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 5) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 5) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish));

        ctx.fillStyle = leftFillColor;
        ctx.strokeStyle = leftLineColor;
        ctx.fill();
        ctx.stroke();

        //draw right side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1) * (this.mapData.size * this.mapData.squish) + this.mapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.mapData.sideLength * 1) * this.mapData.size, y + Math.cos(this.mapData.sideLength * 1) * (this.mapData.size * this.mapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.mapData.size, y + Math.cos(0) * (this.mapData.size * this.mapData.squish));

        ctx.fillStyle = rightFillColor;
        ctx.strokeStyle = rightLineColor;
        ctx.fill();
        ctx.stroke();

    }

}