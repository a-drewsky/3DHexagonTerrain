export default class StructureClass {

    constructor(pos, type, config, images) {
        this.position = { ...pos }
        this.rotation = null
        this.frame = 0

        this.images = []
        this.shadowImages = []

        this.id = config.id
        this.height = config.height
        if (config.rotation !== undefined) this.rotation = config.rotation

        this.imageObject = images.structures[type][config.sprite]
        this.shadowImageObject = images.shadows[this.imageObject.shadow]

        this.render = true
        this.prerender = false
    }

    curState = () => {
        return this.state.current.name
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

    sprite = (cameraRotation) => {
        return this.imageObject[this.curState()].images[this.frame][this.spriteRotation(cameraRotation)]
    }

}