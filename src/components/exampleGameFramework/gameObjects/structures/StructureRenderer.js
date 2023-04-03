import HexMapRendererUtilsClass from "../hexMap/utils/HexMapRendererUtils"
import HexMapCommonUtilsClass from "../hexMap/utils/HexMapCommonUtils"

export default class StructureRendererClass{

    constructor(data, hexMapData, camera, settings, images){
        this.data = data
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = new HexMapRendererUtilsClass(hexMapData, camera, settings, images)
        this.commonUtils = new HexMapCommonUtilsClass()
    }

    render = () => {

        console.log(this.data.type)

        let initRotation = this.camera.rotation

        let canvasSize = {
            width: this.hexMapData.size * 2 * this.data.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * this.data.imageObject.spriteSize.height
        }


        let imageList = []

        if (this.data.type == 'bunker' || this.data.type == 'resource' || this.data.type == 'prop' || this.data.type == 'flag') {

            for (let i = 0; i < this.data.imageObject[this.data.state.current.name].images.length; i++) {
                let imageList = []
                for (let rotation = 0; rotation < 12; rotation++) {
                    if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                        let spriteRotation = this.data.rotation + rotation
                        if (rotation % 2 == 1) spriteRotation--
                        if (spriteRotation > 11) spriteRotation -= 12

                        //create canvas
                        let tempCanvas = document.createElement('canvas')
                        tempCanvas.width = canvasSize.width
                        tempCanvas.height = canvasSize.height
                        let tempctx = tempCanvas.getContext('2d')

                        tempctx.drawImage(this.data.imageObject[this.data.state.current.name].images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                        if (this.data.type == 'resource') {
                            tempCanvas = this.utils.addResourceBar(tempCanvas, this.data.imageObject.spriteSize, this.data)
                        }

                        if (this.data.type == 'bunker') {
                            tempCanvas = this.utils.addHealthBar(tempCanvas, this.data.imageObject.spriteSize, this.data)
                        }

                        imageList[rotation] = tempCanvas

                    } else {
                        imageList[rotation] = null
                    }
                }

                this.data.images[i] = imageList
            }
        } else {

            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')
                    console.log(this.data.images)
                    tempctx.drawImage(this.data.images[this.data.state.current.name][rotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    if (this.data.type == 'resource') {
                        tempCanvas = this.utils.addResourceBar(tempCanvas, this.data.imageObject.spriteSize, this.data)
                    }

                    if (this.data.type == 'bunker') {
                        tempCanvas = this.utils.addHealthBar(tempCanvas, this.data.imageObject.spriteSize, this.data)
                    }

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }
            this.data.images[0] = imageList
        }


        //prerender shadow images
        if (this.data.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(this.data.imageObject.shadowImages[rotation], this.data.imageObject.shadowSize, this.data.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            this.data.shadowImages[0] = imageList

        }


        //crop and darken
        for (let i = 0; i < this.data.images[0].length; i++) {

            if (this.data.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(this.data.position.q, this.data.position.r, this.camera.rotation)

            let croppedImage = this.utils.cropOutTiles(this.data.images[0][i], this.data.imageObject.spriteSize, this.data.imageObject.spriteOffset, keyObj, rotatedMap)
            let darkenedImage = this.utils.darkenSprite(croppedImage, this.data)
            this.data.images[0][i] = darkenedImage

        }

        this.camera.rotation = initRotation
    }

}