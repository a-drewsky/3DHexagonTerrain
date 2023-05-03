import CommonHexMapUtilsClass from "./CommonHexMapUtils"

import { SHADOW_SIZE } from '../commonConstants/CommonConstants'

export default class CommonRendererUtilsClass {

    constructor(hexMapData, tileData, camera, images) {

        this.hexMapData = hexMapData
        this.tileData = tileData
        this.camera = camera

        this.images = images

        this.commonUtils = new CommonHexMapUtilsClass()

        this.shadowPositions = {
            0: {
                distance: { q: -1, r: 2 },
                startingPoints: [{ q: -1, r: 2 }, { q: -1, r: 1 }, { q: 0, r: 1 }]
            },
            1: {
                distance: { q: -1, r: 1 },
                startingPoints: [{ q: -1, r: 1 }]
            },
            2: {
                distance: { q: -2, r: 1 },
                startingPoints: [{ q: -2, r: 1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]
            },
            3: {
                distance: { q: -1, r: 0 },
                startingPoints: [{ q: -1, r: 0 }]
            },
            4: {
                distance: { q: -1, r: -1 },
                startingPoints: [{ q: -1, r: -1 }, { q: -1, r: 0 }, { q: 0, r: -1 }]
            },
            5: {
                distance: { q: 0, r: -1 },
                startingPoints: [{ q: 0, r: -1 }]
            },
            6: {
                distance: { q: 1, r: -2 },
                startingPoints: [{ q: 1, r: -2 }, { q: 0, r: -1 }, { q: 1, r: -1 }]
            },
            7: {
                distance: { q: 1, r: -1 },
                startingPoints: [{ q: 1, r: -1 }]
            },
            8: {
                distance: { q: 2, r: -1 },
                startingPoints: [{ q: 2, r: -1 }, { q: 1, r: -1 }, { q: 1, r: 0 }]
            },
            9: {
                distance: { q: 1, r: 0 },
                startingPoints: [{ q: 1, r: 0 }]
            },
            10: {
                distance: { q: 1, r: 1 },
                startingPoints: [{ q: 1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }]
            },
            11: {
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
        let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.tileData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.tileData.getEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height + shadowHeight + 1 / (SHADOW_SIZE / 2) * Math.sqrt(3)) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.tileData.getEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getEntry(spriteObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, spriteObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height + shadowHeight) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.hexMapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (SHADOW_SIZE / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (SHADOW_SIZE / 2);
            }

        }
    }

    darkenSpriteJump = (canvas, unit, closestTile, height) => {
        let shadowHeight = unit.height + 1

        let distance = 0
        let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.tileData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.tileData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight + 1 / (SHADOW_SIZE / 2) * Math.sqrt(3)) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.tileData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.tileData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight) {

                        this.darkenImage(canvas)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.hexMapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (SHADOW_SIZE / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (SHADOW_SIZE / 2);
            }

        }
    }

    cropStructureShadow = (image, imageSize, imageOffset, keyObj, rotatedMap) => {
        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)
        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getEntry(tileRef.q, tileRef.r)
        let tileHeight = tile.height
        let ogPos = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)
        let newPos = this.tileData.hexPositionToXYPosition(tileObj, tileHeight, this.camera.rotation)

        let diff = {
            x: newPos.x - ogPos.x,
            y: newPos.y - ogPos.y
        }

        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.hexMapData.size * 2 * imageSize.width
        tempCanvas.height = this.hexMapData.size * 2 * imageSize.height
        let tempctx = tempCanvas.getContext('2d')

        let cropList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

        tempctx.beginPath();

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue
            if (!cropListTile.rendered) continue
            if (cropListTile.height == tileHeight) {

                let tilePos = {
                    x: this.hexMapData.size + this.hexMapData.size * 2 * imageOffset.x + diff.x,
                    y: (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.size * 2 * imageOffset.y + diff.y
                }

                if (this.camera.rotation % 2 == 1) {
                    tilePos.x += this.hexMapData.flatTopVecQ.x * cropList[i].q + this.hexMapData.flatTopVecR.x * cropList[i].r
                    tilePos.y += this.hexMapData.flatTopVecQ.y * cropList[i].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * cropList[i].r * this.hexMapData.squish

                    this.clipFlatHexagonPath(
                        tempctx,
                        tilePos.x,
                        tilePos.y
                    );
                } else {
                    tilePos.x += this.hexMapData.VecQ.x * cropList[i].q + this.hexMapData.VecR.x * cropList[i].r
                    tilePos.y += this.hexMapData.VecQ.y * cropList[i].q * this.hexMapData.squish + this.hexMapData.VecR.y * cropList[i].r * this.hexMapData.squish

                    this.clipPointyHexagonPath(
                        tempctx,
                        tilePos.x,
                        tilePos.y
                    );
                }
            }
        }

        tempctx.save();
        tempctx.clip();

        tempctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height)

        tempctx.restore();

        this.cropOutShadowTiles(tempCanvas, imageOffset, keyObj, rotatedMap)

        return tempCanvas
    }

    needsCropping = (imageOffset, keyObj, rotatedMap) => {

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                return true
            }
        }

        return false
    }

    //create common function
    cropOutTiles = (canvas, imageOffset, keyObj, rotatedMap) => {

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image
                let clipXOffset;
                let clipYOffset;

                if (this.camera.rotation % 2 == 1) {
                    clipXOffset = this.hexMapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                } else {
                    clipXOffset = this.hexMapData.VecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.VecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.VecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.VecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                }

                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.camera.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.camera.rotation).y + clipYOffset - cropListTile.height * this.hexMapData.tileHeight,
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

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.tileData.getEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: 0, r: -1 }, { q: -1, r: 0 }, { q: 1, r: -1 }, { q: -1, r: 1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 2 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 3 }, { q: 1, r: 2 }, { q: 0, r: 3 }, { q: -1, r: 4 }, { q: 1, r: 3 }, { q: 0, r: 4 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image
                let clipXOffset;
                let clipYOffset;

                if (this.camera.rotation % 2 == 1) {
                    clipXOffset = this.hexMapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                } else {
                    clipXOffset = this.hexMapData.VecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.VecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.VecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.VecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                }

                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.camera.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.camera.rotation).y + clipYOffset - cropListTile.height * this.hexMapData.tileHeight,
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
            ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        }

        let tileObj = this.commonUtils.roundToNearestHex(keyObj.q, keyObj.r)

        let tileHeight = height
        let zeroPoint

        zeroPoint = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1

        let tempctx = canvas.getContext('2d')

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if (!cropListTileRef) continue
            let cropListTile = this.tileData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if (!cropListTile) continue

            if (cropListTile.height > tileHeight) {
                //clip the hexagons in front of image (CREATE FUNCTION)
                let clipXOffset;
                let clipYOffset;

                if (this.camera.rotation % 2 == 1) {
                    clipXOffset = this.hexMapData.flatTopVecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.flatTopVecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.flatTopVecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                } else {
                    clipXOffset = this.hexMapData.VecQ.x * (tileObj.q + cropList[i].q) + this.hexMapData.VecR.x * (tileObj.r + cropList[i].r);
                    clipYOffset = this.hexMapData.VecQ.y * (tileObj.q + cropList[i].q) * this.hexMapData.squish + this.hexMapData.VecR.y * (tileObj.r + cropList[i].r) * this.hexMapData.squish;
                }

                let height = cropListTile.height - tileHeight

                tempctx.beginPath();

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.tileData.posMap.get(this.camera.rotation).x + clipXOffset,
                    zeroPoint.y + this.tileData.posMap.get(this.camera.rotation).y + clipYOffset - cropListTile.height * this.hexMapData.tileHeight,
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

        if (object.health == 100) return

        let tempctx = canvas.getContext('2d')

        let healthBarIndex = 10 - Math.floor(object.health / 10)

        let healthBarSprite = this.images.ui.healthbar

        let healthbarSpriteSize = {
            width: this.hexMapData.size * 2 * healthBarSprite.spriteSize.width,
            height: this.hexMapData.size * 2 * healthBarSprite.spriteSize.height
        }

        let healthbarPos = {
            x: canvas.width / 2 - healthbarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(healthBarSprite.images[healthBarIndex], healthbarPos.x, healthbarPos.y, healthbarSpriteSize.width, healthbarSpriteSize.height)

    }

    addResourceBar = (canvas, object) => {

        if (object.resources == 100) return canvas

        let tempctx = canvas.getContext('2d')

        let resourceBarIndex = 10 - Math.floor(object.resources / 10)

        let resourceBarSprite = this.images.ui.resourcebar

        let resourcebarSpriteSize = {
            width: this.hexMapData.size * 2 * resourceBarSprite.spriteSize.width,
            height: this.hexMapData.size * 2 * resourceBarSprite.spriteSize.height
        }

        let resourcebarPos = {
            x: canvas.width / 2 - resourcebarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(resourceBarSprite.images[resourceBarIndex], resourcebarPos.x, resourcebarPos.y, resourcebarSpriteSize.width, resourcebarSpriteSize.height)

    }

    clipPointyHexagonPath = (ctx, x, y) => {
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));
    }

    clipFlatHexagonPath = (ctx, x, y) => {
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
    }

    clipHexagonShadowPath = (ctx, x, y, shadowX, shadowY, rotation, orientation) => {

        if (orientation == 'pointy') {
            if (rotation % 2 == 0) {
                ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * rotation) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * rotation) * (this.hexMapData.size * this.hexMapData.squish));
            } else {
                ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * (rotation - 1)) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * (rotation - 1)) * (this.hexMapData.size * this.hexMapData.squish));
            }
        } else {
            if (rotation % 2 == 0) {
                ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * rotation - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            } else {
                ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(shadowX + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, shadowY + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
                ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2 * (rotation - 1) - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            }
        }

    }

    drawFlatHexagon = (ctx, x, y, fillColor, lineColor, tileGroup) => {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        if (fillColor) ctx.fill();
        if (lineColor) ctx.stroke();

        if (this.debug) {
            ctx.font = '10px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(tileGroup, x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size + 12, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) - 18)
        }
    }

    drawPointyHexagon = (ctx, x, y, fillColor, lineColor, tileGroup) => {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 6) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 6) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.fill();
        if (lineColor) ctx.stroke();
        if (lineColor) ctx.stroke();

        if (this.debug) {
            ctx.font = '10px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(tileGroup, x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size + 12, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) - 18)
        }
    }

    drawFlatHexagonWall = (ctx, x, y, leftFillColor, leftLineColor, centerFillColor, centerLineColor, rightFillColor, rightLineColor) => {

        //draw left side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

        ctx.fillStyle = leftFillColor;
        ctx.strokeStyle = leftLineColor;
        ctx.fill();
        ctx.stroke();

        //draw center side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

        ctx.fillStyle = centerFillColor;
        ctx.strokeStyle = centerLineColor;
        ctx.fill();
        ctx.stroke();

        //draw right side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

        ctx.fillStyle = rightFillColor;
        ctx.strokeStyle = rightLineColor;
        ctx.fill();
        ctx.stroke();

    }

    drawPointyHexagonWall = (ctx, x, y, leftFillColor, leftLineColor, rightFillColor, rightLineColor) => {

        //draw left side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

        ctx.fillStyle = leftFillColor;
        ctx.strokeStyle = leftLineColor;
        ctx.fill();
        ctx.stroke();

        //draw right side
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish) + this.hexMapData.tileHeight);
        ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 1) * (this.hexMapData.size * this.hexMapData.squish));
        ctx.lineTo(x + Math.sin(0) * this.hexMapData.size, y + Math.cos(0) * (this.hexMapData.size * this.hexMapData.squish));

        ctx.fillStyle = rightFillColor;
        ctx.strokeStyle = rightLineColor;
        ctx.fill();
        ctx.stroke();

    }

}