import ProjectileConfig from "./ProjectileConfig"

import { TRAVEL_TIME } from "./ProjectileConstants"

import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileClass {

    constructor(loc, pos, target, projectileId, unitData, structureData, tileData, images) {
        if (!ProjectileConfig[projectileId]) throw Error(`Invalid Projectile ID: (${projectileId}). Unit config properties are: [${Object.getOwnPropertyNames(ProjectileConfig).splice(3)}]`)

        console.log(pos, target)

        this.loc = loc

        this.position = { ...pos }

        //static data
        this.id = ProjectileConfig[projectileId].id
        this.type = 'projectile'
        this.name = ProjectileConfig[projectileId].name
        this.description = ProjectileConfig[projectileId].description
        this.height = ProjectileConfig[projectileId].height

        //image data
        this.imageObject = images.projectiles[ProjectileConfig[projectileId].sprite]
        this.shadowImageObject = images.shadows[this.imageObject.shadow]
        this.image = null
        this.shadowImage = null

        //animation data
        this.animation = { 
            rate: ProjectileConfig[projectileId].animation.rate, 
            duration: ProjectileConfig[projectileId].animation.duration, 
            type: ProjectileConfig[projectileId].animation.type
        }
        this.rotation = null
        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()

        //projectile data
        this.actionComplete = false
        this.projectileStartTime = Date.now()
        this.projectileCurTime = Date.now()
        this.target = { ...target }


        //settings
        this.tileTravelTime = TRAVEL_TIME

        //access data
        this.unitData = unitData
        this.structureData = structureData
        this.tileData = tileData
        this.commonUtils = new CommonHexMapUtilsClass()

        this.setRotation()
    }


    //HELPER FUNCTIONS
    sprite = (cameraRotation) => {
        return this.imageObject['default'].images[this.frame][this.spriteRotation(cameraRotation)]
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation * 2
        if (spriteRotation >= 12) spriteRotation -= 12
        return spriteRotation
    }

    travelTime = () => {
        let nearestPos = this.nearestPosition()
        let travelLength = this.commonUtils.getDistance(nearestPos, this.target)
        return this.tileTravelTime * travelLength
    }

    travelPercent = () => {
        return (this.projectileCurTime - this.projectileStartTime) / this.travelTime()
    }

    nearestPosition = () => {
        return this.commonUtils.roundToNearestHex(this.position)
    }

    spriteHeight = () => {
        let nearestPos = this.nearestPosition()
        let posHeight = this.tileData.getEntry(nearestPos).height
        let targetHeight = this.tileData.getEntry(this.target).height
        return posHeight + (targetHeight - posHeight) * this.travelPercent() + this.height
    }

    shadowHeight = () => {
        let nearestPos = this.nearestPosition()
        let projectilePos = this.tileData.getEntry(nearestPos).position
        let targetPos = this.tileData.getEntry(this.target).position
        let lerpPos = this.commonUtils.getLerpPos(projectilePos, targetPos, this.travelPercent())
        lerpPos = this.commonUtils.roundToNearestHex(lerpPos)
        return this.tileData.getEntry(lerpPos).height
    }


    setFrame = () => {
        this.frameCurTime = Date.now()
        if (this.animation.rate === 0) return
        if (this.frameCurTime - this.frameStartTime > this.animation.rate) {
            this.frameStartTime = Date.now()

            this.frame++

            if (this.frame >= this.imageObject['default'].images.length) this.frame = 0

        }

        this.animationCurTime = Date.now()
    }

    setRotation = () => {
        this.rotation = this.commonUtils.getDoubleAxisDirection(this.position, this.target)
        this.position = this.commonUtils.getDoubleAxisAdjacentPos(this.position, this.rotation)
    }
    
    updatePath = () => {
        this.projectileCurTime = Date.now()
        
        if (this.projectileCurTime - this.projectileStartTime >= this.travelTime()) {
            this.actionComplete = true
        }
    }

}