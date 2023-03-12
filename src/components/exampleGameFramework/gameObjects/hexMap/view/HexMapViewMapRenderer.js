export default class HexMapViewMapRendererClass {

    constructor(hexMapData, camera, settings, shadowRotationDims, images, utils, canvas) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.lineWidth = settings.HEXMAP_LINE_WIDTH
        this.sideColorMultiplier = settings.HEXMAP_SIDE_COLOR_MULTIPLIER
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
        this.shadowRotationDims = shadowRotationDims
        this.renderCanvasDims = null

        this.shadowMap = new Map();

        this.images = images
        this.utils = utils

        this.canvasDims = {
            width: canvas.width,
            height: canvas.height
        }

    }

    prerender = (renderCanvasDims) => {

        this.renderCanvasDims = renderCanvasDims

        //render camera rotations
        for (let i = 0; i < 12; i++) {
            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            this.setMapPos(rotatedMap, renderCanvasDims);
            if (i % 2 == 1) {
                let tablePosition = this.utils.getTablePosition();
                this.drawGroundShadowLayer(rotatedMap, renderCanvasDims, tablePosition)
                for (let j = 1; j <= this.hexMapData.maxHeight; j++) {
                    this.drawShadowLayer(j, rotatedMap, renderCanvasDims);
                }
            }
        }

        // for (let [key, value] of this.hexMapData.getMap()) {
        //     this.renderTileStack(value)
        // }

    }

    setMapPos = (rotatedMap, renderCanvasDims) => {

        //Set map hyp
        let keys = [...rotatedMap.keys()].map(key => this.hexMapData.split(key))

        let mapWidthMax = Math.max(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r));
        let mapHeightMax = Math.max(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish));
        let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.x * key.q + this.hexMapData.VecR.x * key.r)));
        let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.hexMapData.VecQ.y * key.q * this.hexMapData.squish + this.hexMapData.VecR.y * key.r * this.hexMapData.squish)));

        let mapWidth = Math.max(mapWidthMax, mapWidthMin)
        let mapHeight = Math.max(mapHeightMax, mapHeightMin)

        let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight);


        //Set the hexmap position to the center of the canvas

        let renderHexMapPos = {
            x: 0,
            y: 0
        }

        switch (this.camera.rotation) {
            case 0:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 8)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 4.5)
                break;
            case 1:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 13)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 3.5)
                break;
            case 2:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7.5)
                break;
            case 3:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9.5)
                break;
            case 4:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 12.5)
                break;
            case 5:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 15)
                break;
            case 6:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 17)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19.5)
                break;
            case 7:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 20.5)
                break;
            case 8:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 7)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 16.5)
                break;
            case 9:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 14.5)
                break;
            case 10:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11.5)
                break;
            case 11:
                renderHexMapPos.x = renderCanvasDims.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 5)
                renderHexMapPos.y = renderCanvasDims.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9)
                break;
        }


        this.hexMapData.posMap.set(this.camera.rotation, {
            x: renderHexMapPos.x,
            y: renderHexMapPos.y
        })
    }

    renderTileStack = (tile) => {

        let initCameraRotation = this.camera.rotation

        for (let rotation = 0; rotation < 12; rotation++) {
            
            this.camera.rotation = rotation;
            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let stackCanvas = document.createElement('canvas')
                stackCanvas.width = this.hexMapData.size * 2
                stackCanvas.height = this.hexMapData.size * 2 + tile.height * this.hexMapData.tileHeight
                let stackctx = stackCanvas.getContext('2d')

                for (let i = 1; i <= tile.height; i++) {
                    let tileBiome = tile.verylowBiome;

                    if (i >= this.elevationRanges['low']) {
                        tileBiome = tile.lowBiome
                    }
                    if (i >= this.elevationRanges['mid']) {
                        tileBiome = tile.midBiome
                    }
                    if (i >= this.elevationRanges['high']) {
                        tileBiome = tile.highBiome
                    }
                    if (i >= this.elevationRanges['veryhigh']) {
                        tileBiome = tile.veryhighBiome
                    }


                    stackctx.drawImage(
                        this.images.tile[tileBiome][this.camera.rotation],
                        0,
                        tile.height * this.hexMapData.tileHeight - (i) * this.hexMapData.tileHeight,
                        this.hexMapData.size * 2,
                        this.hexMapData.size * 2
                    )

                    let shadowRotation;

                    if (this.camera.rotation % 2 == 0) {
                        shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
                    } else {
                        shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
                    }

                    if (shadowRotation > 11) shadowRotation -= 12;

                    //wall shadow
                    this.utils.drawFlatHexagonWall(
                        stackctx,
                        this.hexMapData.size,
                        this.hexMapData.size * this.hexMapData.squish + tile.height * this.hexMapData.tileHeight - (i) * this.hexMapData.tileHeight,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`
                    );

                    //top shadows
                    stackctx.beginPath()

                    this.utils.clipFlatHexagonPath(stackctx, this.hexMapData.size, this.hexMapData.size * this.hexMapData.squish)

                    stackctx.save()
                    stackctx.clip()

                    let rotTile = this.utils.rotateTile(tile.position.q, tile.position.r, rotation)

                    let tilePos = this.utils.hexPositionToXYPosition(rotTile, tile.height)
                    tilePos.x -= this.hexMapData.size
                    tilePos.y -= this.hexMapData.size * this.hexMapData.squish

                    if (this.shadowMap.has(tile.height + ',' + rotation)) stackctx.drawImage(this.shadowMap.get(tile.height + ',' + rotation), -tilePos.x, -tilePos.y, this.renderCanvasDims.width, this.renderCanvasDims.height)

                    stackctx.restore()

                }

                tile.images[rotation] = stackCanvas

            } else {
                tile.images[rotation] = null
            }
        }

        this.camera.rotation = initCameraRotation

    }

    drawShadowLayer = (height, rotatedMap, renderCanvasDims) => {

        let shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = renderCanvasDims.width;
        shadowCanvas.height = renderCanvasDims.height;
        let shadowctx = shadowCanvas.getContext("2d");

        //set shadowctx properties
        shadowctx.lineJoin = 'round';
        shadowctx.lineCap = 'round';
        shadowctx.textAlign = 'center';
        shadowctx.textBaseline = 'middle'
        shadowctx.lineWidth = this.lineWidth * (1 - this.camera.zoom / this.hexMapData.tileHeight);

        let shadowDims;

        let shadowRotation;

        if (this.camera.rotation % 2 == 0) {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
        } else {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
        }

        if (shadowRotation > 11) shadowRotation -= 12;

        if (this.camera.rotation % 2 == 1) {
            shadowDims = {
                x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[shadowRotation].r),
                y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

            }
        } else {
            shadowDims = {
                x: (this.hexMapData.VecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[shadowRotation].r),
                y: (this.hexMapData.VecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

            }
        }

        //draw shadow
        shadowctx.beginPath();
        for (let [key, value] of rotatedMap) {

            value = this.hexMapData.getEntry(value.q, value.r)

            let keyObj = this.hexMapData.split(key);

            let xOffset;
            let yOffset;

            if (this.camera.rotation % 2 == 1) {
                xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
                yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
            } else {
                xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
                yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;
            }

            if (value.height > height) {

                this.utils.clipHexagonShadowPath(
                    shadowctx,
                    this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                    this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                    this.hexMapData.posMap.get(this.camera.rotation).x + xOffset + shadowDims.x * (value.height - height),
                    this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (value.height - height),
                    shadowRotation,
                    this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
                );

            }

        }
        shadowctx.fillStyle = 'rgba(25,25,25,0.3)';
        shadowctx.fill();

        this.shadowMap.set(this.hexMapData.join(height, this.camera.rotation), shadowCanvas)

    }

    drawGroundShadowLayer = (rotatedMap, renderCanvasDims, tablePosition) => {

        let shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = renderCanvasDims.width;
        shadowCanvas.height = renderCanvasDims.height;
        let shadowctx = shadowCanvas.getContext("2d");

        //set shadowctx properties
        shadowctx.lineJoin = 'round';
        shadowctx.lineCap = 'round';
        shadowctx.textAlign = 'center';
        shadowctx.textBaseline = 'middle'
        shadowctx.lineWidth = this.lineWidth * (1 - this.camera.zoom / this.hexMapData.tileHeight);

        let shadowDims;

        let shadowRotation;

        if (this.camera.rotation % 2 == 0) {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
        } else {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
        }

        if (shadowRotation > 11) shadowRotation -= 12;

        if (this.camera.rotation % 2 == 1) {
            shadowDims = {
                x: (this.hexMapData.flatTopVecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.flatTopVecR.x * this.shadowRotationDims[shadowRotation].r),
                y: (this.hexMapData.flatTopVecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

            }
        } else {
            shadowDims = {
                x: (this.hexMapData.VecQ.x * this.shadowRotationDims[shadowRotation].q + this.hexMapData.VecR.x * this.shadowRotationDims[shadowRotation].r),
                y: (this.hexMapData.VecQ.y * this.shadowRotationDims[shadowRotation].q * this.hexMapData.squish + this.hexMapData.VecR.y * this.shadowRotationDims[shadowRotation].r * this.hexMapData.squish)

            }
        }

        //clip table
        shadowctx.beginPath();

        shadowctx.moveTo(tablePosition[0].x, tablePosition[0].y);
        shadowctx.lineTo(tablePosition[1].x, tablePosition[1].y);
        shadowctx.lineTo(tablePosition[2].x, tablePosition[2].y);
        shadowctx.lineTo(tablePosition[3].x, tablePosition[3].y);
        shadowctx.lineTo(tablePosition[0].x, tablePosition[0].y);

        shadowctx.save();
        shadowctx.clip();

        shadowctx.beginPath();

        for (let [key, value] of rotatedMap) {

            value = this.hexMapData.getEntry(value.q, value.r)

            let keyObj = this.hexMapData.split(key);

            let xOffset;
            let yOffset;

            if (this.camera.rotation % 2 == 1) {
                xOffset = this.hexMapData.flatTopVecQ.x * keyObj.q + this.hexMapData.flatTopVecR.x * keyObj.r;
                yOffset = this.hexMapData.flatTopVecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * keyObj.r * this.hexMapData.squish;
            } else {
                xOffset = this.hexMapData.VecQ.x * keyObj.q + this.hexMapData.VecR.x * keyObj.r;
                yOffset = this.hexMapData.VecQ.y * keyObj.q * this.hexMapData.squish + this.hexMapData.VecR.y * keyObj.r * this.hexMapData.squish;

            }

            this.utils.clipHexagonShadowPath(
                shadowctx,
                this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                this.hexMapData.posMap.get(this.camera.rotation).y + yOffset,
                this.hexMapData.posMap.get(this.camera.rotation).x + xOffset + shadowDims.x * value.height,
                this.hexMapData.posMap.get(this.camera.rotation).y + yOffset + shadowDims.y * value.height,
                shadowRotation,
                this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
            );
        }

        shadowctx.fillStyle = 'rgba(25,25,25,0.3)';
        shadowctx.fill();
        shadowctx.restore();

        this.shadowMap.set(this.hexMapData.join(0, this.camera.rotation), shadowCanvas)

    }

}