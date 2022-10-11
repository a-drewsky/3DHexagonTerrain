export default class HexMapViewMapClass {

    constructor(hexMapData, camera, lineWidth, colors, sideColorMultiplier, elevationRanges, geometricTilesDebug, shadowRotationDims, images, utils, canvas) {

        this.renderctx = null; //should be local
        this.renderMap = new Map();

        this.hexMapData = hexMapData
        this.camera = camera
        this.lineWidth = lineWidth
        this.colors = colors
        this.sideColorMultiplier = sideColorMultiplier
        this.elevationRanges = elevationRanges
        this.geometricTilesDebug = geometricTilesDebug
        this.shadowRotationDims = shadowRotationDims

        this.images = images
        this.utils = utils

        this.canvasDims = {
            width: canvas.width,
            height: canvas.height
        }

    }

    setRender = (cameraRotation, canvas) => {
        this.renderMap.set(cameraRotation, canvas);
    }

    getRender = (cameraRotation) => {
        return this.renderMap.get(cameraRotation);
    }

    draw = (drawctx) => {

        let zoom = this.camera.zoomAmount * this.camera.zoom

        let position = this.camera.position

        let canvasDims = this.canvasDims

        let render = this.getRender(this.camera.rotation)
        
        //drawctx.drawImage(render, 0, 0, render.width, render.height)

        drawctx.drawImage(render, position.x, position.y, canvasDims.width + zoom, canvasDims.height + zoom * this.hexMapData.squish, position.x, position.y, canvasDims.width + zoom, canvasDims.height + zoom * this.hexMapData.squish)

    }

    prerender = (renderCanvasDims) => {

        //render all configs
        let renderConfig = (cameraRotation) => {
            this.camera.rotation = cameraRotation;
            let rotatedMap = this.utils.rotateMap();
            this.render(rotatedMap, renderCanvasDims);
        }


        let mapPosConfig = (cameraRotation) => {
            this.camera.rotation = cameraRotation;
            let rotatedMap = this.utils.rotateMap();
            this.setMapPos(rotatedMap, renderCanvasDims);
        }

        //render camera rotations
        for (let i = 0; i < 12; i++) {
            if ((i - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) renderConfig(i);
            else mapPosConfig(i);
        }

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

    render = (rotatedMap, renderCanvasDims) => {
        console.log('ACT')
        this.setRender(this.camera.rotation, document.createElement('canvas'));
        this.getRender(this.camera.rotation).width = renderCanvasDims.width;
        this.getRender(this.camera.rotation).height = renderCanvasDims.height;
        this.renderctx = this.getRender(this.camera.rotation).getContext("2d");

        //set renderctx properties
        this.renderctx.lineJoin = 'round';
        this.renderctx.lineCap = 'round';
        this.renderctx.textAlign = 'center';
        this.renderctx.textBaseline = 'middle'
        this.renderctx.clearRect(0, 0, renderCanvasDims.width, renderCanvasDims.height);
        this.renderctx.lineWidth = this.lineWidth * (1 - this.camera.zoom / this.hexMapData.tileHeight);


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

        let tablePosition = this.utils.getTablePosition();

        console.log(this.camera.rotation, tablePosition)
        //Draw the table
        //this.drawTable(tablePosition);


        //draw the hex map

        this.drawGroundShadowLayer(rotatedMap, tablePosition);

        for (let i = 1; i <= this.hexMapData.maxHeight; i++) {
            this.drawTileLayer(i, rotatedMap);

            if (i < this.hexMapData.maxHeight) this.drawShadowLayer(i, rotatedMap);

        }

    }

    drawTileLayer = (height, rotatedMap) => {

        let shadowRotation;

        if (this.camera.rotation % 2 == 0) {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
        } else {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
        }

        if (shadowRotation > 11) shadowRotation -= 12;


        for (let [key, value] of rotatedMap) {

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

            //draw hexagon if at height
            if (value.height == height) {

                if (this.camera.rotation % 2 == 1) {
                    if (this.geometricTilesDebug) {
                        this.utils.drawFlatHexagon(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsl(${this.colors[value.biome].fill.h}, ${this.colors[value.biome].fill.s}%, ${this.colors[value.biome].fill.l}%)`,
                            `hsl(${this.colors[value.biome].stroke.h}, ${this.colors[value.biome].stroke.s}%, ${this.colors[value.biome].stroke.l}%)`,
                            '' + keyObj.q + ',' + keyObj.r
                        );
                    }
                } else {
                    if (this.geometricTilesDebug) {
                        this.utils.drawPointyHexagon(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsl(${this.colors[value.biome].fill.h}, ${this.colors[value.biome].fill.s}%, ${this.colors[value.biome].fill.l}%)`,
                            `hsl(${this.colors[value.biome].stroke.h}, ${this.colors[value.biome].stroke.s}%, ${this.colors[value.biome].stroke.l}%)`,
                            '' + keyObj.q + ',' + keyObj.r
                        );
                    }
                }

            }

            //draw hexagon wall
            if (value.height >= height) {

                let tileBiome = value.verylowBiome;

                if (height >= this.elevationRanges['low']) {
                    tileBiome = value.lowBiome
                }
                if (height >= this.elevationRanges['mid']) {
                    tileBiome = value.midBiome
                }
                if (height >= this.elevationRanges['high']) {
                    tileBiome = value.highBiome
                }
                if (height >= this.elevationRanges['veryhigh']) {
                    tileBiome = value.veryhighBiome
                }

                if (this.camera.rotation % 2 == 1) {

                    if (this.geometricTilesDebug) {
                        this.utils.drawFlatHexagonWall(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                            `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                            `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                            `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                            `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,
                            `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].offset}%)`,
                        );
                    } else {
                        this.renderctx.drawImage(
                            this.images['flat_' + tileBiome + '_hex'],
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset - this.hexMapData.size,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish),
                            this.hexMapData.size * 2,
                            this.hexMapData.size * 2
                        )

                        //shadow
                        this.utils.drawFlatHexagonWall(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`
                        );
                    }



                } else {

                    if (this.geometricTilesDebug) {
                        this.utils.drawPointyHexagonWall(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                            `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].left}%)`,
                            `hsl(${this.colors[tileBiome].fill.h}, ${this.colors[tileBiome].fill.s}%, ${this.colors[tileBiome].fill.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`,
                            `hsl(${this.colors[tileBiome].stroke.h}, ${this.colors[tileBiome].stroke.s}%, ${this.colors[tileBiome].stroke.l * this.sideColorMultiplier * this.shadowRotationDims[shadowRotation].right}%)`
                        );
                    } else {
                        this.renderctx.drawImage(
                            this.images['pointy_' + tileBiome + '_hex'],
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset - this.hexMapData.size,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight - (this.hexMapData.size * this.hexMapData.squish),
                            this.hexMapData.size * 2,
                            this.hexMapData.size * 2
                        )

                        //shadow
                        this.utils.drawPointyHexagonWall(
                            this.renderctx,
                            this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                            this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                            `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                        );
                    }

                }


            }
        }

    }

    drawShadowLayer = (height, rotatedMap) => {

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

        //clip current layer
        this.renderctx.beginPath();

        for (let [key, value] of rotatedMap) {

            if (value.height == height) {

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


                if (this.camera.rotation % 2 == 1) {
                    this.utils.clipFlatHexagonPath(
                        this.renderctx,
                        this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                        this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight
                    );
                } else {
                    this.utils.clipPointyHexagonPath(
                        this.renderctx,
                        this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                        this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight
                    );
                }

            }

        }

        this.renderctx.save();
        this.renderctx.clip();

        //draw shadow
        this.renderctx.beginPath();
        for (let [key, value] of rotatedMap) {

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
                    this.renderctx,
                    this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                    this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight,
                    this.hexMapData.posMap.get(this.camera.rotation).x + xOffset + shadowDims.x * (value.height - height),
                    this.hexMapData.posMap.get(this.camera.rotation).y + yOffset - height * this.hexMapData.tileHeight + shadowDims.y * (value.height - height),
                    shadowRotation,
                    this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
                );

            }

        }
        this.renderctx.fillStyle = 'rgba(25,25,25,0.3)';
        this.renderctx.fill();
        this.renderctx.restore();

    }

    drawGroundShadowLayer = (rotatedMap, tablePosition) => {

        console.log(tablePosition)

        let shadowDims;

        let shadowRotation;

        if (this.camera.rotation % 2 == 0) {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
        } else {
            shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
        }

        if (shadowRotation > 11) shadowRotation -= 12;

        console.log(shadowRotation)

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
        this.renderctx.beginPath();

        this.renderctx.moveTo(tablePosition[0].x, tablePosition[0].y);
        this.renderctx.lineTo(tablePosition[1].x, tablePosition[1].y);
        this.renderctx.lineTo(tablePosition[2].x, tablePosition[2].y);
        this.renderctx.lineTo(tablePosition[3].x, tablePosition[3].y);
        this.renderctx.lineTo(tablePosition[0].x, tablePosition[0].y);

        this.renderctx.save();
        this.renderctx.clip();

        this.renderctx.beginPath();

        for (let [key, value] of rotatedMap) {

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
                this.renderctx,
                this.hexMapData.posMap.get(this.camera.rotation).x + xOffset,
                this.hexMapData.posMap.get(this.camera.rotation).y + yOffset,
                this.hexMapData.posMap.get(this.camera.rotation).x + xOffset + shadowDims.x * value.height,
                this.hexMapData.posMap.get(this.camera.rotation).y + yOffset + shadowDims.y * value.height,
                shadowRotation,
                this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
            );
        }

        this.renderctx.fillStyle = 'rgba(25,25,25,0.3)';
        this.renderctx.fill();
        this.renderctx.restore();

    }

}