import ProjectileClass from "./Projectile";

export default class ProjectileDataClass {

    constructor(mapData, unitData, tileData, images){
        this.mapData = mapData
        this.unitData = unitData
        this.tileData = tileData
        this.images = images

        this.projectileList = []

    }

    newProjectile = (projectileId, pq, pr, tq, tr) => {

        let newProjectile = new ProjectileClass(this.projectileList.length, {q: pq, r: pr}, {q: tq, r: tr}, projectileId, this.mapData, this.unitData, this.tileData, this.images.projectiles)

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