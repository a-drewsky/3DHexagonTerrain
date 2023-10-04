import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitRendererClass {

    constructor(hexMapData, images) {
        this.unitData = hexMapData.unitData
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.cameraData = hexMapData.cameraData

        this.utils = new CommonRendererUtilsClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
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

        for (let i = 0; i < unit.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 6; rotation++) {


                this.cameraData.rotation = rotation;

                let sprite = unit.sprite(this.cameraData.rotation)

                let rotatedMap = this.tileData.rotatedMapList[rotation]
                let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = this.mapData.size * 2 * sprite.size.w
                tempCanvas.height = this.mapData.size * 2 * sprite.size.h
                let tempctx = tempCanvas.getContext('2d')


                tempctx.drawImage(sprite.image, 0, 0, tempCanvas.width, tempCanvas.height)
                imageList[rotation] = tempCanvas

                this.utils.addHealthBar(imageList[rotation], unit)
                this.utils.darkenSprite(imageList[rotation], unit)
                this.utils.cropOutTiles(imageList[rotation], sprite.offset, keyObj, rotatedMap)

            }

            unit.images[i] = imageList
        }

        this.cameraData.rotation = initRotation
    }

    renderStaticShadows = (unit) => {

        if (unit.position.q == null || unit.position.r == null) return

        let initRotation = this.cameraData.rotation

        if (unit.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 6; rotation++) {

                this.cameraData.rotation = rotation;
                let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
                let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = this.mapData.size * 2 * unit.imageObject.shadowSize.width
                tempCanvas.height = this.mapData.size * 2 * unit.imageObject.shadowSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(unit.imageObject.shadowImages[rotation].image, 0, 0, tempCanvas.width, tempCanvas.height)

                tempCanvas = this.utils.cropStructureShadow(tempCanvas, unit.imageObject.shadowSize, unit.imageObject.shadowOffset, keyObj, rotatedMap)

                imageList[rotation] = tempCanvas

            }

            unit.shadowImages = imageList

        }

        this.cameraData.rotation = initRotation
    }

    renderActionSprite = (unit) => {

        let pos = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

        let closestTile = {
            q: unit.position.q,
            r: unit.position.r
        }

        let height = this.tileData.getEntry(unit.position.q, unit.position.r).height

        if (unit.destination != null) {
            //set pos
            let point1 = unit.position
            let point2 = unit.destination
            let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: unit.destination.q,
                    r: unit.destination.r
                }
            }

            //set height
            let newHeight = this.tileData.getEntry(unit.destination.q, unit.destination.r).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * unit.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }

        let sprite = unit.sprite(this.cameraData.rotation)

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)
        spritePos.x -= this.mapData.size + sprite.offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite.offset.y * this.mapData.size * 2

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

        this.utils.addHealthBar(tempCanvas, unit)
        this.utils.cropOutTilesJump(tempCanvas, sprite.offset, pos, this.tileData.rotatedMapList[this.cameraData.rotation], height)
        this.utils.darkenSpriteJump(tempCanvas, unit, closestTile, height)
        unit.images = tempCanvas
    }

    renderActionShadow = (unit) => {

        if (!unit.imageObject.shadowImages) return

        let pos = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

        let closestTile = {
            q: unit.position.q,
            r: unit.position.r
        }

        if (unit.destination != null) {
            let point1 = unit.position
            let point2 = unit.destination
            let percent = (unit.destinationCurTime - unit.destinationStartTime) / unit.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: unit.destination.q,
                    r: unit.destination.r
                }
            }
        }

        let height = this.tileData.getEntry(closestTile.q, closestTile.r).height
        let sprite = unit.imageObject
        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)
        let shadowSize = {
            width: this.mapData.size * 2 * sprite.shadowSize.width,
            height: this.mapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

        let shadowImage = sprite.shadowImages[this.cameraData.rotation].image

        shadowImage = this.utils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.tileData.rotatedMapList[this.cameraData.rotation])

        unit.shadowImages = shadowImage

    }

}