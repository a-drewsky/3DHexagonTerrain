import ProjectileConfig from "./ProjectileConfig"
import CommonHexMapUtilsClass from "../../../commonUtils/CommonHexMapUtils"
import SpriteObjectClass from "../SpriteObject"

import { TRAVEL_TIME } from "./ProjectileConstants"

const PROJECTILE_STATE = {
    default: { name: 'default', rate: 0, duration: 'continuous', type: 'static' }
}

export default class ProjectileClass extends SpriteObjectClass {

    constructor(loc, pos, target, projectileId, tileData, images) {
        if (!ProjectileConfig[projectileId]) throw Error(`Invalid Projectile ID: (${projectileId}). Unit config properties are: [${Object.getOwnPropertyNames(ProjectileConfig).splice(3)}]`)

        super(
            'projectile',
            ProjectileConfig[projectileId].id,
            PROJECTILE_STATE,
            'default',
            pos,
            ProjectileConfig[projectileId].height,
            images.projectiles[ProjectileConfig[projectileId].sprite],
            images.shadows[ProjectileConfig[projectileId].shadow]
        )

        //access data
        this.tileData = tileData
        this.commonUtils = new CommonHexMapUtilsClass()

        this.loc = loc
        this.rotation = this.commonUtils.getDoubleAxisDirection(pos, target)
        this.position = this.commonUtils.getDoubleAxisAdjacentPos(pos, this.rotation)
        this.target = { ...target }

        //image data
        this.image = null
        this.shadowImage = null

        //projectile data
        this.actionComplete = false
        this.projectileStartTime = Date.now()
        this.projectileCurTime = Date.now()

        //settings
        this.tileTravelTime = TRAVEL_TIME
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

    updatePath = () => {
        this.projectileCurTime = Date.now()

        if (this.projectileCurTime - this.projectileStartTime >= this.travelTime()) {
            this.actionComplete = true
        }
    }

}