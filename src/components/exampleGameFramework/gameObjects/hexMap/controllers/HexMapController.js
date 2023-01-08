
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../../utilities/collision';

import HexMapPathFinderClass from "../utils/HexMapPathFinder"

import HexMapViewSpritesRendererClass from '../view/HexMapViewSpritesRenderer';
import HexMapViewUtilsClass from '../view/HexMapViewUtils';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas, images, settings, uiComponents, updateUi) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas

        this.images = images


        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera, canvas, images);

        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

        this.viewUtils = new HexMapViewUtilsClass(hexMapData, camera, settings)

        this.renderer = new HexMapViewSpritesRendererClass(hexMapData, camera, images, this.viewUtils, settings)

        this.uiComponents = uiComponents

        this.updateUi = updateUi

    }

    setHover = (x, y) => {

        this.utils.resetHover()

        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        let hoverTile = this.utils.getSelectedTile(x, y, rotatedMap)

        if (!hoverTile) return

        let rotatedTile = rotatedMap.get(hoverTile.q + ',' + hoverTile.r)

        hoverTile = {
            q: rotatedTile.q,
            r: rotatedTile.r
        }

        let tileObj = this.hexMapData.getEntry(hoverTile.q, hoverTile.r)

        if (this.utils.getSelection(tileObj.position.q, tileObj.position.r) == null) {
            this.utils.setSelection(tileObj.position.q, tileObj.position.r, 'hover')
        }
    }

    selectTile = (tileClicked, tile) => {
        this.utils.resetSelected()

        if (this.hexMapData.getUnit(tileClicked.q, tileClicked.r) != null) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
            this.hexMapData.state = 'selectMovement'
        }
        else {
            this.utils.setSelection(tile.position.q, tile.position.r, 'info')
            this.hexMapData.state = 'selectTile'
        }
    }

    selectMovement = (tileClicked, tile) => {
        let unit = this.hexMapData.getSelectedUnit()

        if (unit == null) return

        if (this.utils.getSelection(tile.position.q, tile.position.r) == 'unit') return

        this.utils.resetSelected()

        let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

        if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.lerpUnit(unit)
            this.hexMapData.state = 'animation'
        } else {
            let newUnit = this.hexMapData.getUnit(tile.position.q, tile.position.r)
            if (newUnit == null) {
                this.utils.setSelection(tile.position.q, tile.position.r, 'info')
                this.hexMapData.state = 'selectTile'
            }
            else {
                this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
                this.utils.findMoveSet()
                this.hexMapData.state = 'selectMovement'
            }
        }
    }

    click = (x, y) => {

        this.uiComponents.contextMenu.show = !this.uiComponents.contextMenu.show
        this.uiComponents.contextMenu.x = x
        this.uiComponents.contextMenu.y = y - 150
        this.updateUi()

        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        let tileClicked = this.utils.getSelectedTile(x, y, rotatedMap)

        console.log(tileClicked)

        if (!tileClicked) return

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        tileClicked = {
            q: rotatedTile.q,
            r: rotatedTile.r
        }

        console.log(tileClicked)


        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

        switch (this.hexMapData.state) {
            case 'selectTile':
                this.selectTile(tileClicked, tile)
                return
            case 'selectMovement':
                this.selectMovement(tileClicked, tile)
                return
            case 'animation':
                return
        }
    }

    rotateRight = () => {
        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos();

            this.camera.rotateCameraRight()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 1) {

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.q - centerHexPos.r
                let newR = centerHexPos.r;
                let newS = centerHexPos.s;

                centerHexPos.q = -newR;
                centerHexPos.r = -newS;

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }
    }

    rotateLeft = () => {
        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos();

            this.camera.rotateCameraLeft()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 0) {

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            } else {

                centerHexPos.s = -centerHexPos.r - centerHexPos.q
                let newQ = centerHexPos.q;
                let newS = centerHexPos.s;

                centerHexPos.r = -newQ;
                centerHexPos.q = -newS;

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }
    }

    addUnit = () => {

        let selectedTile = this.hexMapData.getSelected()

        if (selectedTile != null && this.utils.getSelection(selectedTile.position.q, selectedTile.position.r) == 'info') {
            let unit = {
                position: {
                    q: selectedTile.position.q,
                    r: selectedTile.position.r
                },
                path: [],
                destination: null,
                destinationStartTime: null,
                destinationCurTime: null,
                name: 'Example Unit',
                type: 'units',
                sprite: 'exampleUnit',
                state: 'idle',
                frame: 0,
                frameStartTime: Date.now(),
                frameCurTime: Date.now(),
                rotation: 3,
                tileHeight: 3,
                movementRange: 5,
                renderImages: [],
                renderShadowImages: []
            }
            this.renderer.renderUnit(unit)
            this.hexMapData.unitList.push(unit)
        }

        this.utils.resetSelected()

    }

}