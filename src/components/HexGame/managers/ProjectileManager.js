import ProjectileRendererClass from "../renderers/ProjectileRenderer"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class ProjectileManagerClass {

    constructor(gameData, images) {
        this.data = gameData.projectileData
        this.mapData = gameData.mapData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData
        this.renderer = new ProjectileRendererClass(gameData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    update = () => {
        for (let projectile of this.data.projectileList) {
            this.updateProjectile(projectile)
        }
    }

    updateProjectile = (projectile) => {
        projectile.setFrame()
        projectile.updatePath()
        if (projectile.actionComplete) {
            this.endProjectile(projectile)
        }
    }

    endProjectile = (projectile) => {
        
        let targetObject = this.unitData.getUnit(projectile.target) || this.structureData.getStructure(projectile.target)
        targetObject.health -= 25
        
        this.data.deleteProjectile(projectile.loc)

        if(targetObject && targetObject.spriteType === 'unit'){
            targetObject.setAnimation('hit')
        } else if(targetObject && targetObject.spriteType === 'bunker') {
            targetObject.updateState()
            this.mapData.resetState()
        }

    }

    render = () => {
        for (let projectile of this.data.projectileList) {
            this.renderer.render(projectile)
        }
    }

}