import CommonHexMapUtilsClass from "../../../commonUtils/CommonHexMapUtils"
import UnitConfig from "../../../config/UnitConfig"

import SpriteObjectClass from "../SpriteObject"

import { TRAVEL_TIME, JUMP_AMOUNT } from './UnitConstants'

export default class UnitClass extends SpriteObjectClass {

    constructor(pos, unitId, tileData, images) {
        if (!UnitConfig[unitId]) throw Error(`Invalid Unit ID: (${unitId}). Unit config properties are: [${Object.getOwnPropertyNames(UnitConfig).splice(3)}]`)

        super(
            'unit',
            UnitConfig[unitId].id,
            UnitConfig[unitId].state,
            'idle',
            pos,
            UnitConfig[unitId].height,
            images.unit[UnitConfig[unitId].sprite],
            images.shadows[UnitConfig[unitId].shadow]
        )

        //static data
        this.name = UnitConfig[unitId].name
        this.description = UnitConfig[unitId].description

        //image data
        this.actionImage = null
        this.staticImages = []
        this.shadowImage = null
        this.shadowImages = []

        //pathing data
        this.path = []
        this.destination = null
        this.destinationStartTime = null
        this.destinationCurTime = null

        //settings
        this.tileTravelTime = TRAVEL_TIME
        this.jumpAmount = JUMP_AMOUNT

        //access data
        this.tileData = tileData
        this.commonUtils = new CommonHexMapUtilsClass()

        //unit data
        this.render = true
        this.actionComplete = false
        this.stats = { ...UnitConfig[unitId].stats }
        this.health = this.stats['max_health']
        this.abilities = { ...UnitConfig[unitId].abilities }

    }

    //HELPER FUNCTIONS
    travelPercent = () => {
        return (this.destinationCurTime - this.destinationStartTime) / this.tileTravelTime
    }

    endOfState = () => {
        if (this.state.current.duration === 'continuous') return true
        if (this.animationCurTime - this.animationStartTime < this.state.current.duration) return false
        return true
    }


    //SET FUNCTIONS
    updatePath = () => {
        this.destinationCurTime = Date.now()
        if (this.destinationCurTime - this.destinationStartTime >= this.tileTravelTime) {
            this.render = true
            this.position = this.destination

            this.path.shift()

            if (this.path.length > 0) {

                let startPosition = this.tileData.getEntry(this.position)
                let nextPosition = this.tileData.getEntry(this.destination)
                if (this.curState() !== 'walk') {
                    this.setAnimation('walk')
                }
                if (nextPosition.height !== startPosition.height) {
                    this.setAnimation('jump')
                }
                this.destination = this.path[0]
                this.destinationCurTime = Date.now()
                this.destinationStartTime = Date.now()
                this.setDirection(this.destination)

            } else {

                this.actionComplete = true

            }

        }
    }

    //SET STATE
    setAnimation = (state) => {
        this.render = true
        this.actionComplete = false
        this.state.current = this.state[state]
        this.frame = 0
        this.animationStartTime = Date.now()
        this.animationCurTime = Date.now()
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()
        this.destination = null
        this.destinationCurTime = null
        this.destinationStartTime = null

    }

    setIdle = () => {
        this.render = true
        this.actionComplete = false

        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()
        this.animationCurTime = null
        this.animationStartTime = null
        this.destination = null
        this.destinationCurTime = null
        this.destinationStartTime = null

        this.state.current = this.state.idle

    }

    setMove = (path) => {
        this.render = true
        this.actionComplete = false

        let startTile = this.tileData.getEntry(this.position)

        this.path = path

        let nextPosition = this.tileData.getEntry(this.path[0])

        if (nextPosition.height !== startTile.height) {
            this.setAnimation('jump')
        } else {
            this.setAnimation('walk')
        }

        this.destination = this.path[0]

        this.destinationStartTime = Date.now()
        this.destinationCurTime = Date.now()

        this.setDirection(this.destination)

    }

}