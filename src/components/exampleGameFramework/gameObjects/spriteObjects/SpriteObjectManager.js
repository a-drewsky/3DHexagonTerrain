import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, tileData, camera, images, canvas, settings, uiController, globalState){
        this.structures = new StructureManagerClass(hexMapData, tileData, camera, images, settings)
        this.units = new UnitManagerClass(hexMapData, tileData, camera, images, settings, uiController, globalState)
        this.view = new SpriteObjectViewClass(hexMapData, tileData, this.units.data, this.structures.data, camera, images, canvas, settings)
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