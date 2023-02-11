import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./builders/HexMapBuilder"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./view/HexMapView"
import HexMapSettingsClass from "./config/HexMapSettings"
import HexMapViewSpritesRendererClass from "./view/HexMapViewSpritesRenderer"
import HexMapViewUtilsClass from "./view/HexMapViewUtils"
import HexMapUpdaterClass from "./controllers/HexMapUpdater"

export default class HexMapClass {

    constructor(ctx, canvas, camera, cameraController, images, settings, uiComponents, updateUi) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas);

        this.view = new HexMapViewClass(ctx, canvas, camera, this.data, this.settings, images);

        this.builder = new HexMapBuilderClass(this.data, this.settings);

        this.utils = new HexMapViewUtilsClass(this.data, camera, this.settings, images)

        this.renderer = new HexMapViewSpritesRendererClass(this.data, camera, images, this.utils, this.settings);

        this.controller = new HexMapControllerClass(this.data, camera, canvas, images, this.settings, uiComponents, updateUi, this.renderer);

        this.updater = new HexMapUpdaterClass(this.data, images, this.settings, this.renderer, cameraController, camera, canvas, uiComponents, updateUi)

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
        this.updater.update();
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view.clear()
    }

}