import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitViewClass {

    constructor(hexMapData, images, canvas) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.unitData = hexMapData.unitData
        this.cameraData = hexMapData.cameraData
        this.images = images
        this.canvas = canvas
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    draw = (drawctx, spriteObject) => {

        switch (spriteObject.state.current.type) {
            case 'static':
                this.drawStaticUnit(drawctx, spriteObject)
                return
            case 'action':
                this.drawActionUnit(drawctx, spriteObject)
                return
        }

    }

    drawShadow = (drawctx, spriteObject) => {

        switch (spriteObject.state.current.type) {
            case 'static':
                this.drawStaticShadow(drawctx, spriteObject)
                return
            case 'action':
                this.drawActionShadow(drawctx, spriteObject)
                return
        }


    }

    drawSilhouette = (drawctx, spriteObject) => {
        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let tileObj = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r)
        if(!tileObj) return
        let sprite = spriteObject.imageObject
        let height = tileObj.height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.w, 
            height: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.globalAlpha = 0.4
        drawctx.drawImage(
            spriteObject.images[spriteObject.frame][this.cameraData.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
        drawctx.globalAlpha = 1
    }

    drawStaticUnit = (drawctx, spriteObject) => {

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let tileObj = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r)
        if(!tileObj) return
        let sprite = spriteObject.imageObject
        let height = tileObj.height

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.w,
            height: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images[spriteObject.frame][this.cameraData.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawStaticShadow = (drawctx, spriteObject) => {
        if (this.commonUtils.checkShadowImages(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let shadowSize

        let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)


        shadowSize = {
            width: this.mapData.size * 2 * sprite.shadowSize.width,
            height: this.mapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2


        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            spriteObject.shadowImages[this.cameraData.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

    //rename to drawActionSprite
    drawActionUnit = (drawctx, spriteObject) => {

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject
        let height = this.tileData.getEntry(spriteObject.position.q, spriteObject.position.r).height

        let pos = {
            q: keyObj.q,
            r: keyObj.r
        }


        if (spriteObject.destination != null) {
            //set pos
            let point1 = spriteObject.position
            let point2 = spriteObject.destination
            let percent = (spriteObject.destinationCurTime - spriteObject.destinationStartTime) / spriteObject.travelTime
            let lerpPos = {
                q: point1.q + (point2.q - point1.q) * percent,
                r: point1.r + (point2.r - point1.r) * percent
            }
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)

            //set height
            let newHeight = this.tileData.getEntry(spriteObject.destination.q, spriteObject.destination.r).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * spriteObject.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.w,
            height: this.mapData.size * 2 * sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[spriteObject.state.current.name].images[spriteObject.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            spriteObject.images,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

    drawActionShadow = (drawctx, spriteObject) => {
        if (this.commonUtils.checkShadowImages(spriteObject) == false) return

        let keyObj = this.commonUtils.rotateTile(spriteObject.position.q, spriteObject.position.r, this.cameraData.rotation)
        let sprite = spriteObject.imageObject

        let pos = {
            q: keyObj.q,
            r: keyObj.r
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
            pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.cameraData.rotation)
            if (percent > 0.5) {
                closestTile = {
                    q: spriteObject.destination.q,
                    r: spriteObject.destination.r
                }
            }
        }

        let shadowSize
        let height = this.tileData.getEntry(closestTile.q, closestTile.r).height

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        shadowSize = {
            width: this.mapData.size * 2 * sprite.shadowSize.width,
            height: this.mapData.size * 2 * sprite.shadowSize.height
        }

        shadowPos.x -= this.mapData.size + sprite.shadowOffset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + sprite.shadowOffset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            spriteObject.shadowImages,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

}