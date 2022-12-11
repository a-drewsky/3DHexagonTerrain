import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

export default class HexMapClass {

    constructor(ctx, canvas, camera, images, settings) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas);

        this.view = new HexMapViewClass(ctx, canvas, camera, this.data, this.settings, images);

        this.builder = new HexMapBuilderClass(this.data, this.settings);

        this.controller = new HexMapControllerClass(this.data, camera, canvas);
    }

    build = (q, r, size) => {
        this.builder.build(q, r, size);
    }

    prerender = () => {
        this.view.prerender()

    }

    update = (state) => {
        this.view.update();
        
        if(this.data.unitList[0].destination == null) return
        this.data.unitList[0].destinationCurTime = Date.now()
        if(this.data.unitList[0].destinationCurTime - this.data.unitList[0].destinationStartTime >= this.settings.TRAVEL_TIME){
            this.data.unitList[0].position = this.data.unitList[0].destination
            this.data.unitList[0].destination = null
            this.data.unitList[0].destinationCurTime = null
            this.data.unitList[0].destinationStartTime = null
            console.log('done')
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