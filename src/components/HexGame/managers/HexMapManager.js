
import RenderStackManagerClass from "./RenderStackManager"
import UiManagerClass from "./UiManager"
import CameraManagerClass from "./CameraManager"
import TileStackManagerClass from "./TileStackManager"
import SpriteObjectManagerClass from "./SpriteObjectManager"

export default class HexMapManagerClass {

    constructor(canvas, images, uiInterface, gameData) {

        this.cameraManager = new CameraManagerClass(gameData)
        this.tileManager = new TileStackManagerClass(gameData, images)
        this.spriteManager = new SpriteObjectManagerClass(gameData, images)
        this.renderStackManager = new RenderStackManagerClass(gameData, this.tileManager, this.spriteManager)
        this.uiManager = new UiManagerClass(gameData, canvas, uiInterface)

    }

    build = (mapSizeConstant) => {
        this.tileManager.builder.buildMap(mapSizeConstant)
        this.spriteManager.structures.builder.generateStructures(mapSizeConstant)
        this.tileManager.builder.reduceTileHeights()

        this.uiManager.cardData.initializeCards()
    }

    prerender = (hexmapCanvas) => {
        this.renderStackManager.prerender(hexmapCanvas)
        this.uiManager.prerender(hexmapCanvas)
        this.cameraManager.prerender(hexmapCanvas)
        this.tileManager.data.initMapPosition(hexmapCanvas)
    }

    update = () => {
        this.renderStackManager.update()
        this.cameraManager.update()
        this.uiManager.update()
        this.spriteManager.update()
        this.tileManager.update()
        
    }

}