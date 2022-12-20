import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"
import HexMapViewSpritesRendererClass from "./HexMapViewSpritesRenderer"
import HexMapViewUtilsClass from "./HexMapViewUtils"

export default class HexMapClass {

    constructor(ctx, canvas, camera, images, settings) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas);

        this.view = new HexMapViewClass(ctx, canvas, camera, this.data, this.settings, images);

        this.builder = new HexMapBuilderClass(this.data, this.settings);

        this.controller = new HexMapControllerClass(this.data, camera, canvas, images, settings);

        this.utils = new HexMapViewUtilsClass(this.data, camera, settings)

        this.renderer = new HexMapViewSpritesRendererClass(this.data, camera, images, this.utils, settings);

        this.images = images
    }

    build = (q, r, size) => {
        this.builder.build(q, r, size);
    }

    prerender = () => {
        this.data.setRotatedMapList()
        this.view.prerender()

    }

    update = (state) => {
        this.view.update();

        for (let i in this.data.unitList) {

            let unit = this.data.unitList[i]

            //set frame
            unit.frameCurTime = Date.now()
            if (unit.frameCurTime - unit.frameStartTime > this.settings.AMIMATION_RATE) {
                unit.frameStartTime = Date.now()

                unit.frame++

                if (unit.frame >= this.images.units['exampleUnit'][unit.state].images.length) unit.frame = 0
            }

            if (unit.destination == null) continue

            if (unit.state == 'jumpUp') {
                //make getPercent function
                let percent = (unit.destinationCurTime - unit.destinationStartTime) / this.settings.TRAVEL_TIME

                if (percent >= 0.5) unit.state = 'jumpDown'
            }

            unit.destinationCurTime = Date.now()
            if (unit.destinationCurTime - unit.destinationStartTime >= this.settings.TRAVEL_TIME) {

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
                    let startPosition = this.data.getEntry(unit.position.q, unit.position.r)
                    let nextPosition = this.data.getEntry(unit.destination.q, unit.destination.r)
                    if (nextPosition.height != startPosition.height) {
                        unit.frame = 0
                        unit.state = 'jumpUp'
                    }
                } else {
                    unit.destination = null
                    unit.destinationCurTime = null
                    unit.destinationStartTime = null

                    //make some sort of setState function
                    unit.state = 'idle'
                    unit.frame = 0
                    
                    this.renderer.renderUnit(unit)
                    console.log('done')

                    //reset selection (make common function)
                    // for (let [key, value] of this.data.getMap()) {
                    //     if (value.selected != null) {
                    //         let keyObj = this.data.split(key)
                    //         value.selected = null
                    //     }
                    // }
                    this.data.selectionList = []
                }

            }
        }


    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view.renderMap.clear();
        this.view.rotatedMap.clear();
    }

}