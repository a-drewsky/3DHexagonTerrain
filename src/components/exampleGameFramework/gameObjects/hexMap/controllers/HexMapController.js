
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';

import HexMapControllerMouseClass from './HexMapControllerMouse';
import HexMapControllerContextMenuClass from './HexMapControllerContextMenu';

export default class HexMapControllerClass {

    constructor(hexMapData, tileManager, spriteManager, cameraManager, canvas, images, uiController, globalState) {

        this.hexMapData = hexMapData;

        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.canvas = canvas

        this.images = images

        this.collision = new CollisionClass();

        this.utils = new HexMapControllerUtilsClass(this.hexMapData, tileManager, spriteManager, cameraManager.data, canvas, images, uiController, globalState);

        this.cameraManager = cameraManager

        this.mouseController = new HexMapControllerMouseClass(hexMapData, tileManager, spriteManager, this.utils, uiController, this.config)

        this.contextMenuController = new HexMapControllerContextMenuClass(hexMapData, tileManager, spriteManager, canvas, this.utils, uiController)

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

    zoom = (deltaY) => {
        this.cameraManager.controller.zoom(deltaY)
        this.hexMapData.resetHover()
    }

    selectTile = (tileSelected, clickPos) => {

        let tile = this.tileManager.data.getEntry(tileSelected.q, tileSelected.r)

        switch (this.hexMapData.curState()) {
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
                this.mouseController.endUnitTurn()
                return
            case 'selectAction':
                return
            case 'animation':
                return
        }

    }

    mouseMove = (x, y) => {

        this.cameraManager.controller.mouseMove(x, y)

        this.hexMapData.resetHover()

        switch (this.hexMapData.curState()) {
            case 'selectTile':
            case 'placeUnit':
            case 'animation':
                this.mouseController.setHover(x, y)
                return
            case 'selectMovement':
                this.mouseController.updatePathSelection(x, y)
                return
            case 'chooseRotation':
                this.mouseController.setUnitMouseDirection(x, y)
                this.mouseController.setHover(x, y)
                return
            case 'selectAction':
                return
        }
    }


    contextMenu = (input) => {
        this.contextMenuController.select(input)
    }

    selectCard = () => {
        if (this.hexMapData.curState() != 'selectTile') return

        this.hexMapData.resetSelected()
        this.hexMapData.resetHover()
        this.utils.findPlacementSet()
        this.spriteManager.units.data.createUnit()
        this.hexMapData.setState('placeUnit')
    }

    selectCard_new = (cardNum) => {
        if(this.hexMapData.selectedCard == cardNum){
            this.hexMapData.selectedCard = null
            return
        }
        this.hexMapData.selectedCard = null
        if(this.hexMapData.cards[cardNum].flipped){
            this.hexMapData.flipCard()
            this.hexMapData.addCard()
        } else {
            this.hexMapData.selectedCard = cardNum
        }
    }

    useCard = () => {
        this.selectCard()
        this.hexMapData.removeCard()
        this.hexMapData.addCard()
        this.hexMapData.selectedCard = null
    }

    scrapCard = () => {
        this.hexMapData.removeCard()
        this.hexMapData.addCard()
        this.hexMapData.selectedCard = null
    }

    rotateRight = () => {

        let zoomAmount = this.cameraManager.data.zoomAmount
        let zoomLevel = this.cameraManager.data.zoom

        let zoom = zoomLevel * zoomAmount
        let newRotation = this.cameraManager.data.rotation

        for (let i = 0; i < this.cameraManager.data.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos(newRotation);

            newRotation++
            if (newRotation >= 12) newRotation = 0 + (newRotation - 12);

            //Set camera position
            let squish = this.hexMapData.squish;

            if (newRotation % 2 == 1) {

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.cameraManager.data.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.q - centerHexPos.r
                let newR = centerHexPos.r;
                let newS = centerHexPos.s;

                centerHexPos.q = -newR;
                centerHexPos.r = -newS;

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.cameraManager.data.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraManager.controller.rotateRight()
        this.hexMapData.resetHover()
        this.hexMapData.renderBackground = true
    }

    rotateLeft = () => {

        let zoomAmount = this.cameraManager.data.zoomAmount
        let zoomLevel = this.cameraManager.data.zoom

        let zoom = zoomLevel * zoomAmount

        let newRotation = this.cameraManager.data.rotation

        for (let i = 0; i < this.cameraManager.data.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos(newRotation);

            newRotation--
            if (newRotation <= -1) newRotation = 11 + (newRotation + 1);

            //Set camera position
            let squish = this.hexMapData.squish;

            if (newRotation % 2 == 0) {

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.cameraManager.data.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.r - centerHexPos.q
                let newQ = centerHexPos.q;
                let newS = centerHexPos.s;

                centerHexPos.r = -newQ;
                centerHexPos.q = -newS;

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.cameraManager.data.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraManager.controller.rotateLeft()
        this.hexMapData.resetHover()
        this.hexMapData.renderBackground = true
    }

}