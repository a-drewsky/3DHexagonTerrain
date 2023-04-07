import HexMapRendererUtilsClass from "../hexMap/utils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../hexMap/utils/HexMapCommonUtils"

export default class TileStackRendererClass {

    constructor(hexMapData, camera, settings) {

        this.hexMapData = hexMapData
        this.camera = camera
        this.lineWidth = settings.HEXMAP_LINE_WIDTH
        this.sideColorMultiplier = settings.HEXMAP_SIDE_COLOR_MULTIPLIER
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES
        this.drawCanvas = null

        this.utils = new HexMapRendererUtilsClass(hexMapData, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()


        //starts at top position and rotates clockwise
        this.shadowRotationDims = {
            0: { q: 0.25 * settings.SHADOW_SIZE, r: -0.5 * settings.SHADOW_SIZE, left: 0.9, right: 0.9, offset: 0.7 },
            1: { q: 0.5 * settings.SHADOW_SIZE, r: -0.5 * settings.SHADOW_SIZE, left: 1, right: 0.8, offset: 0.6 },
            2: { q: 0.5 * settings.SHADOW_SIZE, r: -0.25 * settings.SHADOW_SIZE, left: 0.9, right: 0.7, offset: 0.5 },
            3: { q: 0.5 * settings.SHADOW_SIZE, r: 0 * settings.SHADOW_SIZE, left: 0.8, right: 0.6, offset: 0.4 },
            4: { q: 0.25 * settings.SHADOW_SIZE, r: 0.25 * settings.SHADOW_SIZE, left: 0.7, right: 0.5, offset: 0.5 },
            5: { q: 0 * settings.SHADOW_SIZE, r: 0.5 * settings.SHADOW_SIZE, left: 0.6, right: 0.4, offset: 0.6 },
            6: { q: -0.25 * settings.SHADOW_SIZE, r: 0.5 * settings.SHADOW_SIZE, left: 0.5, right: 0.5, offset: 0.7 },
            7: { q: -0.5 * settings.SHADOW_SIZE, r: 0.5 * settings.SHADOW_SIZE, left: 0.4, right: 0.6, offset: 0.8 },
            8: { q: -0.5 * settings.SHADOW_SIZE, r: 0.25 * settings.SHADOW_SIZE, left: 0.5, right: 0.7, offset: 0.9 },
            9: { q: -0.5 * settings.SHADOW_SIZE, r: 0 * settings.SHADOW_SIZE, left: 0.6, right: 0.8, offset: 1 },
            10: { q: -0.25 * settings.SHADOW_SIZE, r: -0.25 * settings.SHADOW_SIZE, left: 0.7, right: 0.9, offset: 0.9 },
            11: { q: 0 * settings.SHADOW_SIZE, r: -0.5 * settings.SHADOW_SIZE, left: 0.8, right: 1, offset: 0.8 },
        }

    }

    renderTileStack = () => {

        let initCameraRotation = this.camera.rotation

        for (let rotation = 0; rotation < 12; rotation++) {

            this.camera.rotation = rotation;
            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let stackCanvas = document.createElement('canvas')
                stackCanvas.width = this.hexMapData.size * 2
                stackCanvas.height = this.hexMapData.size * 2 + this.data.height * this.hexMapData.tileHeight
                let stackctx = stackCanvas.getContext('2d')

                for (let i = 1; i <= this.data.height; i++) {
                    let tileBiome = this.data.verylowBiome;

                    if (i >= this.data.elevationRanges['low']) {
                        tileBiome = this.data.lowBiome
                    }
                    if (i >= this.data.elevationRanges['mid']) {
                        tileBiome = this.data.midBiome
                    }
                    if (i >= this.data.elevationRanges['high']) {
                        tileBiome = this.data.highBiome
                    }
                    if (i >= this.data.elevationRanges['veryhigh']) {
                        tileBiome = this.data.veryhighBiome
                    }


                    stackctx.drawImage(
                        this.data.imageObject[tileBiome][this.camera.rotation],
                        0,
                        this.data.height * this.hexMapData.tileHeight - (i) * this.hexMapData.tileHeight,
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
                        this.hexMapData.size * this.hexMapData.squish + this.data.height * this.hexMapData.tileHeight - (i) * this.hexMapData.tileHeight,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`,
                        `hsla(220, 20%, 20%, ${this.sideColorMultiplier * (1 - this.shadowRotationDims[shadowRotation].offset)})`
                    );

                }

                //top shadows
                stackctx.beginPath()

                this.utils.clipFlatHexagonPath(stackctx, this.hexMapData.size, this.hexMapData.size * this.hexMapData.squish)

                stackctx.save()
                stackctx.clip()

                let rotTile = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, rotation)

                let tilePos = this.hexMapData.hexPositionToXYPosition(rotTile, this.data.height, this.camera.rotation)
                tilePos.x -= this.hexMapData.size
                tilePos.y -= this.hexMapData.size * this.hexMapData.squish

                if (this.hexMapData.shadowMap.has(this.data.height + ',' + rotation)) stackctx.drawImage(this.hexMapData.shadowMap.get(this.data.height + ',' + rotation), -tilePos.x, -tilePos.y, this.drawCanvas.width, this.drawCanvas.height)

                stackctx.restore()

                this.data.images[rotation] = stackCanvas

            } else {
                this.data.images[rotation] = null
            }
        }

        this.camera.rotation = initCameraRotation

    }

    drawShadowLayer = (height, rotatedMap, drawCanvas) => {

        let shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = drawCanvas.width;
        shadowCanvas.height = drawCanvas.height;
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

            let keyObj = this.commonUtils.split(key);

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

        this.hexMapData.shadowMap.set(this.commonUtils.join(height, this.camera.rotation), shadowCanvas)

    }

    drawGroundShadowLayer = (rotatedMap, drawCanvas, tablePosition) => {

        let shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = drawCanvas.width;
        shadowCanvas.height = drawCanvas.height;
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

            let keyObj = this.commonUtils.split(key);

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

        this.hexMapData.shadowMap.set(this.commonUtils.join(0, this.camera.rotation), shadowCanvas)

    }

    renderSelectionImage = (tileObj, selection) => {

        //assign image
        let sprite = this.images[selection]

        let canvasSize = {
            width: this.hexMapData.size * 2,
            height: this.hexMapData.size * 2
        }

        //create canvas
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvasSize.width
        tempCanvas.height = canvasSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(sprite, 0, 0, tempCanvas.width, tempCanvas.height)

        if(tileObj.selectionImages[selection] === undefined) tileObj.selectionImages[selection] = []

        tileObj.selectionImages[selection][this.camera.rotation] = tempCanvas

        //crop image
        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
        let keyObj = this.commonUtils.rotateTile(tileObj.position.q, tileObj.position.r, this.camera.rotation)

        let croppedImage = this.utils.cropOutTiles(tileObj.selectionImages[selection][this.camera.rotation], { width: 1, height: 1 }, { x: 0, y: 0 }, keyObj, rotatedMap)
        tileObj.selectionImages[selection][this.camera.rotation] = croppedImage

    }

}