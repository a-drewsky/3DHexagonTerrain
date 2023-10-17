import ProjectileConfig from "./ProjectileConfig"

import { TRAVEL_TIME } from "./ProjectileConstants"

import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class ProjectileClass {

    constructor(loc, pos, target, projectileId, mapData, unitData, structureData, tileData, projectileImages) {
        if (!ProjectileConfig[projectileId]) throw Error(`Invalid Projectile ID: (${projectileId}). Unit config properties are: [${Object.getOwnPropertyNames(ProjectileConfig).splice(3)}]`)

        this.loc = loc

        this.position = {
            q: pos.q,
            r: pos.r
        }

        //static data
        this.id = ProjectileConfig[projectileId].id
        this.type = 'projectile'
        this.name = ProjectileConfig[projectileId].name
        this.description = ProjectileConfig[projectileId].description
        this.height = ProjectileConfig[projectileId].height

        //image data
        this.imageObject = projectileImages[ProjectileConfig[projectileId].sprite]
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
        this.projectileStartTime = Date.now()
        this.projectileCurTime = Date.now()
        this.target = {
            q: target.q,
            r: target.r
        }

        this.state = {
            animation: 'animation',
            destroy: 'destroy'
        }
        this.state.current = this.state.animation

        //settings
        this.tileTravelTime = TRAVEL_TIME

        //access data
        this.mapData = mapData
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
        let spriteRotation = this.rotation + cameraRotation
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

    travelTime = () => {
        let travelLength = this.commonUtils.getDistance(this.position, this.target)
        return this.tileTravelTime * travelLength
    }

    travelPercent = () => {
        return (this.projectileCurTime - this.projectileStartTime) / this.travelTime()
    }

    tileHeight = () => {
        let posHeight = this.tileData.getEntry(this.position.q, this.position.r).height
        let targetHeight = this.tileData.getEntry(this.target.q, this.target.r).height
        return posHeight + (targetHeight - posHeight) * this.travelPercent()
    }


    //SET FUNCTIONS
    setFrame = () => {
        this.frameCurTime = Date.now()
        if (this.animation.rate == 0) return
        if (this.frameCurTime - this.frameStartTime > this.animation.rate) {
            this.frameStartTime = Date.now()

            this.frame++

            if (this.frame >= this.imageObject['default'].images.length) this.frame = 0

        }

        this.animationCurTime = Date.now()
    }

    setRotation = () => {
        this.rotation = this.commonUtils.getDirection(this.position, this.target)
    }
    
    updatePath = () => {
        this.projectileCurTime = Date.now()
        
        if (this.projectileCurTime - this.projectileStartTime >= this.travelTime()) {
            this.attackTarget()
            this.state = this.state.destroy
        }

    }

    //END STATE
    attackTarget = () => {

        //unit
        let attckedUnit = this.unitData.getUnit(this.target.q, this.target.r)

        if(attckedUnit) attckedUnit.recieveAttack(25)

        //structure
        let attckedStructure = this.structureData.getStructure(this.target.q, this.target.r)

        if(attckedStructure && attckedStructure.type == 'bunker') attckedStructure.recieveAttack(25)

        
    }

}