import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, images, canvas){
        this.structures = new StructureManagerClass(hexMapData, images)
        this.units = new UnitManagerClass(hexMapData, images)
        this.view = new SpriteObjectViewClass(hexMapData, images, canvas)
    }

    update = () => {
        this.units.update()
        this.structures.update()
    }

    render = () => {
        this.units.render()
        this.structures.render()
    }

}