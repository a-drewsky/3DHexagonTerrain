import CommonRendererUtilsClass from "../../commonUtils/CommonRendererUtils"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitViewClass{

    constructor(hexMapData, tileData, unitData, cameraData, images, canvas) {
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.unitData = unitData
        this.cameraDataData = cameraData
        this.images = images
        this.rendererUtils = new CommonRendererUtilsClass(hexMapData, tileData, cameraData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
        this.canvas = canvas
    }

    draw = (drawctx, spriteReference) => {

        let spriteObject = this.unitData.unitList[spriteReference.id]

        switch(spriteObject.state.current.type) {
            case 'static':
                this.drawStaticUnit(drawctx, spriteReference)
                return
            case 'action':
                this.drawActionUnit(drawctx, spriteReference, spriteObject)
                return
            case 'moving':
                this.drawMovingUnit(drawctx, spriteReference, spriteObject)
                return
        }

    }

    drawStaticShadow = (drawctx, spriteReference) => {

        let spriteObject = this.unitData.unitList[spriteReference.id]

        if (!spriteObject.shadowImages || spriteObject.shadowImages.length == 0) return

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }
        let sprite = spriteObject.imageObject

        let tileHeight = spriteReference.height

        let shadowSize

        let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, tileHeight, this.cameraDataData.rotation)


        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2


        if (this.cameraDataData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            spriteObject.shadowImages[this.cameraDataData.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

    drawShadow = (drawctx, spriteReference) => {

        let spriteObject = this.unitData.unitList[spriteReference.id]

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
            let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / spriteObject.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraDataData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.destination.q,
                    r: spriteObject.destination.r
                }
            }
        }

        let shadowSize
        let tileHeight = this.tileData.getEntry(closestTile.q, closestTile.r).height

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, tileHeight, this.cameraDataData.rotation)

        shadowSize = {
            width: this.hexMapData.size * 2 * sprite.shadowSize.width,
            height: this.hexMapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.hexMapData.size + sprite.shadowOffset.x * this.hexMapData.size * 2
        shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.shadowOffset.y * this.hexMapData.size * 2

        if (this.cameraDataData.onScreenCheck(shadowPos, shadowSize) == false) return

        let shadowImage = sprite.shadowImages[this.cameraDataData.rotation]

        shadowImage = this.rendererUtils.cropStructureShadow(shadowImage, sprite.shadowSize, sprite.shadowOffset, pos, this.tileData.rotatedMapList[this.cameraDataData.rotation])

        drawctx.drawImage(
            shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )

    }

    drawStaticUnit = (drawctx, spriteReference) => {

        let spriteObject = this.unitData.unitList[spriteReference.id]

        let keyObj = {
            q: spriteReference.q,
            r: spriteReference.r
        }

        let sprite = spriteObject.imageObject

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, spriteReference.height, this.cameraDataData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.frame][this.cameraDataData.rotation],
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

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraDataData.rotation)

        let spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return

        let spriteImage = spriteObject.images

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
            let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / spriteObject.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraDataData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.destination.q,
                    r: spriteObject.destination.r
                }
            }

            //set height
            let newHeight = this.tileData.getEntry(spriteObject.destination.q, spriteObject.destination.r).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * spriteObject.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }


        let sprite = spriteObject.imageObject

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraDataData.rotation)

        spriteSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        spritePos.x -= this.hexMapData.size + sprite.spriteOffset.x * this.hexMapData.size * 2
        spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + sprite.spriteOffset.y * this.hexMapData.size * 2

        if (this.cameraDataData.onScreenCheck(spritePos, spriteSize) == false) return

        let spriteImage = spriteObject.images

        drawctx.drawImage(
            spriteImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

}