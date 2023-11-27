import UnitManagerClass from "./UnitManager"
import StructureManagerClass from "./StructureManager"
import ProjectileManagerClass from "./ProjectileManager"

export default class SpriteObjectManagerClass{

    constructor(hexMapData, images){
        this.structures = new StructureManagerClass(hexMapData, images)
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