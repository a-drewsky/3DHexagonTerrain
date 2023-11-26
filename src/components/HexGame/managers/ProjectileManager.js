import ProjectileRendererClass from "../renderers/ProjectileRenderer"
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils"

export default class ProjectileManagerClass {

    constructor(hexMapData, images) {
        this.data = hexMapData.projectileData
        this.mapData = hexMapData.mapData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData
        this.renderer = new ProjectileRendererClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    update = () => {
        for (let projectile of this.data.projectileList) {
            this.updateProjectile(projectile)
        }
        if(this.data.projectileList.length > 0) this.mapData.setState('animation')
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