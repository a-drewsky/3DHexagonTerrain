import CollisionClass from "../../../utilities/collision"
import HexMapControllerUtilsClass from "../utils/HexMapControllerUtils"
import HexMapConfigClass from "../config/hexMapConfig";

export default class HexMapUpdaterClass {

    constructor(hexMapData, spriteManager, images, settings, renderer, cameraController, cameraData, canvas, uiController, globalState) {

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.images = images
        this.renderer = renderer
        this.cameraController = cameraController
        this.cameraData = cameraData
        this.canvas = canvas
        this.drawCanvas = null

        this.uiController = uiController

        this.travelTime = settings.TRAVEL_TIME
        this.attackTime = settings.ATTACK_TIME

        this.collision = new CollisionClass()
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, spriteManager, this.cameraData, canvas, images, uiController, renderer, globalState);
        this.config = new HexMapConfigClass()

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {

        //check camera
        let zoom = this.cameraData.zoom * this.cameraData.zoomAmount
        if (this.cameraData.position.x + zoom / 2 < 0 - this.canvas.width / 2) this.cameraData.position.x = 0 - this.canvas.width / 2 - zoom / 2
        if (this.cameraData.position.x + zoom / 2 > this.drawCanvas.width - this.canvas.width / 2) this.cameraData.position.x = this.drawCanvas.width - this.canvas.width / 2 - zoom / 2
        if (this.cameraData.position.y + zoom / 2 * this.hexMapData.squish < 0 - this.canvas.height / 2) this.cameraData.position.y = 0 - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish
        if (this.cameraData.position.y + zoom / 2 * this.hexMapData.squish > this.drawCanvas.height - this.canvas.height / 2) this.cameraData.position.y = this.drawCanvas.height - this.canvas.height / 2 - zoom / 2 * this.hexMapData.squish

        //set background
        let scale = this.canvas.width / (this.canvas.width + zoom)
        this.uiController.setBgCanvasPosition(this.cameraData.position.x * -1 * scale, this.cameraData.position.y * -1 * scale)
        this.uiController.setBgCanvasZoom(this.drawCanvas.width * scale, this.drawCanvas.height * scale)

        //update mouse
        if (this.hexMapData.state.current != 'selectAction' && this.cameraData.clickPos !== null && this.collision.vectorDist(this.cameraData.clickPos, this.cameraData.clickMovePos) > this.cameraData.clickDist) {
            this.cameraController.mouseDown(this.cameraData.clickMovePos.x, this.cameraData.clickMovePos.y)
            this.cameraData.clickPos = null
            this.cameraData.clickMovePos = null
        }

        //update units
        for (let i in this.spriteManager.units.unitList) {
            let unit = this.spriteManager.units.unitList[i]
            this.updateUnit(unit)
        }

    }

    updateUnit = (unit) => {

        this.setUnitFrame(unit)

        unit.data.animationCurTime = Date.now()

        if (unit.data.state.current.duration != 'continuous' && unit.data.animationCurTime - unit.data.animationStartTime < unit.data.state.current.duration) return

        switch (unit.data.state.current.name) {
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

    setUnitFrame = (unit) => {
        unit.data.frameCurTime = Date.now()
        if (unit.data.state.current.rate == 'static') return
        if (unit.data.frameCurTime - unit.data.frameStartTime > unit.data.state.current.rate) {
            unit.data.frameStartTime = Date.now()

            unit.data.frame++

            if (unit.data.frame >= this.images.unit[unit.data.sprite][unit.data.state.current.name].images.length) unit.data.frame = 0
        }
    }

    updateUnitPath = (unit) => {

        unit.data.destinationCurTime = Date.now()
        if (unit.data.destinationCurTime - unit.data.destinationStartTime >= this.travelTime) {

            unit.data.position = unit.data.destination

            unit.data.path.shift()

            if (unit.data.path.length > 0) {
                unit.data.destination = unit.data.path[0]
                unit.data.destinationCurTime = Date.now()
                unit.data.destinationStartTime = Date.now()

                this.utils.setUnitDirection(unit, unit.data.destination)

                if (unit.data.state.current.name != 'walk') {
                    this.utils.setUnitAnimation(unit, 'walk')
                }
                let startPosition = this.hexMapData.getEntry(unit.data.position.q, unit.data.position.r)
                let nextPosition = this.hexMapData.getEntry(unit.data.destination.q, unit.data.destination.r)
                if (nextPosition.height != startPosition.height) {
                    this.utils.setUnitAnimation(unit, 'jump')
                }

            } else {
                unit.data.destination = null
                unit.data.destinationCurTime = null
                unit.data.destinationStartTime = null

                if (unit.data.futureState == null) {
                    this.utils.setChooseRotation(unit)
                } else {
                    this.utils.setUnitFutureState(unit)
                }

            }

        }
    }

    endUnitMining = (unit) => {
        let target = unit.data.target
        this.utils.setUnitIdle(unit)
        this.updateMine(target)
    }

    endUnitAttacking = (unit) => {

        let target = unit.data.target
        this.utils.setUnitIdle(unit)
        target.data.health -= 25

        if (target.data.type == 'unit') {
            this.utils.setUnitAnimation(target, 'hit')
        }

        if (target.data.type == 'bunker') {
            this.updateBase(target)
        }

    }

    endUnitHit = (unit) => {
        if (unit.data.health > 0) {
            this.utils.setUnitIdle(unit)
            return
        }

        this.utils.setUnitAnimation(unit, 'death')

    }

    endUnitDeath = (unit) => {
        this.spriteManager.units.deleteUnit(unit.data.position.q, unit.data.position.r)
        this.utils.resetHexMapState()
    }

    updateMine = (mine) => {

        mine.data.resources -= 25
        this.hexMapData.resources++

        this.uiController.setResourceBar(this.hexMapData.resources)

        let resources = mine.data.resources

        let curState = mine.data.state.current

        let newStateName = resources > 75 ? 'resources_lte_100' : resources > 50 ? 'resources_lte_75' : resources > 25 ? 'resources_lte_50' : resources > 0 ? 'resources_lte_25' : 'destroyed'

        if (newStateName == curState.name) return

        mine.data.state.current = mine.data.state[newStateName]

        if (mine.data.state.current.name != 'destroyed') {
            mine.renderer.render()
        } else {
            let newModifier = this.spriteManager.structures.setModifier(mine.data.position.q, mine.data.position.r, 'emptymine')
            console.log(newModifier)
            newModifier.renderer.render()
        }

    }

    //move to base class
    updateBase = (base) => {

        console.log(base)

        let health = base.data.health

        let curState = base.data.state.current

        let newStateName = health > 75 ? 'health_lte_100' : health > 50 ? 'health_lte_75' : health > 25 ? 'health_lte_50' : health > 0 ? 'health_lte_25' : 'destroyed'

        if (newStateName == curState.name) return
        
        base.data.state.current = base.data.state[newStateName]

        if (base.data.state.current.name != 'destroyed') {
            base.renderer.render()
        } else {
            let newStructure = this.spriteManager.structures.setModifier(base.data.position.q, base.data.position.r, 'rubblepile')
            console.log(newStructure)
            newStructure.renderer.render()
        }

    }

}