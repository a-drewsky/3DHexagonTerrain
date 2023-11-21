
import SpriteObjectClass from "../SpriteObject"

export default class StructureClass extends SpriteObjectClass {

    constructor(pos, type, config, stateObj, initState, images) {

        super(type, config.id, stateObj, initState, pos, config.height, images.structures[type][config.sprite], images.shadows[config.shadow])

        this.images = []
        this.shadowImages = []

        if (config.rotation !== undefined) this.rotation = config.rotation

        this.prerender = false
    }

}