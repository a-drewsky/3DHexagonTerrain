export default class StructureClass {

    constructor(pos, config, hexMapData, images) {
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.rotation = null

        this.images = []
        this.shadowImages = []

        this.id = config.id
        this.sprite = config.sprite
        this.height = config.height
        if (config.rotation !== undefined) this.rotation = config.rotation

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
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

}