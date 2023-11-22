import UnitManagerClass from "./unit/UnitManager"
import StructureManagerClass from "./structures/StructureManager"
import ProjectileManagerClass from "./projectile/ProjectileManager"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, images, uiController){
        this.structures = new StructureManagerClass(hexMapData, images, uiController)
        this.units = new UnitManagerClass(hexMapData, images)
        this.projectiles = new ProjectileManagerClass(hexMapData, images)
    }

    update = () => {
        this.units.update()
        this.projectiles.update()
        this.structures.update()
        
        this.render()
    }

    render = () => {
        this.units.render()
        this.structures.render()
        this.projectiles.render()
    }

}