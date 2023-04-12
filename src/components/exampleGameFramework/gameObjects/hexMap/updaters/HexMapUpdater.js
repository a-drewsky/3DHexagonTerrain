import CollisionClass from "../../../utilities/collision"
import HexMapControllerUtilsClass from "../utils/HexMapControllerUtils"

export default class HexMapUpdaterClass {

    constructor(hexMapData, tileManager, spriteManager, images, settings, renderer, camera, canvas, uiController, globalState) {

        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.images = images
        this.renderer = renderer
        this.camera = camera
        this.canvas = canvas
        this.drawCanvas = null

        this.uiController = uiController

        this.travelTime = settings.TRAVEL_TIME
        this.attackTime = settings.ATTACK_TIME

        this.collision = new CollisionClass()
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, tileManager, spriteManager, this.camera.data, canvas, images, uiController, renderer, globalState);

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {

        let zoom = this.camera.data.zoom * this.camera.data.zoomAmount
        this.camera.updater.update()

        //set background
        let scale = this.canvas.width / (this.canvas.width + zoom)
        this.uiController.setBgCanvasPosition(this.camera.data.position.x * -1 * scale, this.camera.data.position.y * -1 * scale)
        this.uiController.setBgCanvasZoom(this.drawCanvas.width * scale, this.drawCanvas.height * scale)

        //update mouse
        if (this.hexMapData.state.current != 'selectAction' && this.camera.data.clickPos !== null && this.collision.vectorDist(this.camera.data.clickPos, this.camera.data.clickMovePos) > this.camera.data.clickDist) {
            this.camera.controller.mouseDown(this.camera.data.clickMovePos.x, this.camera.data.clickMovePos.y)
            this.camera.data.clickPos = null
            this.camera.data.clickMovePos = null
        }

        //update units
        for (let i in this.spriteManager.units.data.unitList) {
            let unit = this.spriteManager.units.data.unitList[i]
            this.updateUnit(unit)
        }

    }

    updateUnit = (unit) => {

        unit.updateFrame()

        if (unit.state.current.duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.state.current.duration) return

        switch (unit.state.current.name) {
            case 'walk':
            case 'jump':
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

    updateUnitPath = (unit) => {

        unit.destinationCurTime = Date.now()
        if (unit.destinationCurTime - unit.destinationStartTime >= this.travelTime) {

            unit.position = unit.destination

            unit.path.shift()

            if (unit.path.length > 0) {
                unit.destination = unit.path[0]
                unit.destinationCurTime = Date.now()
                unit.destinationStartTime = Date.now()

                this.utils.setUnitDirection(unit, unit.destination)

                if (unit.state.current.name != 'walk') {
                    this.utils.setUnitAnimation(unit, 'walk')
                }
                let startPosition = this.tileManager.data.getEntry(unit.position.q, unit.position.r)
                let nextPosition = this.tileManager.data.getEntry(unit.destination.q, unit.destination.r)
                if (nextPosition.height != startPosition.height) {
                    this.utils.setUnitAnimation(unit, 'jump')
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

    endUnitMining = (unit) => {
        let target = unit.target
        this.utils.setUnitIdle(unit)
        this.updateMine(target)
    }

    endUnitAttacking = (unit) => {

        let target = unit.target
        this.utils.setUnitIdle(unit)
        target.health -= 25

        if (target.type == 'unit') {
            this.utils.setUnitAnimation(target, 'hit')
        }

        if (target.type == 'bunker') {
            this.updateBase(target)
        }

    }

    endUnitHit = (unit) => {
        if (unit.health > 0) {
            this.utils.setUnitIdle(unit)
            return
        }

        this.utils.setUnitAnimation(unit, 'death')

    }

    endUnitDeath = (unit) => {
        this.spriteManager.units.data.deleteUnit(unit.position.q, unit.position.r)
        this.utils.resetHexMapState()
    }

    updateMine = (mine) => {

        mine.resources -= 25
        this.hexMapData.resources++

        this.uiController.setResourceBar(this.hexMapData.resources)

        let resources = mine.resources

        let curState = mine.state.current

        let newStateName = resources > 75 ? 'resources_lte_100' : resources > 50 ? 'resources_lte_75' : resources > 25 ? 'resources_lte_50' : resources > 0 ? 'resources_lte_25' : 'destroyed'

        if (newStateName == curState.name) return

        mine.state.current = mine.state[newStateName]

        if (mine.state.current.name != 'destroyed') {
            this.spriteManager.structures.structureRenderer.render(mine)
        } else {
            let newModifier = this.spriteManager.structures.data.setModifier(mine.position.q, mine.position.r, 'emptymine')
            this.spriteManager.structures.modifierRenderer.render(newModifier)
        }

    }

    //move to base class
    updateBase = (base) => {

        console.log(base)

        let health = base.health

        let curState = base.state.current

        let newStateName = health > 75 ? 'health_lte_100' : health > 50 ? 'health_lte_75' : health > 25 ? 'health_lte_50' : health > 0 ? 'health_lte_25' : 'destroyed'

        if (newStateName == curState.name) return
        
        base.state.current = base.state[newStateName]

        if (base.state.current.name != 'destroyed') {
            this.spriteManager.structures.structureRenderer.render(base)
        } else {
            let newModifier = this.spriteManager.structures.data.setModifier(base.position.q, base.position.r, 'rubblepile')
            this.spriteManager.structures.modifierRenderer.render(newModifier)
        }

    }

}