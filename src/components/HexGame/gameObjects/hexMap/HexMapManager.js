import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapDataClass from "./HexMapData"
import HexMapPrerendererClass from "./HexMapPrerenderer"
import HexMapUiUpdaterClass from "./HexMapUiUpdater"
import CameraManagerClass from "../camera/CameraManager"
import TileStackManagerClass from "../tileStack/TileStackManager"
import SpriteObjectManagerClass from "../spriteObjects/SpriteObjectManager"

export default class HexMapManagerClass {

    constructor(ctx, canvas, images, userConstants, uiController) {

        this.images = images

        this.data = new HexMapDataClass(canvas, images, uiController)
        this.cameraManager = new CameraManagerClass(this.data)
        this.tileManager = new TileStackManagerClass(this.data, this.images)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.images, uiController)

        this.view = new HexMapViewClass(ctx, canvas, this.data, userConstants, images, uiController)
        this.prerenderer = new HexMapPrerendererClass(this.data, this.tileManager, this.spriteManager)
        this.controller = new HexMapControllerClass(this.data, canvas)
        this.uiUpdater = new HexMapUiUpdaterClass(this.data, canvas, uiController)

    }

    clear = () => {
        this.cameraManager = null
        this.data.tileData.tileMap.clear()
        this.tileManager = null
        this.spriteManager.structures.data.structureMap.clear()
        this.spriteManager.units.data.unitList = []
        this.data = null
        this.spriteManager = null
        this.prerenderer = null
        this.view = null
        this.controller = null
        this.uiUpdater = null
    }

    build = (mapSizeConstant) => {
        this.tileManager.builder.buildMap(mapSizeConstant)
        this.spriteManager.structures.builder.generateStructures(mapSizeConstant)
        this.tileManager.builder.reduceTileHeights()

        this.data.cardData.initializeCards()
    }

    prerender = () => {
        let drawCanvas = this.view.initializeCanvas()
        this.prerenderer.prerender(drawCanvas)
        this.uiUpdater.prerender(drawCanvas)
        this.cameraManager.prerender(drawCanvas)
        this.data.tileData.initMapPosition(drawCanvas)
        this.view.initializeCamera()
    }

    update = () => {
        this.prerenderer.update()
        this.cameraManager.update()
        this.uiUpdater.update()
        this.spriteManager.update()
        this.tileManager.update()
    }

    draw = () => {
        this.view.draw()
    }

}