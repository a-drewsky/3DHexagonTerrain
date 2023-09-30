import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import ProjectileManagerClass from "./projectile/ProjectileManager"
import SpriteObjectViewClass from "./SpriteObjectView"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, images, canvas){
        this.structures = new StructureManagerClass(hexMapData, images)
        this.units = new UnitManagerClass(hexMapData, images)
        this.projectiles = new ProjectileManagerClass(hexMapData, images)

        this.view = new SpriteObjectViewClass(hexMapData, images, canvas)
    }

    update = () => {
        this.units.update()
        this.structures.update()
        this.projectiles.update()
    }

    render = () => {
        this.units.render()
        this.structures.render()
        this.projectiles.render()
    }

}