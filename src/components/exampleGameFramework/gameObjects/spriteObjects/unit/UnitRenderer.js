import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitRendererClass {

    constructor(unitData, hexMapData, tileData, cameraData, images) {
        this.unitData = unitData
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.cameraData = cameraData

        this.utils = new CommonRendererUtilsClass(hexMapData, tileData, cameraData, images)
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

        let initRotation = this.cameraData.rotation

        for (let i = 0; i < unit.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - initRotation) % this.cameraData.rotationAmount != 0) {
                    imageList[rotation] = null
                    continue
                }

                this.cameraData.rotation = rotation;
                let rotatedMap = this.tileData.rotatedMapList[rotation]
                let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = unit.canvasSize.width
                tempCanvas.height = unit.canvasSize.height
                let tempctx = tempCanvas.getContext('2d')

                let spriteRotation = unit.rotation + this.cameraData.rotation

                if (this.cameraData.rotation % 2 == 1) spriteRotation--

                if (spriteRotation > 11) spriteRotation -= 12

                tempctx.drawImage(unit.imageObject.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)
                imageList[rotation] = tempCanvas

                this.utils.addHealthBar(imageList[rotation], unit)
                this.utils.darkenSprite(imageList[rotation], unit)
                this.utils.cropOutTiles(imageList[rotation], unit.imageObject.spriteOffset, keyObj, rotatedMap)


            }

            unit.images[i] = imageList
        }

        this.cameraData.rotation = initRotation
    }

    renderStaticShadows = (unit) => {

        let initRotation = this.cameraData.rotation

        //prerender shadow images
        if (unit.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount != 0) {
                    imageList[rotation] = null
                    continue
                }

                this.cameraData.rotation = rotation;
                let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
                let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = this.hexMapData.size * 2 * unit.imageObject.shadowSize.width
                tempCanvas.height = this.hexMapData.size * 2 * unit.imageObject.shadowSize.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(unit.imageObject.shadowImages[rotation], 0, 0, tempCanvas.width, tempCanvas.height)

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


        let sprite = unit.imageObject

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return

        let spriteRotation = unit.rotation + this.cameraData.rotation

        if (this.cameraData.rotation % 2 == 1) spriteRotation--

        if (spriteRotation > 11) spriteRotation -= 12

        let spriteImage = sprite[unit.state.current.name].images[unit.frame][spriteRotation]

        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.hexMapData.size * 2 * sprite.spriteSize.width
        tempCanvas.height = this.hexMapData.size * 2 * sprite.spriteSize.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(spriteImage, 0, 0, tempCanvas.width, tempCanvas.height)

        this.utils.addHealthBar(tempCanvas, unit)
        this.utils.cropOutTilesJump(tempCanvas, sprite.spriteOffset, pos, this.tileData.rotatedMapList[this.cameraData.rotation], height)
        this.utils.darkenSpriteJump(tempCanvas, unit, closestTile, height)
        unit.images = tempCanvas
    }

    renderActionShadow = (unit) => {

        if (!unit.imageObject.shadowImages) return

        let pos = {
            q: unit.position.q,
            r: unit.position.r
        }

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

        let shadowSize
        let tileHeight = this.tileData.getEntry(closestTile.q, closestTile.r).height

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, tileHeight, this.cameraData.rotation)

        shadowSize = {
            width: this.hexMapData.size * 2 * unit.imageObject.shadowSize.width,
            height: this.hexMapData.size * 2 * unit.imageObject.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + unit.imageObject.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + unit.imageObject.shadowOffset.y * this.hexMapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return

        let shadowImage = unit.imageObject.shadowImages[this.cameraData.rotation]

        shadowImage = this.utils.cropStructureShadow(shadowImage, unit.imageObject.shadowSize, unit.imageObject.shadowOffset, pos, this.tileData.rotatedMapList[this.cameraData.rotation])

        unit.shadowImages = shadowImage

    }

}