import HexMapDataClass from "./data/HexMapData"
import HexMapBuilderClass from "./builders/HexMapBuilder"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./view/HexMapView"
import HexMapSettingsClass from "./config/HexMapSettings"
import HexMapRendererClass from "./renderers/HexMapRenderer"
import HexMapUpdaterClass from "./updaters/HexMapUpdater"
import CameraClass from "../camera/Camera"
import HexMapUnitManagerClass from "./HexMapUnitManager"

export default class HexMapClass {

    constructor(ctx, canvas, images, settings, uiController, globalState) {

        this.settings = new HexMapSettingsClass(settings)
        this.images = images
        this.camera = new CameraClass(canvas)

        this.data = new HexMapDataClass(this.settings, canvas)

        this.unitManager = new HexMapUnitManagerClass(this.data, this.camera.data, this.images, this.settings)

        this.renderer = new HexMapRendererClass(this.data, this.unitManager, this.camera.data, this.settings, images)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.unitManager, this.settings, images, this.renderer, uiController)

        this.builder = new HexMapBuilderClass(this.data, this.settings)

        this.controller = new HexMapControllerClass(this.data, this.unitManager, this.camera.controller, this.camera.data, canvas, images, this.settings, uiController, this.renderer, globalState)

        this.updater = new HexMapUpdaterClass(this.data, this.unitManager, images, this.settings, this.renderer, this.camera.controller, this.camera.data, canvas, uiController, globalState)

    }

    build = (q, r, size) => {
        this.builder.build(q, r, size);
    }

    prerender = () => {
        this.data.setRotatedMapList()
        this.view.initializeCanvas()
        this.renderer.prerender(this.view.drawCanvas)
        this.updater.prerender(this.view.drawCanvas)
        this.view.initializeCamera()

    }

    update = (state) => {
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