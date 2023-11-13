import ProjectileRendererClass from "./ProjectileRenderer"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.unitData = hexMapData.unitData
        this.data = hexMapData.projectileData
        this.renderer = new ProjectileRendererClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    update = () => {
        for (let projectile of this.data.projectileList) {
            projectile.setFrame()
            projectile.updatePath()
            if(projectile.state.current === projectile.state.destroy){
                let targetUnit = this.unitData.getUnit(projectile.target)
                if(targetUnit === null){
                    this.mapData.resetState()
                    this.selectionData.clearAllSelections()
                }
                this.data.deleteProjectile(projectile.loc)
            } 
        }
    }

    render = () => {
        for (let projectile of this.data.projectileList) {
            this.renderer.render(projectile)
        }
    }

}