import UnitManagerClass from "./UnitManager"
import StructureManagerClass from "./StructureManager"
import ProjectileManagerClass from "./ProjectileManager"

export default class SpriteObjectManagerClass{

    constructor(gameData, images){
        this.structures = new StructureManagerClass(gameData, images)
        this.units = new UnitManagerClass(gameData, images)
        this.projectiles = new ProjectileManagerClass(gameData, images)
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