import HexMapRendererUtilsClass from "../commonUtils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../commonUtils/HexMapCommonUtils"

export default class UnitRendererClass {

    constructor(data, hexMapData, tileManager, camera, settings, images){
        this.data = data
        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.camera = camera

        this.utils = new HexMapRendererUtilsClass(hexMapData, tileManager, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()
    }

    render = () => {

        let initRotation = this.camera.rotation

        for (let i = 0; i < this.data.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    let spriteRotation = this.data.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = this.data.canvasSize.width
                    tempCanvas.height = this.data.canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(this.data.imageObject.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    tempCanvas = this.utils.addHealthBar(tempCanvas, this.data.imageObject.spriteSize, this.data)

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            this.data.images[i] = imageList
        }

        //prerender shadow images
        if (this.data.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.tileManager.rotatedMapList[this.camera.rotation]
                    let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(this.data.imageObject.shadowImages[rotation], this.data.imageObject.shadowSize, this.data.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            this.data.shadowImages = imageList

        }



        //crop and darken
        for (let i = 0; i < this.data.images[0].length; i++) {
            if (this.data.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.tileManager.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)

            for (let j = 0; j < this.data.imageObject.idle.images.length; j++) {
                let croppedImage = this.utils.cropOutTiles(this.data.images[j][i], this.data.imageObject.spriteSize, this.data.imageObject.spriteOffset, keyObj, rotatedMap)
                let darkenedImage = this.utils.darkenSprite(croppedImage, this.data)
                this.data.images[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation

    }

}