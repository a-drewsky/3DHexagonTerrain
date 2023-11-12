import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import StatusBarRendererClass from "../common/StatusBarRenderer"
import ShadowRendererClass from "../common/ShadowRenderer"

export default class UnitRendererClass {

    constructor(hexMapData, images) {
        this.unitData = hexMapData.unitData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.images = images

        this.statusBarRenderer = new StatusBarRendererClass(this.mapData, this.images)
        this.utils = new CommonRendererUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()
        this.shadowRenderer = new ShadowRendererClass(hexMapData, images)
    }

    render = (unit) => {

        switch (unit.state.current.type) {
            case 'static':
                this.renderStaticSprites(unit)
                this.renderStaticShadows(unit)
                return
            case 'action':
                this.renderActionSprite(unit)
                this.renderActionShadow(unit)
                return
        }

    }

    renderStaticSprites = (unit) => {

        if (unit.position.q == null || unit.position.r == null) return

        let initRotation = this.cameraData.rotation

        for (let i in unit.imageObject.idle.images) {
            let imageList = []
            for (let rotation = 0; rotation < 6; rotation++) {

                this.cameraData.rotation = rotation

                let sprite = unit.sprite(this.cameraData.rotation)

                let rotatedMap = this.tileData.rotatedMapList[rotation]
                let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = this.mapData.size * 2 * sprite.size.w
                tempCanvas.height = this.mapData.size * 2 * sprite.size.h
                let tempctx = tempCanvas.getContext('2d')


                tempctx.drawImage(sprite.image, 0, 0, tempCanvas.width, tempCanvas.height)
                imageList[rotation] = tempCanvas

                this.statusBarRenderer.addHealthBar(imageList[rotation], unit)
                this.utils.darkenSprite(imageList[rotation], unit)
                this.utils.cropOutTiles(imageList[rotation], sprite.offset, keyObj, rotatedMap)

            }

            unit.staticImages[i] = imageList
        }

        this.cameraData.rotation = initRotation
    }

    renderStaticShadows = (unit) => {

        if (unit.position.q == null || unit.position.r == null || !unit.imageObject.shadow) return

        this.shadowRenderer.renderAllShadows(unit, unit.position)
    }

    renderActionSprite = (unit) => {

        let pos = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)

        let closestTile = {
            q: unit.position.q,
            r: unit.position.r
        }

        let height = this.tileData.getEntry(unit.position).height
        let extraHeight = 0

        if (unit.destination != null) {

            let percent = unit.travelPercent()
            let lerpPos = this.commonUtils.getLerpPos(unit.position, unit.destination, percent)
            pos = this.commonUtils.rotateTile(lerpPos, this.cameraData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: unit.destination.q,
                    r: unit.destination.r
                }
            }

            let newHeight = this.tileData.getEntry(unit.destination).height

            if (newHeight != height) {
                extraHeight = Math.sin(percent * Math.PI) * unit.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }

        let sprite = unit.sprite(this.cameraData.rotation)

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation, sprite.offset)

        let spriteSize = {
            width: this.mapData.size * 2 * sprite.size.w,
            height: this.mapData.size * 2 * sprite.size.h
        }

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return

        let spriteImage = sprite.image

        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.mapData.size * 2 * sprite.size.w
        tempCanvas.height = this.mapData.size * 2 * sprite.size.h
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(spriteImage, 0, 0, tempCanvas.width, tempCanvas.height)

        this.statusBarRenderer.addHealthBar(tempCanvas, unit)
        this.utils.cropOutTilesMovement(tempCanvas, sprite.offset, pos, height)
        this.utils.darkenSprite(tempCanvas, unit, closestTile, extraHeight)
        unit.actionImage = tempCanvas
    }

    renderActionShadow = (unit) => {

        if (!unit.imageObject.shadow) return

        let lerpPos = unit.position

        if (unit.destination != null) {
            let percent = unit.travelPercent()
            lerpPos = this.commonUtils.getLerpPos(unit.position, unit.destination, percent)
        }

        this.shadowRenderer.renderActionShadow(unit, lerpPos)

    }

}