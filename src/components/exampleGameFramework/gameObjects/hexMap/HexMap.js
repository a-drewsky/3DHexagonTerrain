import HexMapDataClass from "./HexMapData"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./HexMapView"
import TileStackDataClass from '../tileStack/TileStackData'
import StructureDataClass from '../spriteObjects/structures/StructureData'
import UnitDataClass from "../spriteObjects/unit/UnitData"
import HexMapprerendererClass from "./HexMapPrerenderer"
import HexMapUiUpdaterClass from "./HexMapUiUpdater"
import CameraClass from "../camera/Camera"

import TileStackManagerClass from "../tileStack/TileStackManager"
import SpriteObjectManagerClass from "../spriteObjects/SpriteObjectManager"

export default class HexMapClass {

    constructor(ctx, canvas, images, userConstants, uiController, globalState) {

        this.images = images

        this.data = new HexMapDataClass(canvas)
        this.tileData = new TileStackDataClass(this.data, images)
        this.structureData = new StructureDataClass(this.data, images.structures)
        this.unitData = new UnitDataClass(this.data, this.tileData, images, uiController, globalState)

        this.camera = new CameraClass(this.data, canvas)

        this.tileManager = new TileStackManagerClass(this.data, this.tileData, this.structureData, this.unitData, this.camera.data, this.images, canvas)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.tileData, this.structureData, this.unitData, this.camera.data, this.images, canvas)

        this.prerenderer = new HexMapprerendererClass(this.data, this.tileManager, this.spriteManager)

        this.view = new HexMapViewClass(ctx, canvas, this.camera.data, this.data, this.tileManager, this.spriteManager, userConstants, images, uiController)

        this.controller = new HexMapControllerClass(this.data, this.tileManager, this.spriteManager, this.camera.controller, this.camera.data, canvas, images, uiController, globalState)

        this.uiUpdater = new HexMapUiUpdaterClass(this.data, this.camera, canvas, uiController)

    }

    clear = () => {
        this.data = null
        this.camera = null
        this.tileData.tileMap.clear()
        this.tileManager = null
        this.spriteManager.structures.data.structureMap.clear()
        this.spriteManager.units.data.unitList = []
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
    }

    prerender = () => {
        this.tileData.setRotatedMapList()
        let drawCanvas = this.view.initializeCanvas()
        this.prerenderer.prerender(drawCanvas)
        this.uiUpdater.prerender(drawCanvas)
        this.camera.prerender(drawCanvas)
        this.tileData.setMapPos(drawCanvas);
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