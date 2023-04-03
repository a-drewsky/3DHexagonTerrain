import HexMapViewUtilsClass from "../hexMap/utils/HexMapViewUtils"

export default class UnitViewClass {

    // constructor(camera){
    //     this.viewUtils = new HexMapViewUtilsClass(camera)
    // }

    // draw = (drawctx) => {

    //     if (this.state.current.type == 'moving') {
    //         this.drawMovingSprite(drawctx)
    //         return
    //     }

    //     if (this.state.current.type == 'action') {
    //         this.drawActionSprite(drawctx)
    //         return
    //     }

    //     this.drawStaticSprite(drawctx)

    // }

    // drawStaticShadow = (drawctx) => {

    //     if (!this.shadowImages || this.shadowImages.length == 0) return

    //     let tile = this.hexMapData.getEntry(this.position.q, this.position.r)
    //     // let sprite = this.images[this.type][this.sprite] this.imgObj

    //     let shadowSize

    //     let shadowPos = this.hexMapData.hexPositionToXYPosition(tile.position, tile.height, this.camera.rotation)


    //     shadowSize = {
    //         width: this.hexMapData.size * 2 * this.imgObj.shadowSize.width,
    //         height: this.hexMapData.size * 2 * this.imgObj.shadowSize.height
    //     }

    //     shadowPos.x -= this.hexMapData.size + this.imgObj.shadowOffset.x * this.hexMapData.size * 2
    //     shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.imgObj.shadowOffset.y * this.hexMapData.size * 2


    //     if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return // canvasDims should be in common util not passed
    //     drawctx.drawImage(
    //         this.shadowImages[this.camera.rotation],
    //         shadowPos.x,
    //         shadowPos.y,
    //         shadowSize.width,
    //         shadowSize.height
    //     )
    // }

    // drawShadow = (drawctx) => {

    //     if (this.destination == null) {
    //         this.drawStaticShadow(drawctx)
    //         return
    //     }

    //     let pos = this.commonUtils.rotateTile(this.position.q, this.position.r, this.camera.rotation)

    //     if (!this.imgObj.shadowImages) return

    //     let closestTile = {
    //         q: this.position.q,
    //         r: this.position.r
    //     }

    //     if (this.destination != null) {
    //         let point1 = this.position
    //         let point2 = this.destination
    //         let percent = (this.destinationCurTime - this.destinationStartTime) / this.travelTime
    //         let lerpPos = {
    //             q: point1.q + (point2.q - point1.q) * percent,
    //             r: point1.r + (point2.r - point1.r) * percent
    //         }
    //         pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
    //         if (percent > 0.5) {
    //             closestTile = {
    //                 q: this.destination.q,
    //                 r: this.destination.r
    //             }
    //         }
    //     }

    //     let shadowSize
    //     let tile = this.hexMapData.getEntry(closestTile.q, closestTile.r)

    //     let shadowPos = this.hexMapData.hexPositionToXYPosition(pos, tile.height, this.camera.rotation)

    //     shadowSize = {
    //         width: this.hexMapData.size * 2 * this.imgObj.shadowSize.width,
    //         height: this.hexMapData.size * 2 * this.imgObj.shadowSize.height
    //     }

    //     shadowPos.x -= this.hexMapData.size + this.imgObj.shadowOffset.x * this.hexMapData.size * 2
    //     shadowPos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.imgObj.shadowOffset.y * this.hexMapData.size * 2

    //     if (this.viewUtils.onScreenCheck(shadowPos, shadowSize, this.canvasDims) == false) return

    //     let shadowImage = this.imgObj.shadowImages[this.camera.rotation]

    //     shadowImage = this.rendererUtils.cropStructureShadow(shadowImage, this.imgObj.shadowSize, this.imgObj.shadowOffset, pos, this.hexMapData.rotatedMapList[this.camera.rotation])

    //     drawctx.drawImage(
    //         shadowImage,
    //         shadowPos.x,
    //         shadowPos.y,
    //         shadowSize.width,
    //         shadowSize.height
    //     )

    // }

    // drawStaticSprite = (drawctx) => {

    //     let tile = this.hexMapData.getEntry(this.position.q, this.position.r)

    //     let spriteSize

    //     let spritePos = this.hexMapData.hexPositionToXYPosition(tile.position, tile.height, this.camera.rotation)

    //     spriteSize = {
    //         width: this.hexMapData.size * 2 * this.imageObject.spriteSize.width,
    //         height: this.hexMapData.size * 2 * this.imageObject.spriteSize.height
    //     }

    //     spritePos.x -= this.hexMapData.size + this.imageObject.spriteOffset.x * this.hexMapData.size * 2
    //     spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.imageObject.spriteOffset.y * this.hexMapData.size * 2

    //     if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return
    //     drawctx.drawImage(
    //         this.images[this.frame][this.camera.rotation],
    //         spritePos.x,
    //         spritePos.y,
    //         spriteSize.width,
    //         spriteSize.height
    //     )

    // }

    // drawActionSprite = (drawctx) => {

    //     let tile = this.hexMapData.getEntry(this.position.q, this.position.r)

    //     let spritePos = this.hexMapData.hexPositionToXYPosition(tile.position, tile.height, this.camera.rotation)

    //     let spriteSize = {
    //         width: this.hexMapData.size * 2 * this.imageObj.spriteSize.width,
    //         height: this.hexMapData.size * 2 * this.imageObj.spriteSize.height
    //     }

    //     spritePos.x -= this.hexMapData.size + this.imageObj.spriteOffset.x * this.hexMapData.size * 2
    //     spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.imageObj.spriteOffset.y * this.hexMapData.size * 2

    //     if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

    //     let spriteRotation = this.rotation + this.camera.rotation

    //     if (this.camera.rotation % 2 == 1) spriteRotation--

    //     if (spriteRotation > 11) spriteRotation -= 12

    //     let spriteImage = this.imageObj[this.state].images[this.frame][spriteRotation]

    //     //SHOULD BE HANDLED BY RENDERER
    //     spriteImage = this.rendererUtils.addHealthBar(spriteImage, this.imageObj.spriteSize)
    //     spriteImage = this.rendererUtils.cropOutTiles(spriteImage, this.imageObj.spriteSize, this.imageObj.spriteOffset, tile.position, this.hexMapData.rotatedMapList[this.camera.rotation])
    //     spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, tile.position, tile.height)
    //     drawctx.drawImage(
    //         spriteImage,
    //         spritePos.x,
    //         spritePos.y,
    //         spriteSize.width,
    //         spriteSize.height
    //     )

    // }

    // drawMovingSprite = (drawctx) => {

    //     let pos = this.commonUtils.rotateTile(this.position.q, this.position.r, this.camera.rotation)

    //     let tile = this.hexMapData.getEntry(this.position.q, this.position.r)

    //     let height = tile.height

    //     if (this.destination != null) {
    //         //set pos
    //         let point1 = this.position
    //         let point2 = this.destination
    //         let percent = (this.destinationCurTime - this.destinationStartTime) / this.travelTime
    //         let lerpPos = {
    //             q: point1.q + (point2.q - point1.q) * percent,
    //             r: point1.r + (point2.r - point1.r) * percent
    //         }
    //         pos = this.commonUtils.rotateTile(lerpPos.q, lerpPos.r, this.camera.rotation)
    //         if (percent > 0.5) {
    //             tile = this.hexMapData.getEntry(this.destination.q, this.destination.r)
    //         }

    //         //set height
    //         let newHeight = tile.height

    //         if (newHeight != height) {
    //             let extraHeight = Math.sin(percent * Math.PI) * this.jumpAmount

    //             height = height + (newHeight - height) * percent + extraHeight
    //         }
    //     }

    //     let spriteSize

    //     let spritePos = this.hexMapData.hexPositionToXYPosition(tile.position, tile.height, this.camera.rotation)

    //     spriteSize = {
    //         width: this.hexMapData.size * 2 * this.imgObj.spriteSize.width,
    //         height: this.hexMapData.size * 2 * this.imgObj.spriteSize.height
    //     }

    //     spritePos.x -= this.hexMapData.size + this.imgObj.spriteOffset.x * this.hexMapData.size * 2
    //     spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + this.imgObj.spriteOffset.y * this.hexMapData.size * 2

    //     if (this.viewUtils.onScreenCheck(spritePos, spriteSize, this.canvasDims) == false) return

    //     let spriteRotation = this.rotation + this.camera.rotation

    //     if (this.camera.rotation % 2 == 1) spriteRotation--

    //     if (spriteRotation > 11) spriteRotation -= 12

    //     let spriteImage = this.imgObj[this.state].images[this.frame][spriteRotation]

    //     spriteImage = this.rendererUtils.cropOutTilesJump(spriteImage, this.imgObj.spriteSize, this.imgObj.spriteOffset, tile.position, this.hexMapData.rotatedMapList[this.camera.rotation], tile.height)
    //     spriteImage = this.rendererUtils.darkenSpriteJump(spriteImage, this, tile, tile.height)

    //     drawctx.drawImage(
    //         spriteImage,
    //         spritePos.x,
    //         spritePos.y,
    //         spriteSize.width,
    //         spriteSize.height
    //     )
    // }

}