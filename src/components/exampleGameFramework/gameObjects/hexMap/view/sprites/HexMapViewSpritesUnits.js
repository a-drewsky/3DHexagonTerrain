import HexMapCommonUtilsClass from "../../utils/HexMapCommonUtils"
import HexMapRendererUtilsClass from "../../utils/HexMapRendererUtils"
import HexMapViewUtilsClass from "../../utils/HexMapViewUtils"

export default class HexMapViewSpritesUnitsClass {

    constructor(hexMapData, spriteManager, camera, settings, images, canvasDims, travelTime, jumpAmount) {
        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.images = images
        this.rendererUtils = new HexMapRendererUtilsClass(hexMapData, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()
        this.viewUtils = new HexMapViewUtilsClass(camera)
        this.canvasDims = canvasDims
        this.travelTime = travelTime
        this.jumpAmount = jumpAmount
    }

    draw = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.unitList[spriteReference.id]

        if (spriteObject.data.state.current.type == 'moving') {
            this.drawMovingUnit(drawctx, spriteReference, spriteObject)
            return
        }

        if (spriteObject.data.state.current.type == 'action') {
            this.drawActionUnit(drawctx, spriteReference, spriteObject)
            return
        }

        this.drawStaticUnit(drawctx, spriteReference)

    }

    drawStaticShadow = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.unitList[spriteReference.id]

        if (!spriteObject.data.shadowImages || spriteObject.data.shadowImages.length == 0) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }
        let sprite = this.images[spriteObject.data.type][spriteObject.data.sprite]

        let tileHeight = spriteReference.height

        let shadowSize

        let shadowPos = this.hexMapData.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)


        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


        if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.data.shadowImages[this.camera.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

    drawShadow = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.unitList[spriteReference.id]

        if (spriteObject.data.destination == null) {
            this.drawStaticShadow(drawctx, spriteReference)
            return
        }

        let sprite = this.images[spriteObject.data.type][spriteObject.data.sprite]

        if (!sprite.shadowImages) return

        let pos = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let closestTile = {
            q: spriteObject.data.position.q,
            r: spriteObject.data.position.r
        }

        if (spriteObject.data.destination != null) {
            let point1 = spriteObject.data.position
            let point2 = spriteObject.data.destination
            let percent = (spriteObject.data.destinationCurTime - spriteObject.data.destinationStartTime) / this.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.data.destination.q,
                    r: spriteObject.data.destination.r
                }
            }
        }

        let shadowSize
        let tileHeight = this.hexMapData.getEntry(closestTile.q, closestTile.r).height

        let shadowPos = this.hexMapData.hexPositionToXYPosition(pos, tileHeight, this.camera.rotation)

        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return

        let shadowImage = this.images.unit[spriteObject.data.sprite].shadowImages[this.camera.rotation]

        shadowImage = this.rendererUtils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation])

        drawctx.drawImage(
            shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )

    }

    drawStaticUnit = (drawctx, spriteReference) => {
        let spriteObject = this.spriteManager.units.unitList[spriteReference.id]

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let sprite = this.images[spriteObject.data.type][spriteObject.data.sprite]

        let spriteSize

        let spritePos = this.hexMapData.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.data.images[spriteObject.data.frame][this.camera.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawActionUnit = (drawctx, spriteReference, spriteObject) => {

        let pos = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let height = spriteReference.height

        let sprite = this.images[spriteObject.data.type][spriteObject.data.sprite]

        let spritePos = this.hexMapData.hexPositionToXYPosition(pos, height, this.camera.rotation)

        let spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

        let spriteRotation = spriteObject.data.rotation + this.camera.rotation

        if (this.camera.rotation % 2 == 1) spriteRotation--

        if (spriteRotation > 11) spriteRotation -= 12

        let spriteImage = this.images.unit[spriteObject.data.sprite][spriteObject.data.state.current.name].images[spriteObject.data.frame][spriteRotation]

        //SHOULD BE HANDLED BY RENDERER
        spriteImage = this.rendererUtils.addHealthBar(spriteImage, sprite.spriteSize, spriteObject.data)
        spriteImage = this.rendererUtils.cropOutTiles(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation])
        spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, spriteObject.data, pos, height)
        drawctx.drawImage(
            spriteImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawMovingUnit = (drawctx, spriteReference, spriteObject) => {

        let pos = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let closestTile = {
            q: spriteObject.data.position.q,
            r: spriteObject.data.position.r
        }

        let height = spriteReference.height

        if (spriteObject.data.destination != null) {
            //set pos
            let point1 = spriteObject.data.position
            let point2 = spriteObject.data.destination
            let percent = (spriteObject.data.destinationCurTime - spriteObject.data.destinationStartTime) / this.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.data.destination.q,
                    r: spriteObject.data.destination.r
                }
            }

            //set height
            let newHeight = this.hexMapData.getEntry(spriteObject.data.destination.q, spriteObject.data.destination.r).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * this.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }


        let sprite = spriteObject.data.imageObject

        let spriteSize

        let spritePos = this.hexMapData.hexPositionToXYPosition(pos, height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

        let spriteRotation = spriteObject.data.rotation + this.camera.rotation

        if (this.camera.rotation % 2 == 1) spriteRotation--

        if (spriteRotation > 11) spriteRotation -= 12

        let spriteImage = sprite[spriteObject.data.state.current.name].images[spriteObject.data.frame][spriteRotation]

        spriteImage = this.rendererUtils.cropOutTilesJump(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation], height)
        spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, spriteObject.data, closestTile, height)

        drawctx.drawImage(
            spriteImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

}