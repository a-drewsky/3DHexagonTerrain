
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';

import HexMapControllerMouseClass from './HexMapControllerMouse';
export default class HexMapControllerClass {

    constructor(hexMapData, tileManager, spriteManager, cameraManager, canvas, images, uiController, globalState) {

        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData

        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.canvas = canvas

        this.images = images

        this.collision = new CollisionClass()

        this.utils = new HexMapControllerUtilsClass(hexMapData, tileManager, spriteManager, canvas, images, uiController, globalState)

        this.cameraManager = cameraManager

        this.mouseController = new HexMapControllerMouseClass(hexMapData, tileManager, spriteManager, this.utils, uiController, this.config)

    }

    mouseDown = (x, y) => {
        this.cameraManager.controller.mouseDown(x, y)
    }

    mouseUp = () => {

        this.cameraManager.controller.mouseUp()

        if (this.cameraManager.data.clickPos !== null) {

            let clickPos = {
                x: this.cameraManager.data.clickPos.x,
                y: this.cameraManager.data.clickPos.y
            }

            this.cameraManager.data.clickPos = null

            let tileSelected = this.utils.getSelectedTile(clickPos.x, clickPos.y)

            if (!tileSelected) return

            this.selectTile(tileSelected, clickPos)

        }
    }

    mouseMove = (x, y) => {

        this.cameraManager.controller.mouseMove(x, y)

        this.selectionData.clearHover()

        switch (this.mapData.curState()) {
            case 'selectTile':
            case 'animation':
                this.mouseController.setHover(x, y)
                return
            case 'placeUnit':
                this.mouseController.updatePlacementSelection(x, y)
                return
            case 'selectMovement':
                this.mouseController.updatePathSelection(x, y)
                return
            case 'chooseRotation':
                this.mouseController.setUnitMouseDirection(x, y)
                this.mouseController.updateEndMoveSelection(x, y)
                return
            case 'selectAction':
                return
        }
    }

    zoom = (deltaY) => {
        this.cameraManager.controller.zoom(deltaY)
        this.selectionData.clearHover()
    }

    selectTile = (tileSelected, clickPos) => {

        let tile = this.tileManager.data.getEntry(tileSelected.q, tileSelected.r)

        switch (this.mapData.curState()) {
            case 'selectTile':
                this.mouseController.selectTile(tile)
                return
            case 'selectMovement':
                this.mouseController.selectMovement(tile, clickPos.x, clickPos.y)
                return
            case 'placeUnit':
                this.mouseController.addUnit(tile)
                return
            case 'chooseRotation':
                this.mouseController.endUnitTurn(tile)
                return
            case 'selectAction':
                return
            case 'animation':
                return
        }

    }

    selectCard = (cardNum) => {
        if (this.mapData.curState() != 'selectTile') return

        if (this.cardData.selectedCard == cardNum) {
            this.cardData.selectedCard = null
            return
        }
        this.cardData.selectedCard = null
        if (this.cardData.cards[cardNum].flipped) {
            this.cardData.flipCard()
            this.cardData.addCard()
        } else {
            this.cardData.selectedCard = cardNum
        }
    }

    useCard = () => {
        if (this.mapData.curState() != 'selectTile') return
        if (!this.cardData.canUseCard(this.mapData.resources)) return

        this.selectionData.clearAllSelections()
        this.selectionData.clearHover()
        this.utils.findPlacementSet()
        this.spriteManager.units.data.createUnit(this.cardData.cards[this.cardData.selectedCard].unitId)
        this.mapData.setState('placeUnit')

        this.cardData.useCard(this.mapData.resources)
        this.cardData.addCard()
        this.cardData.selectedCard = null
    }

    scrapCard = () => {
        this.cardData.scrapCard(this.mapData.resources)
        this.cardData.addCard()
        this.cardData.selectedCard = null
    }

    rotateRight = () => {

        let zoomAmount = this.cameraManager.data.zoomAmount
        let zoomLevel = this.cameraManager.data.zoom

        let zoom = zoomLevel * zoomAmount
        let newRotation = this.cameraManager.data.rotation

        let centerHexPos = this.utils.getCenterHexPos(newRotation);

        newRotation++
        if (newRotation >= 6) newRotation = newRotation - 6

        //Set camera position
        let squish = this.mapData.squish;


        let vecQ = this.mapData.flatTopVecQ;
        let vecR = this.mapData.flatTopVecR;

        centerHexPos.s = -centerHexPos.q - centerHexPos.r
        let newR = centerHexPos.r;
        let newS = centerHexPos.s;

        centerHexPos.q = -newR;
        centerHexPos.r = -newS;

        this.cameraManager.data.setCameraPos(
            vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
            vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
        )




        this.cameraManager.controller.rotateRight()
        this.selectionData.clearHover()
        this.mapData.renderBackground = true
    }

    rotateLeft = () => {

        let zoomAmount = this.cameraManager.data.zoomAmount
        let zoomLevel = this.cameraManager.data.zoom

        let zoom = zoomLevel * zoomAmount

        let newRotation = this.cameraManager.data.rotation

        let centerHexPos = this.utils.getCenterHexPos(newRotation);

        newRotation--
        if (newRotation < 0) newRotation = 6 + newRotation;

        //Set camera position
        let squish = this.mapData.squish;

        centerHexPos.s = -centerHexPos.r - centerHexPos.q
        let newQ = centerHexPos.q;
        let newS = centerHexPos.s;

        centerHexPos.r = -newQ;
        centerHexPos.q = -newS;

        let vecQ = this.mapData.flatTopVecQ;
        let vecR = this.mapData.flatTopVecR;

        this.cameraManager.data.setCameraPos(
            vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
            vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
        );

        this.cameraManager.controller.rotateLeft()
        this.selectionData.clearHover()
        this.mapData.renderBackground = true
    }

}