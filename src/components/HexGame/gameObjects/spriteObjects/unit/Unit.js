import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import UnitConfig from "./UnitConfig"

import { TRAVEL_TIME, JUMP_AMOUNT } from './UnitConstants'

export default class UnitClass {

    constructor(pos, unitId, hexMapData, tileData, unitImages, uiController, globalState) {
        if(!UnitConfig[unitId]) throw Error(`Invalid Unit ID: (${unitId}). Unit config properties are: [${Object.getOwnPropertyNames(UnitConfig).splice(3)}]`)

        this.position = {
            q: pos.q,
            r: pos.r
        }

        //static data
        this.id = UnitConfig[unitId].id
        this.type = 'unit'
        this.name = UnitConfig[unitId].name
        this.description = UnitConfig[unitId].description
        this.height = UnitConfig[unitId].height

        //image data
        this.imageObject = unitImages[UnitConfig[unitId].sprite]
        this.images = []
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
        this.futureState = null

        //settings
        this.travelTime = TRAVEL_TIME
        this.jumpAmount = JUMP_AMOUNT

        //access data
        this.hexMapData = hexMapData
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
        return this.state.current
    }

    sprite = (cameraRotation) => {
        return this.imageObject[this.state.current.name].images[this.frame][this.spriteRotation(cameraRotation)]
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

    projectilePosition = () => {
        return this.commonUtils.getAdjacentPos(this.position, this.rotation)
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
        if (this.state.current.rate == 0) return
        if (this.frameCurTime - this.frameStartTime > this.state.current.rate) {
            this.render = true
            this.frameStartTime = Date.now()

            this.frame++

            if (this.frame >= this.imageObject[this.curState().name].images.length) this.frame = 0

        }

        this.animationCurTime = Date.now()
    }

    updatePath = () => {
        this.destinationCurTime = Date.now()
        if (this.destinationCurTime - this.destinationStartTime >= this.travelTime) {
            this.render = true
            this.position = this.destination

            this.path.shift()

            if (this.path.length > 0) {

                let startPosition = this.tileData.getEntry(this.position.q, this.position.r)
                let nextPosition = this.tileData.getEntry(this.destination.q, this.destination.r)
                if (this.curState().name != 'walk') {
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

                if (this.futureState == null) {
                    this.setChooseRotation()
                } else {
                    this.setFutureState()
                }

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

        this.hexMapData.setState('animation')

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

    setChooseRotation = () => {
        this.render = true

        this.setIdle()

        this.tileData.setSelection(this.position.q, this.position.r, 'unit')

        this.hexMapData.setState('chooseRotation')

    }

    setFutureState = () => {

        switch (this.futureState) {
            case 'mine':
                this.setMine()
                break
            case 'attack':
                this.setAttack()
                break
            case 'capture':
                this.captureFlag()
                break

        }

        this.futureState = null
        this.hexMapData.selectionData.resetSelected()

    }

    setMine = () => {
        this.setDirection(this.target.position)
        this.setAnimation('mine')
    }

    setAttack = () => {
        this.setDirection(this.target.position)
        this.setAnimation('attack')
    }

    setMove = () => {

        let startTile = this.tileData.getEntry(this.position.q, this.position.r)

        this.path = this.hexMapData.selectionData.selections.path

        let nextPosition = this.tileData.getEntry(this.path[0].q, this.path[0].r)

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