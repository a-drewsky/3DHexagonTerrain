

export default class StatusBarRendererClass {

    constructor(mapData, images){
        this.mapData = mapData
        this.images = images
    }    

    addHealthBar = (spriteCanvas, spriteObject) => {
        if (spriteObject.health === 100) return

        let tempctx = spriteCanvas.getContext('2d')

        let healthBarIndex = 10 - Math.floor(spriteObject.health / spriteObject.stats['max_health'] * 10)

        let healthBarSprite = this.images.ui.healthbar

        let healthbarSpriteSize = {
            width: this.mapData.size * 2 * healthBarSprite.spriteSize.width,
            height: this.mapData.size * 2 * healthBarSprite.spriteSize.height
        }

        let healthbarPos = {
            x: spriteCanvas.width / 2 - healthbarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(healthBarSprite.images[healthBarIndex], healthbarPos.x, healthbarPos.y, healthbarSpriteSize.width, healthbarSpriteSize.height)

    }

    addResourceBar = (spriteCanvas, spriteObject) => {

        if (spriteObject.resources === spriteObject.stats['max_resources']) return spriteCanvas

        let tempctx = spriteCanvas.getContext('2d')

        let resourceBarIndex = 10 - Math.floor(spriteObject.resources / spriteObject.stats['max_resources'] * 10)

        let resourceBarSprite = this.images.ui.resourcebar

        let resourcebarSpriteSize = {
            width: this.mapData.size * 2 * resourceBarSprite.spriteSize.width,
            height: this.mapData.size * 2 * resourceBarSprite.spriteSize.height
        }

        let resourcebarPos = {
            x: spriteCanvas.width / 2 - resourcebarSpriteSize.width / 2,
            y: 0
        }

        tempctx.drawImage(resourceBarSprite.images[resourceBarIndex], resourcebarPos.x, resourcebarPos.y, resourcebarSpriteSize.width, resourcebarSpriteSize.height)

    }

}