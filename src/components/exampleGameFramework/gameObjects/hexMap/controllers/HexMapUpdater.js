import CollisionClass from "../../../utilities/collision"
import HexMapControllerUtilsClass from "./HexMapControllerUtils"
import HexMapConfigClass from "../config/hexMapConfig";

export default class HexMapUpdaterClass {

    constructor(hexMapData, images, settings, renderer, cameraController, camera, canvas, uiComponents, updateUi, globalState) {

        this.hexMapData = hexMapData
        this.images = images
        this.renderer = renderer
        this.cameraController = cameraController

        this.travelTime = settings.TRAVEL_TIME
        this.attackTime = settings.ATTACK_TIME

        this.collision = new CollisionClass()
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera, canvas, images, uiComponents, updateUi, renderer, globalState);
        this.config = new HexMapConfigClass()

    }

    update = () => {

        if (this.hexMapData.state.current != 'selectAction' && this.hexMapData.clickPos !== null && this.collision.vectorDist(this.hexMapData.clickPos, this.hexMapData.clickMovePos) > this.hexMapData.clickDist) {
            this.cameraController.mouseDown(this.hexMapData.clickMovePos.x, this.hexMapData.clickMovePos.y)
            this.hexMapData.clickPos = null
            this.hexMapData.clickMovePos = null
        }

        for (let i in this.hexMapData.unitList) {
            let unit = this.hexMapData.unitList[i]
            this.updateUnit(unit)
        }

    }

    updateMine = (mine) => {

        let resources = mine.resources

        let curState = mine.state

        let newState = resources > 75 ? 0 : resources > 50 ? 1 : resources > 25 ? 2 : resources > 0 ? 3 : 4

        if (newState == curState) return

        mine.state = newState

        if (mine.state < 4) {
            this.renderer.renderStructure(mine)
        } else {
            let emptymine = this.config.emptymine(mine.position)
            this.utils.updateTerrain(mine.position.q, mine.position.r, emptymine)
        }

    }

    updateBase = (base) => {

        let health = base.health

        let curState = base.state

        let newState = health > 75 ? 0 : health > 50 ? 1 : health > 25 ? 2 : health > 0 ? 3 : 4

        if (newState == curState) return

        base.state = newState

        if (base.state < 4) {
            this.renderer.renderStructure(base)
        } else {
            let rubblepile = this.config.rubblepile(base.position)
            this.utils.updateTerrain(base.position.q, base.position.r, rubblepile)
        }

    }

    updateUnit = (unit) => {

        this.setUnitFrame(unit)

        unit.animationCurTime = Date.now()

        if (unit.stateConfig[unit.state].duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.stateConfig[unit.state].duration) return

        switch (unit.state) {
            case 'walk':
            case 'jumpUp':
            case 'jumpDown':
                this.updateUnitPath(unit)
                return
            case 'mine':
                this.endUnitMining(unit)
                return
            case 'attack':
                this.endUnitAttacking(unit)
                return
            case 'hit':
                this.endUnitHit(unit)
                return
            case 'death':
                this.endUnitDeath(unit)
                return

        }

    }

    endUnitDeath = (unit) => {
        this.hexMapData.deleteUnit(unit.position.q, unit.position.r)
        this.utils.resetHexMapState()
    }

    endUnitHit = (unit) => {
        if (unit.health > 0) {
            this.utils.setUnitIdle(unit)
            return
        }

        this.utils.setUnitAnimation(unit, 'death')

    }

    setUnitFrame = (unit) => {
        unit.frameCurTime = Date.now()
        if (unit.stateConfig[unit.state].rate == 'static') return
        if (unit.frameCurTime - unit.frameStartTime > unit.stateConfig[unit.state].rate) {
            unit.frameStartTime = Date.now()

            unit.frame++

            if (unit.frame >= this.images.unit[unit.sprite][unit.state].images.length) unit.frame = 0
        }
    }

    collectMineResources = (mine) => {
        mine.resources -= 25
        this.hexMapData.resources++

        this.utils.setResourceBar(this.hexMapData.resources)
        this.updateMine(mine)
    }

    endUnitMining = (unit) => {
        this.collectMineResources(unit.target)
        this.utils.setUnitIdle(unit)
    }

    endUnitAttacking = (unit) => {

        let target = unit.target
        this.utils.setUnitIdle(unit)
        target.health -= 25

        if (target.type == 'unit') {
            this.utils.setUnitAnimation(target, 'hit')
        }

        if (target.type == 'base') {
            this.renderer.renderStructure(target)
            this.updateBase(target)
        }

    }

    updateUnitPath = (unit) => {
        if (unit.state == 'jumpUp') {
            //make getPercent function
            let percent = (unit.destinationCurTime - unit.destinationStartTime) / this.travelTime

            if (percent >= 0.5) this.utils.setUnitAnimation(unit, 'jumpDown')
        }

        unit.destinationCurTime = Date.now()
        if (unit.destinationCurTime - unit.destinationStartTime >= this.travelTime) {

            unit.position = unit.destination

            unit.path.shift()

            if (unit.path.length > 0) {
                unit.destination = unit.path[0]
                unit.destinationCurTime = Date.now()
                unit.destinationStartTime = Date.now()

                this.utils.setUnitDirection(unit, unit.destination)

                if (unit.state != 'walk') {
                    this.utils.setUnitAnimation(unit, 'walk')
                }
                let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)
                let nextPosition = this.hexMapData.getEntry(unit.destination.q, unit.destination.r)
                if (nextPosition.height != startPosition.height) {
                    this.utils.setUnitAnimation(unit, 'jumpUp')
                }

            } else {
                unit.destination = null
                unit.destinationCurTime = null
                unit.destinationStartTime = null

                if (unit.futureState == null) {
                    this.utils.setChooseRotation(unit)
                } else {
                    this.utils.setUnitFutureState(unit)
                }

            }

        }
    }

}