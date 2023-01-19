import CollisionClass from "../../../utilities/collision"
import HexMapControllerUtilsClass from "./HexMapControllerUtils"
import HexMapConfigClass from "../config/hexMapConfig";

export default class HexMapUpdaterClass {

    constructor(hexMapData, images, settings, renderer, cameraController, camera, canvas, uiComponents, updateUi) {

        this.hexMapData = hexMapData
        this.images = images
        this.renderer = renderer
        this.cameraController = cameraController

        this.animationRate = settings.AMIMATION_RATE
        this.travelTime = settings.TRAVEL_TIME
        this.mineTime = settings.MINE_TIME

        this.collision = new CollisionClass()
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera, canvas, images, uiComponents, updateUi);
        this.config = new HexMapConfigClass()

    }

    update = () => {

        if (this.hexMapData.state != 'selectAction' && this.hexMapData.clickPos !== null) console.log(this.hexMapData.clickPos, this.hexMapData.clickMovePos)

        if (this.hexMapData.state != 'selectAction' && this.hexMapData.clickPos !== null && this.collision.vectorDist(this.hexMapData.clickPos, this.hexMapData.clickMovePos) > this.hexMapData.clickDist) {
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

        if(mine.state < 4){
            this.renderer.renderStructure(mine)
        } else {
            let emptymine = this.config.emptymine(mine.position)
            this.renderer.renderSingleImageModifier(emptymine)
            let terrainIndex = this.hexMapData.getTerrainIndex(mine.position.q, mine.position.r)
            this.hexMapData.terrainList[terrainIndex] = emptymine
        }
        
    }

    updateUnit = (unit) => {

        this.setUnitFrame(unit)

        switch(unit.state){
            case 'walk':
            case 'jumpUp':
            case 'jumpDown':
                if (unit.destination != null) this.updateUnitPath(unit)
                return
            case 'mine':
                if (unit.target != null) this.updateUnitMining(unit)
                return

        }

    }

    setUnitFrame = (unit) => {
        unit.frameCurTime = Date.now()
        if (unit.frameCurTime - unit.frameStartTime > this.animationRate) {
            unit.frameStartTime = Date.now()

            unit.frame++

            if (unit.frame >= this.images.units[unit.sprite][unit.state].images.length) unit.frame = 0
        }
    }

    collectMineResources = (mine) => {
        mine.resources -= 25
        this.hexMapData.resources++
        
        this.utils.setResourceBar(this.hexMapData.resources)
        this.updateMine(mine)
    }

    updateUnitMining = (unit) => {
        unit.animationCurTime = Date.now()
        if (unit.animationCurTime - unit.animationStartTime >= this.mineTime) {

            this.collectMineResources(unit.target)

            unit.target = null
            unit.animationCurTime = null
            unit.animationStartTime = null

            //make some sort of setState function
            unit.state = 'idle'
            unit.frame = 0

            this.renderer.renderUnit(unit)

            this.utils.resetSelected()

            this.hexMapData.state = 'selectTile'
        }
    }

    updateUnitPath = (unit) => {
        if (unit.state == 'jumpUp') {
            //make getPercent function
            let percent = (unit.destinationCurTime - unit.destinationStartTime) / this.travelTime

            if (percent >= 0.5) unit.state = 'jumpDown'
        }

        unit.destinationCurTime = Date.now()
        if (unit.destinationCurTime - unit.destinationStartTime >= this.travelTime) {

            unit.position = unit.destination

            unit.path.shift()

            if (unit.path.length > 0) {
                unit.destination = unit.path[0]
                unit.destinationCurTime = Date.now()
                unit.destinationStartTime = Date.now()

                //set rotation
                let direction = {
                    q: unit.destination.q - unit.position.q,
                    r: unit.destination.r - unit.position.r
                }

                let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]

                unit.rotation = directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)

                if (unit.state != 'walk') {
                    unit.state = 'walk'
                    unit.frame = 0
                }
                let startPosition = this.hexMapData.getEntry(unit.position.q, unit.position.r)
                let nextPosition = this.hexMapData.getEntry(unit.destination.q, unit.destination.r)
                if (nextPosition.height != startPosition.height) {
                    unit.frame = 0
                    unit.state = 'jumpUp'
                }

                this.hexMapData.state = 'animation'
            } else {
                unit.destination = null
                unit.destinationCurTime = null
                unit.destinationStartTime = null
                unit.frame = 0

                if(unit.target == null) {
                    unit.state = 'idle'
                    this.renderer.renderUnit(unit)
                    this.utils.resetSelected()
                    this.hexMapData.state = 'selectTile'
                } else {
                    this.utils.mineOre(unit, unit.target)
                    this.utils.resetSelected()
                    this.hexMapData.state = 'animation'
                    this.utils.clearContextMenu()
                }
                
            }

        }
    }

}