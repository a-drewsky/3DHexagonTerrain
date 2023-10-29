import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapDataClass from "./HexMapData"
import HexMapprerendererClass from "./HexMapPrerenderer"
import HexMapUiUpdaterClass from "./HexMapUiUpdater"
import CameraManagerClass from "../camera/CameraManager"
import TileStackManagerClass from "../tileStack/TileStackManager"
import SpriteObjectManagerClass from "../spriteObjects/SpriteObjectManager"

export default class HexMapManagerClass {

    constructor(ctx, canvas, images, userConstants, uiController, globalState) {

        this.images = images

        this.data = new HexMapDataClass(canvas, images, uiController, globalState)
        this.cameraManager = new CameraManagerClass(this.data, canvas)
        this.tileManager = new TileStackManagerClass(this.data, this.images, canvas)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.images, canvas)

        this.prerenderer = new HexMapprerendererClass(this.data, this.tileManager, this.spriteManager)
        this.view = new HexMapViewClass(ctx, canvas, this.data, this.tileManager, this.spriteManager, userConstants, images, uiController)
        this.controller = new HexMapControllerClass(this.data, this.tileManager, this.spriteManager, this.cameraManager, canvas, images, uiController, globalState)
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

        //TEMP
        this.data.cardData.addCard()
        this.data.cardData.flipCard()
        this.data.cardData.addCard()
        this.data.cardData.flipCard()
        this.data.cardData.addCard()
        this.data.cardData.flipCard()
        this.data.cardData.addCard()
    }

    prerender = () => {
        this.data.tileData.setRotatedMapList()
        let drawCanvas = this.view.initializeCanvas()
        this.prerenderer.prerender(drawCanvas)
        this.uiUpdater.prerender(drawCanvas)
        this.cameraManager.prerender(drawCanvas)
        this.data.tileData.setMapPos(drawCanvas)
        this.view.initializeCamera()

    }

    update = () => {
        this.prerenderer.update()
        this.cameraManager.update()
        this.uiUpdater.update()
        this.spriteManager.update()
        this.tileManager.render()
        this.spriteManager.render()
    }

    draw = () => {
        this.view.draw()
    }

}