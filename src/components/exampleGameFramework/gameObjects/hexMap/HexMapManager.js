import HexMapDataClass from "./HexMapData"
import HexMapControllerClass from "./controllers/HexMapController"
import HexMapViewClass from "./HexMapView"
import TileStackDataClass from '../tileStack/TileStackData'
import StructureDataClass from '../spriteObjects/structures/StructureData'
import UnitDataClass from "../spriteObjects/unit/UnitData"
import CameraDataClass from "../camera/CameraData"
import HexMapprerendererClass from "./HexMapPrerenderer"
import HexMapUiUpdaterClass from "./HexMapUiUpdater"
import CameraManagerClass from "../camera/CameraManager"

import TileStackManagerClass from "../tileStack/TileStackManager"
import SpriteObjectManagerClass from "../spriteObjects/SpriteObjectManager"

export default class HexMapManagerClass {

    constructor(ctx, canvas, images, userConstants, uiController, globalState) {

        this.images = images

        this.data = new HexMapDataClass(canvas)
        this.tileData = new TileStackDataClass(this.data, images)
        this.structureData = new StructureDataClass(this.data, images.structures)
        this.unitData = new UnitDataClass(this.data, this.tileData, images, uiController, globalState)
        this.cameraData = new CameraDataClass(this.data, canvas)

        this.cameraManager = new CameraManagerClass(this.data, this.cameraData, canvas)
        this.tileManager = new TileStackManagerClass(this.data, this.tileData, this.structureData, this.unitData, this.cameraData, this.images, canvas)
        this.spriteManager = new SpriteObjectManagerClass(this.data, this.tileData, this.structureData, this.unitData, this.cameraData, this.images, canvas)

        this.prerenderer = new HexMapprerendererClass(this.data, this.tileManager, this.spriteManager)
        this.view = new HexMapViewClass(ctx, canvas, this.cameraData, this.data, this.tileManager, this.spriteManager, userConstants, images, uiController)
        this.controller = new HexMapControllerClass(this.data, this.tileManager, this.spriteManager, this.cameraManager, canvas, images, uiController, globalState)
        this.uiUpdater = new HexMapUiUpdaterClass(this.data, this.cameraData, canvas, uiController)

    }

    clear = () => {
        this.data = null
        this.cameraManager = null
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

        //TEMP
        this.data.addCard()
        this.data.flipCard()
        this.data.addCard()
        this.data.flipCard()
        this.data.addCard()
        this.data.flipCard()
        this.data.addCard()
    }

    prerender = () => {
        this.tileData.setRotatedMapList()
        let drawCanvas = this.view.initializeCanvas()
        this.prerenderer.prerender(drawCanvas)
        this.uiUpdater.prerender(drawCanvas)
        this.cameraManager.prerender(drawCanvas)
        this.tileData.setMapPos(drawCanvas);
        this.view.initializeCamera()

    }

    update = () => {
        this.prerenderer.update();
        this.cameraManager.update()
        this.uiUpdater.update();
        this.spriteManager.update()
        this.spriteManager.render()
    }

    draw = () => {
        this.view.draw();
    }

}