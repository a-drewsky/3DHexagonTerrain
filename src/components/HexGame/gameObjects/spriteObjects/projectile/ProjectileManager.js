import ProjectileRendererClass from "./ProjectileRenderer"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

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
            projectile.setFrame()
            projectile.updatePath()
            if (projectile.actionComplete) {
                this.end(projectile)
            }
        }
    }

    render = () => {
        for (let projectile of this.data.projectileList) {
            this.renderer.render(projectile)
        }
    }

    end = (projectile) => {
        
        let targetObject = this.unitData.getUnit(projectile.target) || this.structureData.getStructure(projectile.target)
        targetObject.stats.health -= 25

        if(targetObject && targetObject.type === 'unit'){
            targetObject.setAnimation('hit')
            this.mapData.setState('animation')
        } else if(targetObject && targetObject.type === 'bunker') {
            targetObject.updateState()
            this.mapData.resetState()
        }

        this.data.deleteProjectile(projectile.loc)
    }

}