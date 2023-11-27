import RendererUtilsClass from "./utils/RendererUtils"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class TileStackRendererClass {

    constructor(gameData, images) {

        this.mapData = gameData.mapData
        this.tileData = gameData.tileData
        this.structureData = gameData.structureData
        this.unitData = gameData.unitData
        this.cameraData = gameData.cameraData

        this.images = images

        this.utils = new RendererUtilsClass(gameData)
        this.commonUtils = new CommonHexMapUtilsClass()

    }

    renderGroundShadowTile = (tile) => {
        let initCameraRotation = this.cameraData.rotation

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation;

            let stackCanvas = document.createElement('canvas')
            stackCanvas.width = this.mapData.size * 2
            stackCanvas.height = this.mapData.size * 2
            let stackctx = stackCanvas.getContext('2d')

            stackctx.beginPath()

            this.utils.clipFlatHexagonPath(stackctx, this.mapData.size, this.mapData.size * this.mapData.squish)

            stackctx.save()
            stackctx.clip()

            this.drawShadows(stackctx, tile)

            stackctx.restore()

            tile.images[rotation] = stackCanvas
        }

        this.cameraData.rotation = initCameraRotation
    }

    renderTileStack = (tile) => {

        let initCameraRotation = this.cameraData.rotation

        for (let rotation = 0; rotation < 6; rotation++) {

            this.cameraData.rotation = rotation

            let stackCanvas = document.createElement('canvas')
            stackCanvas.width = this.mapData.size * 2
            stackCanvas.height = this.mapData.size * 2 + tile.height * this.mapData.tileHeight
            let stackctx = stackCanvas.getContext('2d')

            for (let i = 1; i <= tile.height; i++) {
                let tileBiome = tile.verylowBiome

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
                    tile.imageObject[tileBiome],
                    0,
                    tile.height * this.mapData.tileHeight - (i) * this.mapData.tileHeight,
                    this.mapData.size * 2,
                    this.mapData.size * 2
                )

                this.drawWallShadow(stackctx, tile, i)
                this.drawAdvWallShadow(stackctx, tile, i)
            }

            this.drawShadows(stackctx, tile)

            tile.images[rotation] = stackCanvas
        }

        this.cameraData.rotation = initCameraRotation

    }

    drawWallShadow = (stackctx, stack, tileHeight) => {
        let shadowImage = this.images.tile_shadows.tile_side_shadows[this.cameraData.rotation]
        stackctx.drawImage(shadowImage, 0, stack.height * this.mapData.tileHeight - (tileHeight) * this.mapData.tileHeight, this.mapData.size * 2, this.mapData.size * 2)
    }

    drawAdvWallShadow = (stackctx, stack, tileHeight) => {

        let tileHeightRows = this.utils.getShadowRowHeightsDifference(4, stack.position, tileHeight)

        let tileShadows = { l: 0, c: 0, r: 0 }

        for(let rowNum in tileHeightRows){
            let row = tileHeightRows[rowNum]

            tileShadows.l = Math.min(Math.max(tileShadows.l, this.utils.getSideShadowDistance(rowNum, row.l)), 1)
            tileShadows.c = Math.min(Math.max(tileShadows.c, this.utils.getSideShadowDistance(rowNum, row.c)), 3)
            tileShadows.r = Math.min(Math.max(tileShadows.r, this.utils.getSideShadowDistance(rowNum, row.r)), 1)
        }

        if(tileShadows.l === 0 && tileShadows.c === 0 && tileShadows.r === 0) return

        if(tileShadows.c === 3){
            tileShadows.l = 0
            tileShadows.r = 0
        }

        if(tileShadows.l === 1 && tileShadows.r === 1 && tileShadows.c > 0){
            tileShadows.c = 3
            tileShadows.l = 0
            tileShadows.r = 0
        }

        let shadowImage = this.images.tile_shadows.adv_side_shadows[`l${tileShadows.l}_c${tileShadows.c}_r${tileShadows.r}`][this.cameraData.rotation]

        stackctx.drawImage(shadowImage, 0, stack.height * this.mapData.tileHeight - (tileHeight) * this.mapData.tileHeight, this.mapData.size * 2, this.mapData.size * 2)

    }

    drawShadows = (stackctx, stack) => {

        let tileHeightRows = this.utils.getShadowRowHeightsDifference(4, stack.position, stack.height)

        let tileShadows = { l: 0, c: 0, r: 0 }

        for(let rowNum in tileHeightRows){
            let row = tileHeightRows[rowNum]

            tileShadows.l = Math.min(Math.max(tileShadows.l, this.utils.getShadowDistance(rowNum, row.l)), 2)
            tileShadows.c = Math.min(Math.max(tileShadows.c, this.utils.getShadowDistance(rowNum, row.c)), 2)
            tileShadows.r = Math.min(Math.max(tileShadows.r, this.utils.getShadowDistance(rowNum, row.r)), 2)
        }

        if(tileShadows.l === 0 && tileShadows.c === 0 && tileShadows.r === 0) return

        if(tileShadows.c === 2){
            tileShadows.l = 0
            tileShadows.r = 0
        }

        let shadowImage = this.images.tile_shadows.casted_shadows[`l${tileShadows.l}_c${tileShadows.c}_r${tileShadows.r}`][this.cameraData.rotation]

        stackctx.drawImage(shadowImage, 0, 0, this.mapData.size * 2, this.mapData.size * 2)

    }

}