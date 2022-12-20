export default class HexMapViewUtilsClass {

    constructor(hexMapData, camera, settings) {

        this.hexMapData = hexMapData
        this.camera = camera

        this.shadowSize = settings.SHADOW_SIZE

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

    getTablePosition = () => {

        let keys = this.hexMapData.getKeys();

        let minR = Math.min(...keys.map(key => key.r));
        let maxR = Math.max(...keys.map(key => key.r));
        let minRminQ = Math.min(...keys.filter(key => key.r == minR).map(key => key.q));
        let minRmaxQ = Math.max(...keys.filter(key => key.r == minR).map(key => key.q));
        let maxRminQ = Math.min(...keys.filter(key => key.r == maxR).map(key => key.q));
        let maxRmaxQ = Math.max(...keys.filter(key => key.r == maxR).map(key => key.q));

        let tableDims = {
            q1: this.rotateTile(minRminQ - 1, minR - 2, this.camera.rotation).q,
            r1: this.rotateTile(minRminQ - 1, minR - 2, this.camera.rotation).r,

            q2: this.rotateTile(minRmaxQ + 3, minR - 2, this.camera.rotation).q,
            r2: this.rotateTile(minRmaxQ + 3, minR - 2, this.camera.rotation).r,

            q3: this.rotateTile(maxRmaxQ + 1, maxR + 2, this.camera.rotation).q,
            r3: this.rotateTile(maxRmaxQ + 1, maxR + 2, this.camera.rotation).r,

            q4: this.rotateTile(maxRminQ - 3, maxR + 2, this.camera.rotation).q,
            r4: this.rotateTile(maxRminQ - 3, maxR + 2, this.camera.rotation).r
        }

        let hexVecQ = this.camera.rotation % 2 == 0 ? { ...this.hexMapData.VecQ } : { ...this.hexMapData.flatTopVecQ }
        let hexVecR = this.camera.rotation % 2 == 0 ? { ...this.hexMapData.VecR } : { ...this.hexMapData.flatTopVecR }

        let tablePosition = [
            {
                x: this.hexMapData.posMap.get(this.camera.rotation).x + hexVecQ.x * tableDims.q1 + hexVecR.x * tableDims.r1,
                y: this.hexMapData.posMap.get(this.camera.rotation).y + hexVecQ.y * tableDims.q1 * this.hexMapData.squish + hexVecR.y * tableDims.r1 * this.hexMapData.squish
            },

            {
                x: this.hexMapData.posMap.get(this.camera.rotation).x + hexVecQ.x * tableDims.q2 + hexVecR.x * tableDims.r2,
                y: this.hexMapData.posMap.get(this.camera.rotation).y + hexVecQ.y * tableDims.q2 * this.hexMapData.squish + hexVecR.y * tableDims.r2 * this.hexMapData.squish
            },

            {
                x: this.hexMapData.posMap.get(this.camera.rotation).x + hexVecQ.x * tableDims.q3 + hexVecR.x * tableDims.r3,
                y: this.hexMapData.posMap.get(this.camera.rotation).y + hexVecQ.y * tableDims.q3 * this.hexMapData.squish + hexVecR.y * tableDims.r3 * this.hexMapData.squish
            },

            {
                x: this.hexMapData.posMap.get(this.camera.rotation).x + hexVecQ.x * tableDims.q4 + hexVecR.x * tableDims.r4,
                y: this.hexMapData.posMap.get(this.camera.rotation).y + hexVecQ.y * tableDims.q4 * this.hexMapData.squish + hexVecR.y * tableDims.r4 * this.hexMapData.squish
            }
        ]

        return [...tablePosition];
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

    darkenImage = (image) => {
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = image.width
        tempCanvas.height = image.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(image, 0, 0, image.width, image.height)

        tempctx.globalCompositeOperation = 'source-atop'
        tempctx.fillStyle = 'rgba(0,0,0,0.25)'

        tempctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        tempctx.globalCompositeOperation = 'source-over'

        return tempCanvas
    }

    //move to utils
    darkenSprite = (croppedImage, terrainObject) => {

        let shadowHeight = terrainObject.tileHeight + 1

        let distance = 0
        let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.hexMapData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3)) {

                        croppedImage = this.darkenImage(croppedImage)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.hexMapData.getEntry(terrainObject.position.q + startingPoint.q + shadowPosition.distance.q * distance, terrainObject.position.r + startingPoint.r + shadowPosition.distance.r * distance).height > this.hexMapData.getEntry(terrainObject.position.q, terrainObject.position.r).height + shadowHeight) {

                        croppedImage = this.darkenImage(croppedImage)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.hexMapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (this.shadowSize / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (this.shadowSize / 2);
            }

        }

        return croppedImage;
    }

    darkenSpriteJump = (croppedImage, terrainObject, closestTile, height) => {
        let shadowHeight = terrainObject.tileHeight + 1

        let distance = 0
        let shadowPosition = this.shadowPositions[this.hexMapData.shadowRotation]

        let cropped = false;
        while (shadowHeight < this.hexMapData.maxHeight && cropped == false) {


            for (let i = 0; i < shadowPosition.startingPoints.length; i++) {
                let startingPoint = shadowPosition.startingPoints[i]

                if (this.hexMapData.shadowRotation % 2 == 0 && i == 0) {
                    if (this.hexMapData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.hexMapData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight + 1 / (this.shadowSize / 2) * Math.sqrt(3)) {

                        croppedImage = this.darkenImage(croppedImage)
                        cropped = true
                        break;
                    }
                } else {
                    if (this.hexMapData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance)
                        && this.hexMapData.getEntry(closestTile.q + startingPoint.q + shadowPosition.distance.q * distance, closestTile.r + startingPoint.r + shadowPosition.distance.r * distance).height > height + shadowHeight) {

                        croppedImage = this.darkenImage(croppedImage)
                        cropped = true
                        break;
                    }
                }


            }

            distance += 1;

            if (this.hexMapData.shadowRotation % 2 == 0) {
                shadowHeight += 1 / (this.shadowSize / 2) * Math.sqrt(3);
            } else {
                shadowHeight += 1 / (this.shadowSize / 2);
            }

        }

        return croppedImage;
    }

    cropStructureShadow = (image, imageSize, imageOffset, keyObj, rotatedMap, test) => {
        let tileObj = this.hexMapData.roundToNearestHex(keyObj.q, keyObj.r)
        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.hexMapData.getEntry(tileRef.q, tileRef.r)
        let tileHeight = tile.height
        let ogPos = this.hexPositionToXYPosition(keyObj, tileHeight)
        let newPos = this.hexPositionToXYPosition(tileObj, tileHeight)

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
            if(!cropListTileRef) continue
            let cropListTile = this.hexMapData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if(!cropListTile) continue
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

        tempCanvas = this.cropOutTiles(tempCanvas, imageSize, imageOffset, keyObj, rotatedMap)

        return tempCanvas
    }

    cropOutTiles = (image, imageSize, imageOffset, keyObj, rotatedMap) => {

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        }

        let tileObj = this.hexMapData.roundToNearestHex(keyObj.q, keyObj.r)

        let tileRef = rotatedMap.get(tileObj.q + ',' + tileObj.r)
        let tile = this.hexMapData.getEntry(tileRef.q, tileRef.r)

        let tileHeight = tile.height

        let zeroPoint

        zeroPoint = this.hexPositionToXYPosition(keyObj, tileHeight)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1




        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.hexMapData.size * 2 * imageSize.width
        tempCanvas.height = this.hexMapData.size * 2 * imageSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height)

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if(!cropListTileRef) continue
            let cropListTile = this.hexMapData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if(!cropListTile) continue
            
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

                let neighborHeights = []

                if (rotatedMap.get((tileObj.q + cropList[i].q - 1) + ',' + (tileObj.r + cropList[i].r + 1))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q - 1) + ',' + (tileObj.r + cropList[i].r + 1))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }
                if (rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r + 1))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r + 1))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }
                if (rotatedMap.get((tileObj.q + cropList[i].q + 1) + ',' + (tileObj.r + cropList[i].r))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q + 1) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }


                let height

                if (neighborHeights.length < 3) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)
                    height = tempTile.height
                } else {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)
                    height = tempTile.height - Math.min(...neighborHeights)
                }

                if (height < 0) height = 0;

                height += 1;

                tempctx.beginPath();

                let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.hexMapData.posMap.get(this.camera.rotation).x + clipXOffset,
                    zeroPoint.y + this.hexMapData.posMap.get(this.camera.rotation).y + clipYOffset - tempTile.height * this.hexMapData.tileHeight,
                    height
                );


                //clear the canvas in that area

                tempctx.save();
                tempctx.clip();

                //tempctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
                tempctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)

                tempctx.restore();
            }
        }

        return tempCanvas
    }

    cropOutTilesJump = (image, imageSize, imageOffset, keyObj, rotatedMap, height) => {

        let clipFlatHexagonPathForImage = (ctx, x, y, height) => {
            ctx.moveTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 0 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 1 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish) + (this.hexMapData.tileHeight * height));

            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 2 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 3 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 4 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
            ctx.lineTo(x + Math.sin(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * this.hexMapData.size, y + Math.cos(this.hexMapData.sideLength * 5 - this.hexMapData.sideLength / 2) * (this.hexMapData.size * this.hexMapData.squish));
        }

        let tileObj = this.hexMapData.roundToNearestHex(keyObj.q, keyObj.r)

        let tileHeight = height
        let zeroPoint

        zeroPoint = this.hexPositionToXYPosition(keyObj, tileHeight)

        zeroPoint.x = (zeroPoint.x - this.hexMapData.size - imageOffset.x * this.hexMapData.size * 2) * -1
        zeroPoint.y = (zeroPoint.y - (this.hexMapData.size * this.hexMapData.squish) - imageOffset.y * this.hexMapData.size * 2) * -1




        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.hexMapData.size * 2 * imageSize.width
        tempCanvas.height = this.hexMapData.size * 2 * imageSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height)

        let cropList = [{ q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        for (let i = 0; i < cropList.length; i++) {
            let cropListTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
            if(!cropListTileRef) continue
            let cropListTile = this.hexMapData.getEntry(cropListTileRef.q, cropListTileRef.r)
            if(!cropListTile) continue

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

                let neighborHeights = []

                if (rotatedMap.get((tileObj.q + cropList[i].q - 1) + ',' + (tileObj.r + cropList[i].r + 1))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q - 1) + ',' + (tileObj.r + cropList[i].r + 1))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }
                if (rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r + 1))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r + 1))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }
                if (rotatedMap.get((tileObj.q + cropList[i].q + 1) + ',' + (tileObj.r + cropList[i].r))) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q + 1) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    neighborHeights.push(tempTile.height)
                }


                let height

                if (neighborHeights.length < 3) {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                    height = tempTile.height
                } else {
                    let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                    let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)
                    
                    height = tempTile.height - Math.min(...neighborHeights)
                }

                if (height < 0) height = 0;

                height += 1;

                tempctx.beginPath();

                let tempTileRef = rotatedMap.get((tileObj.q + cropList[i].q) + ',' + (tileObj.r + cropList[i].r))
                let tempTile = this.hexMapData.getEntry(tempTileRef.q, tempTileRef.r)

                clipFlatHexagonPathForImage(tempctx,
                    zeroPoint.x + this.hexMapData.posMap.get(this.camera.rotation).x + clipXOffset,
                    zeroPoint.y + this.hexMapData.posMap.get(this.camera.rotation).y + clipYOffset - tempTile.height * this.hexMapData.tileHeight,
                    height
                );


                //clear the canvas in that area

                tempctx.save();
                tempctx.clip();

                //tempctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
                tempctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)

                tempctx.restore();
            }
        }

        return tempCanvas
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

    XYPositionTohexPosition = (x, y) => {

        let q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / this.hexMapData.size
        let r = ((2 / 3) * y) / this.hexMapData.size

        return {
            q: q,
            r: r
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

}