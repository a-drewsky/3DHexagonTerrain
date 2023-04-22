
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';

import HexMapControllerMouseClass from './HexMapControllerMouse';
import HexMapControllerUiClass from './HexMapControllerUi';

export default class HexMapControllerClass {

    constructor(hexMapData, tileManager, spriteManager, cameraController, cameraData, canvas, images, uiController, globalState) {

        this.hexMapData = hexMapData;

        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.canvas = canvas

        this.images = images

        this.collision = new CollisionClass();
        
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, tileManager, spriteManager, cameraData, canvas, images, uiController, globalState);

        this.cameraController = cameraController

        this.cameraData = cameraData;

        this.mouseController = new HexMapControllerMouseClass(hexMapData, tileManager, spriteManager, this.utils, uiController, this.config)

        this.uiController = new HexMapControllerUiClass(hexMapData, tileManager, spriteManager, cameraController, cameraData, canvas, this.utils, uiController)

    }

    mouseDown = (x, y) => {
        this.cameraController.mouseDown(x, y)
    }

    mouseUp = () => {

        this.cameraController.mouseUp()

        if (this.cameraData.clickPos !== null) {

            let clickPos = {
                x: this.cameraData.clickPos.x,
                y: this.cameraData.clickPos.y
            }

            this.cameraData.clickPos = null

            let tileClicked = this.utils.getSelectedTile(clickPos.x, clickPos.y)

            if (!tileClicked) return

            let tile = this.tileManager.data.getEntry(tileClicked.q, tileClicked.r)

            switch (this.hexMapData.state.current) {
                case 'selectTile':
                    this.mouseController.selectTile(tileClicked, tile)
                    return
                case 'selectMovement':
                    this.mouseController.selectMovement(tileClicked, tile, clickPos.x, clickPos.y)
                    return
                case 'placeUnit':
                    this.mouseController.addUnit(tile)
                    return
                case 'chooseRotation':
                    this.mouseController.endUnitTurn()
                    return
                case 'selectAction':
                    return
                case 'animation':
                    return
            }

        }
    }

    mouseMove = (x, y) => {

        this.cameraController.mouseMove(x, y)

        if (this.cameraData.clickMovePos !== null) {
            this.cameraData.clickMovePos.x = x
            this.cameraData.clickMovePos.y = y
        }

        this.hexMapData.resetHover()

        switch (this.hexMapData.state.current) {
            case 'selectTile':
            case 'placeUnit':
            case 'animation':
                this.mouseController.setHover(x, y)
                return
            case 'selectMovement':
                this.mouseController.updateUnitPath(x, y)
                return
            case 'chooseRotation':
                this.mouseController.setUnitMouseDirection(x, y)
                this.mouseController.setHover(x, y)
                return
            case 'selectAction':
                return
        }
    }

    zoom = (deltaY) => {
        this.cameraController.zoom(deltaY)
        this.hexMapData.resetHover()
    }

}