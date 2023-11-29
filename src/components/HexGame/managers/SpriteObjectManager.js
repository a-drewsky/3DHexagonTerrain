import UnitManagerClass from "./UnitManager"
import StructureManagerClass from "./StructureManager"
import ProjectileManagerClass from "./ProjectileManager"

export default class SpriteObjectManagerClass{

    constructor(gameData, images){
        this.mapData = gameData.mapData
        this.unitData = gameData.unitData
        this.projectileData = gameData.projectileData

        this.structures = new StructureManagerClass(gameData, images)
        this.units = new UnitManagerClass(gameData, images)
        this.projectiles = new ProjectileManagerClass(gameData, images)
    }

    update = () => {
        this.units.update()
        this.projectiles.update()
        this.structures.update()
        
        if (this.mapData.curState() !== 'chooseRotation') {
            if (this.unitData.unitList.some(unit => unit.curState() !== 'idle')) this.mapData.setState('animation')
            if(this.projectileData.projectileList.length > 0) this.mapData.setState('animation')
        }
        
        
        this.render()
    }

    render = () => {
        this.units.render()
        this.structures.render()
        this.projectiles.render()
    }

}