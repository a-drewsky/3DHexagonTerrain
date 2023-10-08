import ProjectileRendererClass from "./ProjectileRenderer"
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.data = hexMapData.projectileData
        this.renderer = new ProjectileRendererClass(hexMapData, images)
        this.commonUtils = new CommonHexMapUtilsClass()
    }

    update = () => {
        for (let projectile of this.data.projectileList) {
            projectile.setFrame()
            projectile.updatePath()
            if(projectile.state.current == projectile.state.destroy) this.data.deleteProjectile(projectile.loc)
        }
    }

    render = () => {
        for (let projectile of this.data.projectileList) {
            this.renderer.render(projectile)
        }
    }

}