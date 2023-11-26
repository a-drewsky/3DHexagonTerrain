import HexMapControllerClass from "../controllers/hexmapControllers/HexMapController"
import HexMapDataClass from "../gameObjects/hexMap/HexMapData"
import HexMapPrerendererClass from "../gameObjects/hexMap/HexMapPrerenderer"
import UiManagerClass from "./UiManager"
import CameraManagerClass from "./CameraManager"
import TileStackManagerClass from "./TileStackManager"
import SpriteObjectManagerClass from "./SpriteObjectManager"

export default class HexMapManagerClass {

    constructor(canvas, images, uiController) {

        this.images = images

        this.data = new HexMapDataClass(canvas, images)
        this.cameraManager = new CameraManagerClass(this.data)
        this.tileManager = new TileStackManagerClass(this.data, this.images)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.images, uiController)

        this.prerenderer = new HexMapPrerendererClass(this.data, this.tileManager, this.spriteManager)
        this.controller = new HexMapControllerClass(this.data, canvas)
        this.uiManager = new UiManagerClass(this.data, canvas, uiController)

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
        this.controller = null
        this.uiManager = null
    }

    build = (mapSizeConstant) => {
        this.tileManager.builder.buildMap(mapSizeConstant)
        this.spriteManager.structures.builder.generateStructures(mapSizeConstant)
        this.tileManager.builder.reduceTileHeights()

        this.data.cardData.initializeCards()
    }

    prerender = (hexmapCanvas) => {
        this.prerenderer.prerender(hexmapCanvas)
        this.uiManager.prerender(hexmapCanvas)
        this.cameraManager.prerender(hexmapCanvas)
        this.data.tileData.initMapPosition(hexmapCanvas)
    }

    update = () => {
        this.prerenderer.update()
        this.cameraManager.update()
        this.uiManager.update()
        this.spriteManager.update()
        this.tileManager.update()
    }

}