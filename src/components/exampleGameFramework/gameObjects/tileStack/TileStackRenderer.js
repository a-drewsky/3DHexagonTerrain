import HexMapRendererUtilsClass from "../commonUtils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../commonUtils/HexMapCommonUtils"

export default class TileStackRendererClass {

    constructor(tileData, hexMapData, camera, images, settings) {

        this.hexMapData = hexMapData
        this.tileData = tileData
        this.camera = camera
        this.lineWidth = settings.HEXMAP_LINE_WIDTH
        this.sideColorMultiplier = settings.HEXMAP_SIDE_COLOR_MULTIPLIER
        this.elevationRanges = settings.HEXMAP_ELEVATION_RANGES

        this.utils = new HexMapRendererUtilsClass(hexMapData, this.tileData, camera, settings, images)
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

    renderGroundShadowTile = (tile) => {
        let initCameraRotation = this.camera.rotation

        for (let rotation = 0; rotation < 12; rotation++) {

            this.camera.rotation = rotation;
            if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                let stackCanvas = document.createElement('canvas')
                stackCanvas.width = this.hexMapData.size * 2
                stackCanvas.height = this.hexMapData.size * 2
                let stackctx = stackCanvas.getContext('2d')

                let shadowRotation;

                if (this.camera.rotation % 2 == 0) {
                    shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation;
                } else {
                    shadowRotation = this.hexMapData.shadowRotation + this.camera.rotation - 1;
                }

                if (shadowRotation > 11) shadowRotation -= 12;

                //top shadows

                stackctx.beginPath()

                this.utils.clipFlatHexagonPath(stackctx, this.hexMapData.size, this.hexMapData.size * this.hexMapData.squish)

                stackctx.save()
                stackctx.clip()

                let rotTile = this.commonUtils.rotateTile(tile.position.q, tile.position.r, rotation)

                let tilePos = this.tileData.hexPositionToXYPosition(rotTile, tile.height, this.camera.rotation)
                tilePos.x -= this.hexMapData.size
                tilePos.y -= this.hexMapData.size * this.hexMapData.squish

                this.drawShadows(stackctx, tile)

                stackctx.restore()

                tile.images[rotation] = stackCanvas

            } else {
                tile.images[rotation] = null
            }
        }

        this.camera.rotation = initCameraRotation
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
                        tile.imageObject[tileBiome][this.camera.rotation],
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

                }

                //top shadows
                stackctx.beginPath()

                this.utils.clipFlatHexagonPath(stackctx, this.hexMapData.size, this.hexMapData.size * this.hexMapData.squish)

                stackctx.save()
                stackctx.clip()

                let rotTile = this.commonUtils.rotateTile(tile.position.q, tile.position.r, rotation)

                let tilePos = this.tileData.hexPositionToXYPosition(rotTile, tile.height, this.camera.rotation)
                tilePos.x -= this.hexMapData.size
                tilePos.y -= this.hexMapData.size * this.hexMapData.squish

                this.drawShadows(stackctx, tile)

                stackctx.restore()

                tile.images[rotation] = stackCanvas

            } else {
                tile.images[rotation] = null
            }
        }

        this.camera.rotation = initCameraRotation

    }

    drawShadows = (stackctx, tile) => {


        let shadowImage = this.drawShadowImage(tile)

        stackctx.beginPath();


        this.utils.clipFlatHexagonPath(
            stackctx,
            this.hexMapData.size,
            this.hexMapData.size * this.hexMapData.squish
        );


        stackctx.save();
        stackctx.clip();

        stackctx.drawImage(shadowImage, 0, 0, this.hexMapData.size * 2, this.hexMapData.size * 2)

        stackctx.restore();

    }

    drawShadowImage = (tile) => {

        let tileList = [{ q: -1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }, { q: -2, r: 1 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -3, r: 2 }, { q: -2, r: 3 }, { q: -3, r: 3 }, { q: -4, r: 3 }, { q: -3, r: 4 }, { q: -4, r: 4 }, { q: -5, r: 4 }, { q: -4, r: 5 }, { q: -5, r: 5 }]

        let shadowCanvas = document.createElement('canvas')
        shadowCanvas.width = this.hexMapData.size * 2
        shadowCanvas.height = this.hexMapData.size * 2
        let shadowctx = shadowCanvas.getContext('2d')
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
        for (let tileKey of tileList) {


            let mapTileKey = { q: tile.position.q + tileKey.q, r: tile.position.r + tileKey.r }

            if (!this.tileData.hasEntry(mapTileKey.q, mapTileKey.r)) continue


            let mapTileValue = this.tileData.getEntry(mapTileKey.q, mapTileKey.r)

            tileKey = this.commonUtils.rotateTile(tileKey.q, tileKey.r, this.camera.rotation)

            if (mapTileValue.height <= tile.height) continue

            let xOffset;
            let yOffset;

            if (this.camera.rotation % 2 == 1) {
                xOffset = (this.hexMapData.flatTopVecQ.x * tileKey.q + this.hexMapData.flatTopVecR.x * tileKey.r)
                yOffset = (this.hexMapData.flatTopVecQ.y * tileKey.q * this.hexMapData.squish + this.hexMapData.flatTopVecR.y * tileKey.r * this.hexMapData.squish)
            } else {
                xOffset = this.hexMapData.VecQ.x * tileKey.q + this.hexMapData.VecR.x * tileKey.r;
                yOffset = this.hexMapData.VecQ.y * tileKey.q * this.hexMapData.squish + this.hexMapData.VecR.y * tileKey.r * this.hexMapData.squish;
            }

            this.utils.clipHexagonShadowPath(
                shadowctx,
                this.hexMapData.size + xOffset,
                (this.hexMapData.size * this.hexMapData.squish) + yOffset,
                this.hexMapData.size + xOffset + shadowDims.x * (mapTileValue.height - tile.height),
                (this.hexMapData.size * this.hexMapData.squish) + yOffset + shadowDims.y * (mapTileValue.height - tile.height),
                shadowRotation,
                this.camera.rotation % 2 == 1 ? 'flat' : 'pointy'
            );


        }
        shadowctx.fillStyle = 'rgba(25,25,25,0.3)';
        shadowctx.fill();

        return shadowCanvas
    }

    renderSelectionImage = (tileObj, selection) => {

        //assign image
        let sprite = tileObj.selectionImageObject[selection]

        //create canvas
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = tileObj.canvasSize.width
        tempCanvas.height = tileObj.canvasSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(sprite, 0, 0, tempCanvas.width, tempCanvas.height)

        if(tileObj.selectionImages[selection] === undefined) tileObj.selectionImages[selection] = []

        tileObj.selectionImages[selection][this.camera.rotation] = tempCanvas

        //crop image
        let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
        let keyObj = this.commonUtils.rotateTile(tileObj.position.q, tileObj.position.r, this.camera.rotation)

        let croppedImage = this.utils.cropOutTiles(tileObj.selectionImages[selection][this.camera.rotation], { width: 1, height: 1 }, { x: 0, y: 0 }, keyObj, rotatedMap)
        tileObj.selectionImages[selection][this.camera.rotation] = croppedImage

    }

}