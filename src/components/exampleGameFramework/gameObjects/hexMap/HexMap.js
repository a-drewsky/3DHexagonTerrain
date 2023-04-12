import HexMapDataClass from "./data/HexMapData"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./view/HexMapView"
import HexMapSettingsClass from "./config/HexMapSettings"
import HexMapRendererClass from "./renderers/HexMapRenderer"
import HexMapUpdaterClass from "./updaters/HexMapUpdater"
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
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.tileManager.data, this.camera.data, this.images, canvas, this.settings)

        this.renderer = new HexMapRendererClass(this.data, this.tileManager, this.spriteManager, this.camera.data, this.settings)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.tileManager, this.spriteManager, this.settings, images, this.renderer, uiController)

        this.controller = new HexMapControllerClass(this.data, this.tileManager, this.spriteManager, this.camera.controller, this.camera.data, canvas, images, uiController, this.renderer, globalState)

        this.updater = new HexMapUpdaterClass(this.data, this.tileManager, this.spriteManager, images, this.settings, this.renderer, this.camera, canvas, uiController, globalState)

    }

    build = (q, r, mapSize) => {
        this.tileManager.builder.generateMap(q, r, mapSize)
        this.tileManager.builder.generateBiomes(mapSize)
        this.tileManager.builder.smoothBiomes()
        this.spriteManager.structures.builder.generateTerrain(q, r, mapSize)
        this.tileManager.builder.reduceTileHeights()
    }

    prerender = () => {
        this.tileManager.data.setRotatedMapList()
        let drawCanvas = this.view.initializeCanvas()
        this.renderer.prerender(drawCanvas)
        this.updater.prerender(drawCanvas)
        this.camera.prerender(drawCanvas)
        this.view.initializeCamera()

    }

    update = () => {
        this.renderer.update();
        this.updater.update();
    }

    draw = () => {
        this.view.draw();
    }

}