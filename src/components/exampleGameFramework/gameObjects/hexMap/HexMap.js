import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./builders/HexMapBuilder"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./view/HexMapView"
import HexMapSettingsClass from "./config/HexMapSettings"
import HexMapRendererClass from "./renderers/HexMapRenderer"
import HexMapUpdaterClass from "./updaters/HexMapUpdater"
import CameraClass from "../camera/Camera"

export default class HexMapClass {

    constructor(ctx, canvas, images, settings, uiComponents, globalState, setBgCanvas) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas)

        this.camera = new CameraClass(canvas)

        this.renderer = new HexMapRendererClass(this.data, this.camera.data, this.settings, images)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.settings, images, this.renderer, setBgCanvas)

        this.builder = new HexMapBuilderClass(this.data, this.settings)

        this.controller = new HexMapControllerClass(this.data, this.camera.controller, this.camera.data, canvas, images, this.settings, uiComponents, this.renderer, setBgCanvas, globalState)

        this.updater = new HexMapUpdaterClass(this.data, images, this.settings, this.renderer, this.camera.controller, this.camera.data, canvas, uiComponents, globalState)

        this.images = images
    }

    build = (q, r, size) => {
        this.builder.build(q, r, size);
    }

    prerender = () => {
        this.data.setRotatedMapList()
        this.view.initializeCanvas()
        this.renderer.prerender(this.view.drawCanvas)
        this.view.initializeCamera()

    }

    update = (state) => {
        this.view.update();
        this.renderer.update();
        this.updater.update();
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view.clear()
    }

}