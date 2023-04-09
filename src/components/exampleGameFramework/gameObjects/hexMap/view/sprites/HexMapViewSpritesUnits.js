import HexMapCommonUtilsClass from "../../../commonUtils/HexMapCommonUtils"
import HexMapRendererUtilsClass from "../../../commonUtils/HexMapRendererUtils"
import HexMapViewUtilsClass from "../../utils/HexMapViewUtils"

export default class HexMapViewSpritesUnitsClass {

    constructor(hexMapData, spriteManager, camera, settings, images, canvasDims, travelTime, jumpAmount) {
        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.images = images
        this.rendererUtils = new HexMapRendererUtilsClass(hexMapData, spriteManager.tiles.data, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()
        this.viewUtils = new HexMapViewUtilsClass(camera)
        this.canvasDims = canvasDims
        this.travelTime = travelTime
        this.jumpAmount = jumpAmount
    }

    draw = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.data.unitList[spriteReference.id]

        if (spriteObject.state.current.type == 'moving') {
            this.drawMovingUnit(drawctx, spriteReference, spriteObject)
            return
        }

        if (spriteObject.state.current.type == 'action') {
            this.drawActionUnit(drawctx, spriteReference, spriteObject)
            return
        }

        this.drawStaticUnit(drawctx, spriteReference)

    }

    drawStaticShadow = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.data.unitList[spriteReference.id]

        if (!spriteObject.shadowImages || spriteObject.shadowImages.length == 0) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }
        let sprite = spriteObject.imageObject

        let tileHeight = spriteReference.height

        let shadowSize

        let shadowPos = this.spriteManager.tiles.data.hexPositionToXYPosition(keyObj, tileHeight, this.camera.rotation)


        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


        if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.shadowImages[this.camera.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

    drawShadow = (drawctx, spriteReference) => {

        let spriteObject = this.spriteManager.units.data.unitList[spriteReference.id]

        if (spriteObject.destination == null) {
            this.drawStaticShadow(drawctx, spriteReference)
            return
        }

        let sprite = spriteObject.imageObject

        if (!sprite.shadowImages) return

        let pos = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let closestTile = {
            q: spriteObject.position.q,
            r: spriteObject.position.r
        }

        if (spriteObject.destination != null) {
            let point1 = spriteObject.position
            let point2 = spriteObject.destination
            let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / this.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.destination.q,
                    r: spriteObject.destination.r
                }
            }
        }

        let shadowSize
        let tileHeight = this.spriteManager.tiles.data.getEntry(closestTile.q, closestTile.r).height

        let shadowPos = this.spriteManager.tiles.data.hexPositionToXYPosition(pos, tileHeight, this.camera.rotation)

        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return

        let shadowImage = sprite.shadowImages[this.camera.rotation]

        shadowImage = this.rendererUtils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.spriteManager.tiles.data.rotatedMapList[this.camera.rotation])

        drawctx.drawImage(
            shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )

    }

    drawStaticUnit = (drawctx, spriteReference) => {
        let spriteObject = this.spriteManager.units.data.unitList[spriteReference.id]

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let sprite = spriteObject.imageObject

        let spriteSize

        let spritePos = this.spriteManager.tiles.data.hexPositionToXYPosition(keyObj, spriteReference.height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.frame][this.camera.rotation],
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

        let sprite = spriteObject.imageObject

        let spritePos = this.spriteManager.tiles.data.hexPositionToXYPosition(pos, height, this.camera.rotation)

        let spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

        let spriteRotation = spriteObject.rotation + this.camera.rotation

        if (this.camera.rotation % 2 == 1) spriteRotation--

        if (spriteRotation > 11) spriteRotation -= 12

        let spriteImage = sprite[spriteObject.state.current.name].images[spriteObject.frame][spriteRotation]

        //SHOULD BE HANDLED BY RENDERER
        spriteImage = this.rendererUtils.addHealthBar(spriteImage, sprite.spriteSize, spriteObject)
        spriteImage = this.rendererUtils.cropOutTiles(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.spriteManager.tiles.data.rotatedMapList[this.camera.rotation])
        spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, spriteObject, pos, height)
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
            q: spriteObject.position.q,
            r: spriteObject.position.r
        }

        let height = spriteReference.height

        if (spriteObject.destination != null) {
            //set pos
            let point1 = spriteObject.position
            let point2 = spriteObject.destination
            let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / this.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.destination.q,
                    r: spriteObject.destination.r
                }
            }

            //set height
            let newHeight = this.spriteManager.tiles.data.getEntry(spriteObject.destination.q, spriteObject.destination.r).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * this.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }


        let sprite = spriteObject.imageObject

        let spriteSize

        let spritePos = this.spriteManager.tiles.data.hexPositionToXYPosition(pos, height, this.camera.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

        let spriteRotation = spriteObject.rotation + this.camera.rotation

        if (this.camera.rotation % 2 == 1) spriteRotation--

        if (spriteRotation > 11) spriteRotation -= 12

        let spriteImage = sprite[spriteObject.state.current.name].images[spriteObject.frame][spriteRotation]

        spriteImage = this.rendererUtils.cropOutTilesJump(spriteImage, sprite.spriteSize, sprite.spriteOffset, pos, this.spriteManager.tiles.data.rotatedMapList[this.camera.rotation], height)
        spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, spriteObject, closestTile, height)

        drawctx.drawImage(
            spriteImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

}