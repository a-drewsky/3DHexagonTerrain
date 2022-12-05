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
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view.renderMap.clear();
        this.view.rotatedMap.clear();
    }

}