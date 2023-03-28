export default class BaseUnitRendererClass {

    constructor(hexMapData, camera, imageObject){
        this.hexMapData = hexMapData
        this.camera = camera
        this.imageObject = imageObject
    }

    render = (unitObject) => {

        let initRotation = this.camera.rotation

        let canvasSize = {
            width: this.hexMapData.size * 2 * this.imageObject.spriteSize.width,
            height: this.hexMapData.size * 2 * this.imageObject.spriteSize.height
        }

        for (let i = 0; i < this.imageObject.idle.images.length; i++) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    let spriteRotation = unitObject.rotation + rotation
                    if (rotation % 2 == 1) spriteRotation--
                    if (spriteRotation > 11) spriteRotation -= 12

                    //create canvas
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = canvasSize.width
                    tempCanvas.height = canvasSize.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(this.imageObject.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    tempCanvas = this.utils.addHealthBar(tempCanvas, this.imageObject.spriteSize, unitObject)

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            unitObject.images[i] = imageList
        }

        //prerender shadow images
        if (this.imageObject.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.hexMapData.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(this.imageObject.shadowImages[rotation], this.imageObject.shadowSize, this.imageObject.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            unitObject.shadowImages = imageList

        }


        //crop and darken
        for (let i = 0; i < unitObject.images[0].length; i++) {
            if (unitObject.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.hexMapData.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)

            for (let j = 0; j < this.imageObject.idle.images.length; j++) {
                let croppedImage = this.utils.cropOutTiles(unitObject.images[j][i], this.imageObject.spriteSize, this.imageObject.spriteOffset, keyObj, rotatedMap)
                let darkenedImage = this.utils.darkenSprite(croppedImage, unitObject)
                unitObject.images[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation

    }

}