
import SpriteObjectClass from "../../SpriteObject"

export default class StructureClass extends SpriteObjectClass {

    constructor(pos, type, config, stateObj, initState, imageObject, shadowImageObject) {

        super(type, config.id, stateObj, initState, pos, config.height, imageObject, shadowImageObject)

        this.images = []
        this.shadowImages = []

        if (config.rotation) this.rotation = config.rotation

        this.prerender = false
    }

}