export default class StructureClass {

    constructor(pos, config, hexMapData, images) {
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.rotation = 1

        this.images = []
        this.shadowImages = []

        this.name = config.name
        this.sprite = config.sprite
        this.height = config.height
        if (config.stats) this.stats = config.stats
        if (config.rotation) this.rotation = config.rotation

        this.imageObject = images[config.sprite]
        this.canvasSize = {
            width: hexMapData.size * 2 * this.imageObject.spriteSize.width,
            height: hexMapData.size * 2 * this.imageObject.spriteSize.height
        }

        this.render = true
        this.prerender = false
    }

}