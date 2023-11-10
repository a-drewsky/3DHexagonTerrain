import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import UnitConfig from "./UnitConfig"

import { TRAVEL_TIME, JUMP_AMOUNT } from './UnitConstants'

export default class UnitClass {

    constructor(pos, unitId, mapData, tileData, images, uiController, globalState) {
        if(!UnitConfig[unitId]) throw Error(`Invalid Unit ID: (${unitId}). Unit config properties are: [${Object.getOwnPropertyNames(UnitConfig).splice(3)}]`)

        this.position = { ...pos }

        //static data
        this.id = UnitConfig[unitId].id
        this.type = 'unit'
        this.name = UnitConfig[unitId].name
        this.description = UnitConfig[unitId].description
        this.height = UnitConfig[unitId].height

        //image data
        this.imageObject = images.unit[UnitConfig[unitId].sprite]
        this.shadowImageObject = images.shadows[this.imageObject.shadow]
        this.actionImage = null
        this.staticImages = []
        this.shadowImage = null
        this.shadowImages = []


        //animation data
        this.rotation = 5
        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()
        this.animationStartTime = null
        this.animationCurTime = null

        //pathing data
        this.path = []
        this.destination = null
        this.destinationStartTime = null
        this.destinationCurTime = null
        this.target = null

        //settings
        this.tileTravelTime = TRAVEL_TIME
        this.jumpAmount = JUMP_AMOUNT

        //access data
        this.mapData = mapData
        this.tileData = tileData
        this.uiController = uiController
        this.globalState = globalState
        this.commonUtils = new CommonHexMapUtilsClass()

        //unit data
        this.render = true
        
        this.stats = {
            health: UnitConfig[unitId].stats.health,
            movement: UnitConfig[unitId].stats.movement,
            range: UnitConfig[unitId].stats.range,
            mining: UnitConfig[unitId].stats.mining,
            physical_attack: UnitConfig[unitId].stats.physical_attack,
            physical_attack_modifications: UnitConfig[unitId].stats.physical_attack_modifications,
            elemental_attack: UnitConfig[unitId].stats.elemental_attack,
            elemental_attack_modifications: UnitConfig[unitId].stats.elemental_attack_modifications,
            physical_resistance: UnitConfig[unitId].stats.physical_resistance,
            physical_resistance_modifications: UnitConfig[unitId].stats.physical_resistance_modifications,
            elemental_resistance: UnitConfig[unitId].stats.elemental_resistance,
            elemental_resistance_modifications: UnitConfig[unitId].stats.elemental_resistance_modifications,
        }

        this.abilities = UnitConfig[unitId].abilities

        this.state = {
            idle: UnitConfig[unitId].animations.idle,
            walk: UnitConfig[unitId].animations.walk,
            jump: UnitConfig[unitId].animations.jump,
            mine: UnitConfig[unitId].animations.mine,
            attack: UnitConfig[unitId].animations.attack,
            hit: UnitConfig[unitId].animations.hit,
            death: UnitConfig[unitId].animations.death
        }
        this.state.current = this.state.idle

    }

    //HELPER FUNCTIONS
    curState = () => {
        return this.state.current.name
    }

    sprite = (cameraRotation) => {
        return this.imageObject[this.curState()].images[this.frame][this.spriteRotation(cameraRotation)]
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

    travelPercent = () => {
        return (this.destinationCurTime - this.destinationStartTime) / this.tileTravelTime
    }


    //SET FUNCTIONS
    setDirection = (targetPos) => {
        this.render = true

        this.rotation = this.commonUtils.getDirection(this.position, targetPos)

    }

    setPosition = (position) => {
        this.render = true

        this.position = position

    }

    setFrame = () => {
        this.frameCurTime = Date.now()
        this.animationCurTime = Date.now()
        if (this.state.current.rate == 0) return
        if (this.destination != null) this.render = true
        if (this.frameCurTime - this.frameStartTime > this.state.current.rate) {
            this.render = true
            this.frameStartTime = Date.now()

            this.frame++

            if (this.frame >= this.imageObject[this.curState()].images.length) this.frame = 0

        }

    }

    updatePath = () => {
        this.destinationCurTime = Date.now()
        if (this.destinationCurTime - this.destinationStartTime >= this.tileTravelTime) {
            this.render = true
            this.position = this.destination

            this.path.shift()

            if (this.path.length > 0) {

                let startPosition = this.tileData.getEntry(this.position)
                let nextPosition = this.tileData.getEntry(this.destination)
                if (this.curState() != 'walk') {
                    this.setAnimation('walk')
                }
                if (nextPosition.height != startPosition.height) {
                    this.setAnimation('jump')
                }
                this.destination = this.path[0]
                this.destinationCurTime = Date.now()
                this.destinationStartTime = Date.now()
                this.setDirection(this.destination)

            } else {

                this.setIdle()

            }

        }
    }

    //SET STATE
    setAnimation = (state) => {
        this.render = true
        this.state.current = this.state[state]
        this.frame = 0
        this.animationStartTime = Date.now()
        this.animationCurTime = Date.now()
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()
        this.destination = null
        this.destinationCurTime = null
        this.destinationStartTime = null

        this.mapData.setState('animation')

    }

    setIdle = () => {
        this.render = true

        if (this.stats.health <= 0) {
            this.setAnimation('death')
            return
        }

        this.target = null
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

    setMine = () => {
        this.setDirection(this.target.position)
        this.setAnimation('mine')
    }

    setAttack = () => {
        this.setDirection(this.target.position)
        this.setAnimation('attack')
    }

    setMove = (path) => {

        let startTile = this.tileData.getEntry(this.position)

        this.path = path

        let nextPosition = this.tileData.getEntry(this.path[0])

        if (nextPosition.height != startTile.height) {
            this.setAnimation('jump')
        } else {
            this.setAnimation('walk')
        }

        this.destination = this.path[0]

        this.destinationStartTime = Date.now()
        this.destinationCurTime = Date.now()

        this.setDirection(this.destination)

    }


    //END STATE
    collectTargetResources = () => {
        this.target.removeResources(this.stats.mining)
    }

    attackTarget = () => {
        this.target.recieveAttack(25)
    }

    captureFlag = () => {

        this.setDirection(this.target.position)

        this.globalState.current = this.globalState.pause
        this.uiController.setEndGameMenu(true)
    }


    //RECIEVING
    recieveAttack = (damage) => {
        this.stats.health -= damage
        this.setAnimation('hit')
    }

}