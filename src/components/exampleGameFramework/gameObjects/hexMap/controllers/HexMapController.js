
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';
import HexMapPathFinderClass from "../utils/HexMapPathFinder"
import HexMapViewUtilsClass from '../view/HexMapViewUtils';
import HexMapConfigClass from '../config/hexMapConfig';

import HexMapControllerMouseClass from './HexMapControllerMouse';
import HexMapControllerUiClass from './HexMapControllerUi';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas, images, settings, uiComponents, updateUi, renderer, globalState) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas

        this.images = images

        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

        this.viewUtils = new HexMapViewUtilsClass(hexMapData, camera, settings, images)

        this.renderer = renderer
        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera, canvas, images, uiComponents, updateUi, renderer, globalState);

        this.config = new HexMapConfigClass()

        this.uiComponents = uiComponents

        this.updateUi = updateUi

        this.mouseController = new HexMapControllerMouseClass(hexMapData, renderer, this.pathFinder, this.utils, this.config)

        this.uiController = new HexMapControllerUiClass(hexMapData, camera, canvas, this.utils)

    }

    mouseDown = (x, y) => {

        this.hexMapData.clickPos = { x: x, y: y }
        this.hexMapData.clickMovePos = { x: x, y: y }
    }

    mouseUp = () => {

        if (this.hexMapData.clickPos !== null) {

            let clickPos = {
                x: this.hexMapData.clickPos.x,
                y: this.hexMapData.clickPos.y
            }

            this.hexMapData.clickPos = null

            let tileClicked = this.utils.getSelectedTile(clickPos.x, clickPos.y)

            if (!tileClicked) return

            let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

            switch (this.hexMapData.state) {
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

        if (this.hexMapData.clickMovePos !== null) {
            this.hexMapData.clickMovePos.x = x
            this.hexMapData.clickMovePos.y = y
        }

        this.utils.resetHover()

        switch (this.hexMapData.state) {
            case 'selectTile':
            case 'placeUnit':
            case 'animation':
                this.mouseController.setHover(x, y)
                return
            case 'chooseRotation':
                this.mouseController.setUnitMouseDirection(x, y)
                this.mouseController.setHover(x, y)
                return
            case 'selectAction':
                return
            case 'selectMovement':
                this.mouseController.updateUnitPath(x, y)
        }
    }

}