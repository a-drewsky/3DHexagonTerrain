import ProjectileClass from "./Projectile"

export default class ProjectileDataClass {

    constructor(tileData, images){
        this.tileData = tileData
        this.images = images

        this.projectileList = []

    }

    newProjectile = (projectileId, pos, target) => {
        let newProjectile = new ProjectileClass(this.projectileList.length, pos, target, projectileId, this.tileData, this.images)
        this.projectileList.push(newProjectile)
        return newProjectile
    }

    deleteProjectile = (projectileLoc) => {
        if(projectileLoc >= this.projectileList.length || projectileLoc < 0) {
            console.warn(`Attempted to delete projectile out of range - loc: ${projectileLoc}, length: ${this.projectileList.length}`)
            return
        }
        this.projectileList.splice(projectileLoc, 1)
    }

}