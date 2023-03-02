import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./builders/HexMapBuilder"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./view/HexMapView"
import HexMapSettingsClass from "./config/HexMapSettings"
import HexMapViewSpritesRendererClass from "./view/HexMapViewSpritesRenderer"
import HexMapViewUtilsClass from "./view/HexMapViewUtils"
import HexMapUpdaterClass from "./controllers/HexMapUpdater"
import CameraClass from "./camera/Camera"

export default class HexMapClass {

    constructor(ctx, canvas, images, settings, uiComponents, updateUi, globalState) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas);

        this.camera = new CameraClass(canvas)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.settings, images);

        this.builder = new HexMapBuilderClass(this.data, this.settings);

        this.renderer = new HexMapViewSpritesRendererClass(this.data, this.camera.data, images, this.settings);

        this.controller = new HexMapControllerClass(this.data, this.camera.controller, this.camera.data, canvas, images, this.settings, uiComponents, updateUi, this.renderer, globalState);

        this.updater = new HexMapUpdaterClass(this.data, images, this.settings, this.renderer, this.camera.controller, this.camera.data, canvas, uiComponents, updateUi, globalState)

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