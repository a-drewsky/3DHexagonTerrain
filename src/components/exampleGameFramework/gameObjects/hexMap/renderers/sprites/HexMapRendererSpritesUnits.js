export default class HexMapRendererSpritesUnitsClass {

    constructor(hexMapData, camera, images, utils){
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils
    }

    render = (unitObject) => {

        let initRotation = this.camera.rotation

        let sprite = this.images[unitObject.type][unitObject.sprite]

        let canvasSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }

        for (let i = 0; i < sprite.idle.images.length; i++) {
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

                    tempctx.drawImage(sprite.idle.images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    tempCanvas = this.utils.addHealthBar(tempCanvas, sprite.spriteSize, unitObject)

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }

            unitObject.images[i] = imageList
        }

        //prerender shadow images
        if (sprite.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(sprite.shadowImages[rotation], sprite.shadowSize, sprite.shadowOffset, keyObj, rotatedMap)

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
            let keyObj = this.utils.rotateTile(unitObject.position.q, unitObject.position.r, this.camera.rotation)

            for (let j = 0; j < sprite.idle.images.length; j++) {
                let croppedImage = this.utils.cropOutTiles(unitObject.images[j][i], sprite.spriteSize, sprite.spriteOffset, keyObj, rotatedMap)
                let darkenedImage = this.utils.darkenSprite(croppedImage, unitObject)
                unitObject.images[j][i] = darkenedImage
            }

        }

        this.camera.rotation = initRotation

    }

}