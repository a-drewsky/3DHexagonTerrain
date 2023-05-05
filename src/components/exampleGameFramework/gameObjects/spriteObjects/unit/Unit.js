import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

import { TRAVEL_TIME, JUMP_AMOUNT } from './UnitConstants'

export default class UnitClass {

    constructor(pos, hexMapData, tileData, unitImages, uiController, globalState) {

        this.position = {
            q: pos.q,
            r: pos.r
        }

        //static data
        this.name = 'Villager'
        this.type = 'unit'
        this.height = 3

        //image data
        this.imageObject = unitImages.villager
        this.canvasSize = {
            width: hexMapData.size * 2 * this.imageObject.spriteSize.width,
            height: hexMapData.size * 2 * this.imageObject.spriteSize.height
        }
        this.images = []
        this.shadowImages = []


        //stats
        this.stats = {
            movement: 5,
            baseHealth: 100
        }
        this.health = this.stats.baseHealth

        //animation data
        this.rotation = 5
        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()

        this.path = []
        this.destination = null
        this.destinationStartTime = null
        this.destinationCurTime = null
        this.target = null
        this.animationStartTime = null
        this.animationCurTime = null
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

        this.state = {
            idle: { name: 'idle', rate: 'static', duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'action' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'action' },
            mine: { name: 'mine', rate: 150, duration: 1800, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 750, type: 'action' },
            hit: { name: 'hit', rate: 150, duration: 450, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' }
        }
        this.state.current = this.state.idle

    }

    curState = () => {
        return this.state.current
    }

    setDirection = (targetPos) => {
        this.render = true

        this.rotation = this.commonUtils.getDirection(this.position, targetPos)

    }

    setFrame = () => {
        this.frameCurTime = Date.now()
        if (this.state.current.rate == 'static') return
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

        if (this.health <= 0) {
            this.setAnimation('death')
            return
        }

        this.target = null
        this.frame = 0
        this.frameStartTime = null
        this.frameCurTime = null
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
        this.hexMapData.resetSelected()

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

        this.path = this.hexMapData.selections.path

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
        this.target.resources -= 25
        this.hexMapData.resources++
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
        this.health -= damage
        this.setAnimation('hit')
    }

}