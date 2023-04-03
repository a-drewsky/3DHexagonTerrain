export default class StructureDataClass{

    constructor(pos, config, hexMapData, images){
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.rotation = 1

        this.images = []
        this.shadowImages = []

        this.loadConfig(config, hexMapData, images)
    }

    loadConfig = (config, hexMapData, images) => {
        this.name = config.name
        this.sprite = config.sprite
        this.height = config.height
        if(config.stats) this.stats = config.stats
        if(config.rotation) this.rotation = config.rotation

        console.log(config.sprite, images)
        this.imageObject = images[config.sprite]
        this.canvasSize = {
            width: hexMapData.size * 2 * this.imageObject.spriteSize.width,
            height: hexMapData.size * 2 * this.imageObject.spriteSize.height
         }
    }

}