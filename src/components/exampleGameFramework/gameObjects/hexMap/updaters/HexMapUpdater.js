import CollisionClass from "../../../utilities/collision"
import HexMapControllerUtilsClass from "../utils/HexMapControllerUtils"

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
        for (let i in this.spriteManager.units.data.unitList) {
            let unit = this.spriteManager.units.data.unitList[i]
            this.updateUnit(unit)
        }

    }

    updateUnit = (unit) => {

        this.setUnitFrame(unit)

        unit.animationCurTime = Date.now()

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

    setUnitFrame = (unit) => {
        unit.frameCurTime = Date.now()
        if (unit.state.current.rate == 'static') return
        if (unit.frameCurTime - unit.frameStartTime > unit.state.current.rate) {
            unit.frameStartTime = Date.now()

            unit.frame++

            if (unit.frame >= unit.imageObject[unit.state.current.name].images.length) unit.frame = 0
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
                let startPosition = this.spriteManager.tiles.data.getEntry(unit.position.q, unit.position.r)
                let nextPosition = this.spriteManager.tiles.data.getEntry(unit.destination.q, unit.destination.r)
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