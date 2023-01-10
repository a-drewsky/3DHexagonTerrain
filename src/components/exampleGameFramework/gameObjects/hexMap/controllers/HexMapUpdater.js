import CollisionClass from "../../../utilities/collision"

export default class HexMapUpdaterClass {

    constructor(hexMapData, images, settings, renderer, cameraController) {

        this.hexMapData = hexMapData
        this.images = images
        this.renderer = renderer
        this.cameraController = cameraController
        this.animationRate = settings.AMIMATION_RATE
        this.travelTime = settings.TRAVEL_TIME

        this.collision = new CollisionClass()

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
            //set frame
            unit.frameCurTime = Date.now()
            if (unit.frameCurTime - unit.frameStartTime > this.animationRate) {
                unit.frameStartTime = Date.now()

                unit.frame++

                if (unit.frame >= this.images.units[unit.sprite][unit.state].images.length) unit.frame = 0
            }

            if (unit.destination == null) continue

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

                    //make some sort of setState function
                    unit.state = 'idle'
                    unit.frame = 0

                    this.renderer.renderUnit(unit)

                    this.hexMapData.selectionList = []

                    this.hexMapData.state = 'selectTile'
                }

            }
        }

    }

}