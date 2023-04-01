import HexMapCommonUtilsClass from "../../utils/HexMapCommonUtils"

export default class HexMapRendererSpritesStructuresClass{

    constructor(hexMapData, camera, images, utils){
        this.hexMapData = hexMapData
        this.camera = camera
        this.images = images
        this.utils = utils
        this.commonUtils = new HexMapCommonUtilsClass()
    }

    render = (terrainObject) => {

        let initRotation = this.camera.rotation

        let sprite = this.images[terrainObject.type][terrainObject.sprite]

        let canvasSize = {
            width: this.hexMapData.size * 2 * sprite.spriteSize.width,
            height: this.hexMapData.size * 2 * sprite.spriteSize.height
        }


        let imageList = []

        if (terrainObject.type == 'base' || terrainObject.type == 'resource' || terrainObject.type == 'prop' || terrainObject.type == 'flag') {


            for (let i = 0; i < sprite[terrainObject.state].images.length; i++) {
                let imageList = []
                for (let rotation = 0; rotation < 12; rotation++) {
                    if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                        let spriteRotation = terrainObject.rotation + rotation
                        if (rotation % 2 == 1) spriteRotation--
                        if (spriteRotation > 11) spriteRotation -= 12

                        //create canvas
                        let tempCanvas = document.createElement('canvas')
                        tempCanvas.width = canvasSize.width
                        tempCanvas.height = canvasSize.height
                        let tempctx = tempCanvas.getContext('2d')

                        tempctx.drawImage(sprite[terrainObject.state].images[i][spriteRotation], 0, 0, tempCanvas.width, tempCanvas.height)

                        if (terrainObject.type == 'resource') {
                            tempCanvas = this.utils.addResourceBar(tempCanvas, sprite.spriteSize, terrainObject)
                        }

                        if (terrainObject.type == 'base') {
                            tempCanvas = this.utils.addHealthBar(tempCanvas, sprite.spriteSize, terrainObject)
                        }

                        imageList[rotation] = tempCanvas

                    } else {
                        imageList[rotation] = null
                    }
                }

                terrainObject.images[i] = imageList
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

                    tempctx.drawImage(sprite.images[terrainObject.state][rotation], 0, 0, tempCanvas.width, tempCanvas.height)

                    if (terrainObject.type == 'resource') {
                        tempCanvas = this.utils.addResourceBar(tempCanvas, sprite.spriteSize, terrainObject)
                    }

                    if (terrainObject.type == 'base') {
                        tempCanvas = this.utils.addHealthBar(tempCanvas, sprite.spriteSize, terrainObject)
                    }

                    imageList[rotation] = tempCanvas

                } else {
                    imageList[rotation] = null
                }
            }
            terrainObject.images[0] = imageList
        }


        //prerender shadow images
        if (sprite.shadowImages) {
            let imageList = []
            for (let rotation = 0; rotation < 12; rotation++) {
                if ((rotation - this.camera.initCameraRotation) % this.camera.rotationAmount == 0) {

                    this.camera.rotation = rotation;
                    let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
                    let keyObj = this.commonUtils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)


                    let shadowImage = this.utils.cropStructureShadow(sprite.shadowImages[rotation], sprite.shadowSize, sprite.shadowOffset, keyObj, rotatedMap)

                    imageList[rotation] = shadowImage

                } else {
                    imageList[rotation] = null
                }
            }

            terrainObject.shadowImages[0] = imageList

        }


        //crop and darken
        for (let i = 0; i < terrainObject.images[0].length; i++) {

            if (terrainObject.images[0][i] == null) continue

            this.camera.rotation = i;
            let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]
            let keyObj = this.commonUtils.rotateTile(terrainObject.position.q, terrainObject.position.r, this.camera.rotation)

            let croppedImage = this.utils.cropOutTiles(terrainObject.images[0][i], sprite.spriteSize, sprite.spriteOffset, keyObj, rotatedMap)
            let darkenedImage = this.utils.darkenSprite(croppedImage, terrainObject)
            terrainObject.images[0][i] = darkenedImage

        }

        this.camera.rotation = initRotation
    }

}