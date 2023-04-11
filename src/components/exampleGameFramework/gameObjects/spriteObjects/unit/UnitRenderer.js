import HexMapRendererUtilsClass from "../../commonUtils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../../commonUtils/HexMapCommonUtils"

export default class UnitRendererClass {

    constructor(unitData, hexMapData, tileData, camera, settings, images){
        this.unitData = unitData
        this.hexMapData = hexMapData
        this.tileData = tileData
        this.camera = camera

        this.utils = new HexMapRendererUtilsClass(hexMapData, tileData, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()
    }

    render = (unit) => {

        let initRotation = this.camera.rotation

        for (let i = 0; i < unit.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    let spriteRotation = unit.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = unit.canvasSize.width
                    tempCanvas.height = unit.canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(unit.imageObject.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    tempCanvas = this.utils.addHealthBar(tempCanvas, unit.imageObject.spriteSize, unit)

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
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.camera.rotation)


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

            this.camera.rotation = i;
            let rotatedMap = this.tileData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(unit.position.q, unit.position.r, this.camera.rotation)

            for (let j = 0; j < unit.imageObject.idle.images.length; j++) {
                let croppedImage = this.utils.cropOutTiles(unit.images[j][i], unit.imageObject.spriteSize, unit.imageObject.spriteOffset, keyObj, rotatedMap)
                let darkenedImage = this.utils.darkenSprite(croppedImage, unit)
                unit.images[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation

    }

}