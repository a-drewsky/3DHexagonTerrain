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
                return
            case 'action':
                this.renderActionSprite(unit)
                return
            case 'moving':
                this.renderMovingSprite(unit)
                return
        }

    }

    renderStaticSprites = (unit) => {

        let initRotation = this.cameraData.rotation

        for (let i = 0; i < unit.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount == 0) {

                    let spriteRotation = unit.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = unit.canvasSize.width
                    tempCanvas.height = unit.canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(unit.imageObject.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    this.utils.addHealthBar(tempCanvas, unit)

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            unit.images[i] = imageList
        }

        //prerender shadow images
        if (unit.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.cameraData.initCameraRotation) % this.cameraData.rotationAmount == 0) {

                    this.cameraData.rotation = rotation;
                    let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
                    let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)


                    let shadowImage = this.utils.cropStructureShadow(unit.imageObject.shadowImages[rotation], unit.imageObject.shadowSize, unit.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            unit.shadowImages = imageList

        }



        //crop and darken
        for (let i = 0; i < unit.images[0].length; i++) {
            if (unit.images[0][i] == null) continue

            this.cameraData.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.cameraData.rotation]
            let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.cameraData.rotation)

            for (let j = 0; j < unit.imageObject.idle.images.length; j++) {
                this.utils.cropOutTiles(unit.images[j][i], unit.imageObject.spriteOffset, keyObj, rotatedMap)
                this.utils.darkenSprite(unit.images[j][i], unit)
            }

        }

        this.cameraData.rotation = initRotation
    }

    renderActionSprite = (unit) => {

        console.log("action")

        let sprite = unit.imageObject

        let height = this.tileData.getEntry(unit.position.q, unit.position.r).height

        let spritePos = this.tileData.hexPositionToXYPosition(unit.position, height, this.cameraData.rotation)

        let spriteSize = {
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
        this.utils.cropOutTiles(tempCanvas, sprite.spriteOffset, unit.position, this.tileData.rotatedMapList[this.cameraData.rotation])
        this.utils.darkenSpriteJump(tempCanvas, unit, unit.position, height)
        unit.images = tempCanvas
    }

    renderMovingSprite = (unit) => {

        let pos = {
            q: unit.position.q,
            r: unit.position.r
        }

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

        this.utils.cropOutTilesJump(tempCanvas, sprite.spriteOffset, unit.position, this.tileData.rotatedMapList[this.cameraData.rotation], height)
        this.utils.darkenSpriteJump(tempCanvas, unit, closestTile, height)
        unit.images = tempCanvas
    }

}