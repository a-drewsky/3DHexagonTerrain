import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class UnitViewClass {

    constructor(hexMapData) {
        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.unitData = hexMapData.unitData
        this.cameraData = hexMapData.cameraData
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    draw = (drawctx, unit) => {

        switch (unit.state.current.type) {
            case 'static':
                this.drawStaticUnit(drawctx, unit)
                return
            case 'action':
                this.drawActionUnit(drawctx, unit)
                return
        }

    }

    drawShadow = (drawctx, unit) => {

        switch (unit.state.current.type) {
            case 'static':
                this.drawStaticShadow(drawctx, unit)
                return
            case 'action':
                this.drawActionShadow(drawctx, unit)
                return
        }


    }

    drawSilhouette = (drawctx, unit) => {
        let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)
        if(!this.tileData.hasTileEntry(unit.position)) return
        let tileObj = this.tileData.getEntry(unit.position)
        let sprite = unit.imageObject
        let height = tileObj.height

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)

        let spriteSize = {
            width: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.w, 
            height: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.globalAlpha = 0.4
        drawctx.drawImage(
            unit.staticImages[unit.frame][this.cameraData.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
        drawctx.globalAlpha = 1
    }

    drawStaticUnit = (drawctx, unit) => {

        let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)
        let tileObj = this.tileData.getEntry(unit.position)
        let sprite = unit.imageObject

        let spriteSize = {
            width: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.w,
            height: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.h
        }

        let spritePos = this.tileData.hexPositionToXYPosition(keyObj, tileObj.height, this.cameraData.rotation)
        spritePos.x -= this.mapData.size + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            unit.staticImages[unit.frame][this.cameraData.rotation],
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )

    }

    drawStaticShadow = (drawctx, unit) => {
        if (this.commonUtils.checkShadowImages(unit) == false) return

        let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)
        let height = this.tileData.getEntry(unit.position).height

        let shadowImage = unit.shadowImageObject[this.cameraData.rotation]
        
        let shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }

        let shadowPos = this.tileData.hexPositionToXYPosition(keyObj, height, this.cameraData.rotation)
        shadowPos.x -= this.mapData.size + shadowImage.offset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + shadowImage.offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            unit.shadowImages[this.cameraData.rotation],
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

    //rename to drawActionSprite
    drawActionUnit = (drawctx, unit) => {

        let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)
        let sprite = unit.imageObject
        let height = this.tileData.getEntry(unit.position).height

        let pos = {
            q: keyObj.q,
            r: keyObj.r
        }


        if (unit.destination != null) {
            
            let percent = unit.travelPercent()
            let lerpPos = this.commonUtils.getLerpPos(unit.position, unit.destination, percent)
            pos = this.commonUtils.rotateTile(lerpPos, this.cameraData.rotation)

            let newHeight = this.tileData.getEntry(unit.destination).height

            if (newHeight != height) {
                let extraHeight = Math.sin(percent * Math.PI) * unit.jumpAmount

                height = height + (newHeight - height) * percent + extraHeight
            }
        }

        let spriteSize

        let spritePos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        spriteSize = {
            width: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.w,
            height: this.mapData.size * 2 * sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].size.h
        }

        spritePos.x -= this.mapData.size + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.x * this.mapData.size * 2
        spritePos.y -= (this.mapData.size * this.mapData.squish) + sprite[unit.curState()].images[unit.frame][this.cameraData.rotation].offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(spritePos, spriteSize) == false) return
        drawctx.drawImage(
            unit.actionImage,
            spritePos.x,
            spritePos.y,
            spriteSize.width,
            spriteSize.height
        )
    }

    drawActionShadow = (drawctx, unit) => {
        if (this.commonUtils.checkShadowImages(unit) == false) return

        let keyObj = this.commonUtils.rotateTile(unit.position, this.cameraData.rotation)

        let shadowImage = unit.shadowImageObject[this.cameraData.rotation]

        let pos = {
            q: keyObj.q,
            r: keyObj.r
        }

        let closestTile = {
            q: unit.position.q,
            r: unit.position.r
        }

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
        }

        let shadowSize
        let height = this.tileData.getEntry(closestTile).height

        let shadowPos = this.tileData.hexPositionToXYPosition(pos, height, this.cameraData.rotation)

        shadowSize = {
            width: this.mapData.size * 2 * shadowImage.size.w,
            height: this.mapData.size * 2 * shadowImage.size.h
        }

        shadowPos.x -= this.mapData.size + shadowImage.offset.x * this.mapData.size * 2
        shadowPos.y -= (this.mapData.size * this.mapData.squish) + shadowImage.offset.y * this.mapData.size * 2

        if (this.cameraData.onScreenCheck(shadowPos, shadowSize) == false) return
        drawctx.drawImage(
            unit.shadowImage,
            shadowPos.x,
            shadowPos.y,
            shadowSize.width,
            shadowSize.height
        )
    }

}