import HexMapDataClass from "./HexMapData"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"
import HexMapprerendererClass from "./HexMapPrerenderer"
import HexMapUiUpdaterClass from "./HexMapUiUpdater"
import CameraClass from "../camera/Camera"

import TileStackManagerClass from "../tileStack/TileStackManager"
import SpriteObjectManagerClass from "../spriteObjects/SpriteObjectManager"

export default class HexMapClass {

    constructor(ctx, canvas, images, settings, uiController, globalState) {

        this.settings = new HexMapSettingsClass(settings)
        this.images = images

        this.data = new HexMapDataClass(this.settings, canvas)

        this.camera = new CameraClass(this.data, canvas)

        this.tileManager = new TileStackManagerClass(this.data, this.camera.data, this.images, this.settings, canvas)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.tileManager.data, this.camera.data, this.images, canvas, this.settings, uiController, globalState)

        this.prerenderer = new HexMapprerendererClass(this.data, this.tileManager, this.spriteManager)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.tileManager, this.spriteManager, this.settings, images, uiController)

        this.controller = new HexMapControllerClass(this.data, this.tileManager, this.spriteManager, this.camera.controller, this.camera.data, canvas, images, uiController, globalState)

        this.uiUpdater = new HexMapUiUpdaterClass(this.data, this.camera, canvas, uiController)

    }

    build = (q, r, mapSize) => {
        this.tileManager.builder.buildMap(q, r, mapSize)
        this.spriteManager.structures.builder.generateStructures(q, r, mapSize)
        this.tileManager.builder.reduceTileHeights()
    }

    prerender = () => {
        this.tileManager.data.setRotatedMapList()
        let drawCanvas = this.view.initializeCanvas()
        this.prerenderer.prerender(drawCanvas)
        this.uiUpdater.prerender(drawCanvas)
        this.camera.prerender(drawCanvas)
        this.tileManager.data.setMapPos(drawCanvas);
        this.view.initializeCamera()

    }

    update = () => {
        this.prerenderer.update();
        this.camera.updater.update()
        this.uiUpdater.update();
        this.spriteManager.update()
        this.spriteManager.render()
    }

    draw = () => {
        this.view.draw();
    }

}