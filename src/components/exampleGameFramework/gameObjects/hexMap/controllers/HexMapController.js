
import HexMapControllerUtilsClass from '../utils/HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';
import HexMapPathFinderClass from "../utils/HexMapPathFinder";
import HexMapConfigClass from '../config/hexMapConfig';

import HexMapControllerMouseClass from './HexMapControllerMouse';
import HexMapControllerUiClass from './HexMapControllerUi';

export default class HexMapControllerClass {

    constructor(hexMapData, unitManager, cameraController, cameraData, canvas, images, settings, uiController, renderer, globalState) {

        this.hexMapData = hexMapData;

        this.unitManager = unitManager

        this.canvas = canvas

        this.images = images

        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, unitManager, cameraData)
        
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, unitManager, cameraData, canvas, images, uiController, renderer, globalState);

        this.config = new HexMapConfigClass()

        this.cameraController = cameraController

        this.cameraData = cameraData;

        this.mouseController = new HexMapControllerMouseClass(hexMapData, unitManager, renderer, this.pathFinder, this.utils, uiController, this.config)

        this.uiController = new HexMapControllerUiClass(hexMapData, unitManager, cameraController, cameraData, canvas, this.utils, uiController)

    }

    mouseDown = (x, y) => {

        this.cameraData.clickPos = { x: x, y: y }
        this.cameraData.clickMovePos = { x: x, y: y }
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

            let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

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

        this.hexMapData.selections.resetHover()

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
        this.hexMapData.selections.resetHover()
    }

}