import ProjectileRendererClass from "../renderers/ProjectileRenderer"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"
import AbilityInterfaceClass from "./AbilityInterface"

export default class ProjectileManagerClass {

    constructor(gameData, images) {
        this.data = gameData.projectileData
        this.mapData = gameData.mapData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData
        this.renderer = new ProjectileRendererClass(gameData, images)
        this.commonUtils = new CommonHexMapUtilsClass()

        this.abilityInterface = new AbilityInterfaceClass(gameData)
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
        
        this.abilityInterface.executeAbility(projectile.abilityId, projectile.target, projectile.sender)
        
        this.data.deleteProjectile(projectile.loc)
        this.mapData.resetState()

    }

    render = () => {
        for (let projectile of this.data.projectileList) {
            this.renderer.render(projectile)
        }
    }

}