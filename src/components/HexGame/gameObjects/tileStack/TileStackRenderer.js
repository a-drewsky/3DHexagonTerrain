import CommonRendererUtilsClass from "../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

import { SHADOW_SIZE, HEXMAP_SIDE_COLOR_MULTIPLIER } from '../commonConstants/CommonConstants'

const HEXMAP_LINE_WIDTH = 3

export default class TileStackRendererClass {

    constructor(hexMapData, images) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.unitData = hexMapData.unitData
        this.cameraData = hexMapData.cameraData

        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()


        //starts at top position and rotates clockwise
        this.shadowRotationDims = {
            0: { q: 0.5 * SHADOW_SIZE, r: -0.5 * SHADOW_SIZE, left: 1, right: 0.8, offset: 0.6 },
            1: { q: 0.5 * SHADOW_SIZE, r: 0 * SHADOW_SIZE, left: 0.8, right: 0.6, offset: 0.4 },
            2: { q: 0 * SHADOW_SIZE, r: 0.5 * SHADOW_SIZE, left: 0.6, right: 0.4, offset: 0.6 },
            3: { q: -0.5 * SHADOW_SIZE, r: 0.5 * SHADOW_SIZE, left: 0.4, right: 0.6, offset: 0.8 },
            4: { q: -0.5 * SHADOW_SIZE, r: 0 * SHADOW_SIZE, left: 0.6, right: 0.8, offset: 1 },
            5: { q: 0 * SHADOW_SIZE, r: -0.5 * SHADOW_SIZE, left: 0.8, right: 1, offset: 0.8 },
        }

    }

    renderGroundShadowTile = (tile) => {
        let initCameraRotation = this.cameraData.rotation

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;

            let stackCanvas = document.createElement('canvas')
            stackCanvas.width = this.mapData.size * 2
            stackCanvas.height = this.mapData.size * 2
            let stackctx = stackCanvas.getContext('2d')

            let shadowRotation;

            shadowRotation = this.mapData.shadowRotation + this.cameraData.rotation;


            if (shadowRotation >= 6) shadowRotation -= 6;

            //top shadows

            stackctx.beginPath()

            this.utils.clipFlatHexagonPath(stackctx, this.mapData.size, this.mapData.size * this.mapData.squish)

            stackctx.save()
            stackctx.clip()

            let rotTile = this.commonUtils.rotateTile(tile.position.q, tile.position.r, rotation)

            let tilePos = this.tileData.hexPositionToXYPosition(rotTile, tile.height, this.cameraData.rotation)
            tilePos.x -= this.mapData.size
            tilePos.y -= this.mapData.size * this.mapData.squish

            this.drawShadows(stackctx, tile)

            stackctx.restore()

            tile.images[rotation] = stackCanvas
        }

        this.cameraData.rotation = initCameraRotation
    }

    renderTileStack = (tile) => {

        let initCameraRotation = this.cameraData.rotation

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;

            let stackCanvas = document.createElement('canvas')
            stackCanvas.width = this.mapData.size * 2
            stackCanvas.height = this.mapData.size * 2 + tile.height * this.mapData.tileHeight
            let stackctx = stackCanvas.getContext('2d')

            for (let i = 1; i <= tile.height; i++) {
                let tileBiome = tile.verylowBiome;

                if (i >= this.mapData.elevationRanges['low']) {
                    tileBiome = tile.lowBiome
                }
                if (i >= this.mapData.elevationRanges['mid']) {
                    tileBiome = tile.midBiome
                }
                if (i >= this.mapData.elevationRanges['high']) {
                    tileBiome = tile.highBiome
                }
                if (i >= this.mapData.elevationRanges['veryhigh']) {
                    tileBiome = tile.veryhighBiome
                }

                stackctx.drawImage(
                    tile.imageObject[tileBiome][this.cameraData.rotation],
                    0,
                    tile.height * this.mapData.tileHeight - (i) * this.mapData.tileHeight,
                    this.mapData.size * 2,
                    this.mapData.size * 2
                )

                let shadowRotation;

                shadowRotation = this.mapData.shadowRotation + this.cameraData.rotation;

                if (shadowRotation >= 6) shadowRotation -= 6;

                //wall shadow
                this.utils.drawFlatHexagonWall(
                    stackctx,
                    this.mapData.size,
                    this.mapData.size * this.mapData.squish + tile.height * this.mapData.tileHeight - (i) * this.mapData.tileHeight,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].left)})`,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].right)})`,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].offset)})`,
                    `hsla(220, 20%, 20%, ${HEXMAP_SIDE_COLOR_MULTIPLIER * (1 - this.shadowRotationDims[shadowRotation].offset)})`
                );

            }

            //top shadows
            stackctx.beginPath()

            this.utils.clipFlatHexagonPath(stackctx, this.mapData.size, this.mapData.size * this.mapData.squish)

            stackctx.save()
            stackctx.clip()

            let rotTile = this.commonUtils.rotateTile(tile.position.q, tile.position.r, rotation)

            let tilePos = this.tileData.hexPositionToXYPosition(rotTile, tile.height, this.cameraData.rotation)
            tilePos.x -= this.mapData.size
            tilePos.y -= this.mapData.size * this.mapData.squish

            this.drawShadows(stackctx, tile)

            stackctx.restore()

            tile.images[rotation] = stackCanvas
        }

        this.cameraData.rotation = initCameraRotation

    }

    drawShadows = (stackctx, tile) => {


        let tileShadows = this.drawTileShadows(tile)

        stackctx.beginPath();
        this.utils.clipFlatHexagonPath(
            stackctx,
            this.mapData.size,
            this.mapData.size * this.mapData.squish
        );
        stackctx.save();
        stackctx.clip();

        stackctx.drawImage(tileShadows, 0, 0, this.mapData.size * 2, this.mapData.size * 2)

        stackctx.restore();

    }

    drawTileShadows = (tile) => {

        let tileList = [{ q: -1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }, { q: -2, r: 1 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -3, r: 2 }, { q: -2, r: 3 }, { q: -3, r: 3 }, { q: -4, r: 3 }, { q: -3, r: 4 }, { q: -4, r: 4 }, { q: -5, r: 4 }, { q: -4, r: 5 }, { q: -5, r: 5 }]

        let shadowCanvas = document.createElement('canvas')
        shadowCanvas.width = this.mapData.size * 2
        shadowCanvas.height = this.mapData.size * 2
        let shadowctx = shadowCanvas.getContext('2d')
        shadowctx.lineJoin = 'round';
        shadowctx.lineCap = 'round';
        shadowctx.textAlign = 'center';
        shadowctx.textBaseline = 'middle'
        shadowctx.lineWidth = HEXMAP_LINE_WIDTH * (1 - this.cameraData.zoom / this.mapData.tileHeight);

        let shadowDims;

        let shadowRotation;

        shadowRotation = this.mapData.shadowRotation + this.cameraData.rotation;

        if (shadowRotation >= 6) shadowRotation -= 6;

        shadowDims = {
            x: (this.mapData.flatTopVecQ.x * this.shadowRotationDims[shadowRotation].q + this.mapData.flatTopVecR.x * this.shadowRotationDims[shadowRotation].r),
            y: (this.mapData.flatTopVecQ.y * this.shadowRotationDims[shadowRotation].q * this.mapData.squish + this.mapData.flatTopVecR.y * this.shadowRotationDims[shadowRotation].r * this.mapData.squish)

        }
        //draw shadow
        shadowctx.beginPath();
        for (let tileKey of tileList) {


            let mapTileKey = { q: tile.position.q + tileKey.q, r: tile.position.r + tileKey.r }

            if (!this.tileData.hasEntry(mapTileKey.q, mapTileKey.r)) continue


            let mapTileValue = this.tileData.getAnyEntry(mapTileKey.q, mapTileKey.r)

            tileKey = this.commonUtils.rotateTile(tileKey.q, tileKey.r, this.cameraData.rotation)

            if (mapTileValue.height <= tile.height) continue

            let xOffset;
            let yOffset;

            xOffset = (this.mapData.flatTopVecQ.x * tileKey.q + this.mapData.flatTopVecR.x * tileKey.r)
            yOffset = (this.mapData.flatTopVecQ.y * tileKey.q * this.mapData.squish + this.mapData.flatTopVecR.y * tileKey.r * this.mapData.squish)


            this.utils.clipHexagonShadowPath(
                shadowctx,
                this.mapData.size + xOffset,
                (this.mapData.size * this.mapData.squish) + yOffset,
                this.mapData.size + xOffset + shadowDims.x * (mapTileValue.height - tile.height),
                (this.mapData.size * this.mapData.squish) + yOffset + shadowDims.y * (mapTileValue.height - tile.height),
                shadowRotation,
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

        if (tileObj.selectionImages[selection] === undefined) tileObj.selectionImages[selection] = []

        //crop image
        let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
        let keyObj = this.commonUtils.rotateTile(tileObj.position.q, tileObj.position.r, this.cameraData.rotation)

        this.utils.cropOutTiles(tempCanvas, { x: 0, y: 0 }, keyObj, rotatedMap)
        tileObj.selectionImages[selection][this.cameraData.rotation] = tempCanvas

    }

}