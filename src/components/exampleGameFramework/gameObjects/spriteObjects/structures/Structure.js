export default class StructureClass {

    constructor(pos, config, hexMapData, images) {
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.rotation = 1

        this.images = []
        this.shadowImages = []

        this.id = config.id
        this.sprite = config.sprite
        this.height = config.height
        if (config.rotation) this.rotation = config.rotation

        this.imageObject = images[config.sprite]
        this.hexMapData = hexMapData
        this.canvasSize = {
            width: hexMapData.size * 2 * this.imageObject.spriteSize.width,
            height: hexMapData.size * 2 * this.imageObject.spriteSize.height
        }

        this.render = true
        this.prerender = false
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation
        if (cameraRotation % 2 == 1) spriteRotation--
        if (spriteRotation > 11) spriteRotation -= 12
        return spriteRotation
    }

}