
import HexMapControllerUtilsClass from './HexMapControllerUtils';
import CollisionClass from '../../utilities/collision';

import HexMapPathFinderClass from "./HexMapPathFinder"

import HexMapViewSpritesRendererClass from './HexMapViewSpritesRenderer';
import HexMapViewUtilsClass from './HexMapViewUtils';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas, images, settings) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas

        this.images = images


        this.utils = new HexMapControllerUtilsClass(this.hexMapData, this.camera);

        this.collision = new CollisionClass();

        this.pathFinder = new HexMapPathFinderClass(this.hexMapData, this.camera)

        this.viewUtils = new HexMapViewUtilsClass(hexMapData, camera, settings)

        this.renderer = new HexMapViewSpritesRendererClass(hexMapData, camera, images, this.viewUtils, settings)

    }

    setHover = (x, y) => {

        this.utils.resetHover()

        x *= (this.canvas.width + this.camera.zoom * this.camera.zoomAmount) / this.canvas.width
        y *= (this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width)) / this.canvas.height


        let ogPos = {
            x: x,
            y: y
        }

        x += this.camera.position.x
        y += this.camera.position.y

        x -= this.hexMapData.posMap.get(this.camera.rotation).x

        y -= this.hexMapData.posMap.get(this.camera.rotation).y

        let hoverHex = {
            q: ((2 / 3 * x)) / this.hexMapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.hexMapData.squish))) / this.hexMapData.size
        }

        hoverHex = this.hexMapData.roundToNearestHex(hoverHex.q, hoverHex.r)


        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]

        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        let hoverTile = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hoverHex.q + testList[i].q,
                r: hoverHex.r + testList[i].r
            }

            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                hoverTile = testTile
                continue
            }

            let tileTerrain = this.hexMapData.getTerrain(testTile.q, testTile.r)
            let tileUnit = this.hexMapData.getUnit(testTile.q, testTile.r)

            if (tileTerrain && tileTerrain.type == 'structures') {
                
                let spriteObj = this.images[tileTerrain.type][tileTerrain.sprite]

                //make function to get these attributes
                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    hoverTile = testTile
                    continue
                }

            }

            if(tileUnit && tileUnit.state == 'idle'){
                let spriteObj = this.images[tileUnit.type][tileUnit.sprite]

                console.log(spriteObj)

                //make function to get these attributes
                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    hoverTile = testTile
                    continue
                }
            }

        }


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

    click = (x, y) => {

        x *= (this.canvas.width + this.camera.zoom * this.camera.zoomAmount) / this.canvas.width
        y *= (this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width)) / this.canvas.height


        let ogPos = {
            x: x,
            y: y
        }

        x += this.camera.position.x
        y += this.camera.position.y

        x -= this.hexMapData.posMap.get(this.camera.rotation).x

        y -= this.hexMapData.posMap.get(this.camera.rotation).y

        console.log(x, y)


        let hexClicked = {
            q: ((2 / 3 * x)) / this.hexMapData.size,
            r: ((-1 / 3 * x) + (Math.sqrt(3) / 3) * (y * (1 / this.hexMapData.squish))) / this.hexMapData.size
        }

        hexClicked = this.hexMapData.roundToNearestHex(hexClicked.q, hexClicked.r)


        let rotatedMap = this.hexMapData.rotatedMapList[this.camera.rotation]



        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]


        let tileClicked = null

        for (let i = 0; i < testList.length; i++) {
            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }


            if (!rotatedMap.get(testTile.q + ',' + testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, this.hexMapData.getEntryRotated(testTile.q, testTile.r, this.camera.rotation).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if (this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)) {
                tileClicked = testTile
                continue
            }

            let tileTerrain = this.hexMapData.getTerrain(testTile.q, testTile.r)
            let tileUnit = this.hexMapData.getUnit(testTile.q, testTile.r)

            if (tileTerrain && tileTerrain.type == 'structures') {
                
                let spriteObj = this.images[tileTerrain.type][tileTerrain.sprite]

                //make function to get these attributes
                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileTerrain.state][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }

            }

            if(tileUnit && tileUnit.state == 'idle'){
                let spriteObj = this.images[tileUnit.type][tileUnit.sprite]

                console.log(spriteObj)

                //make function to get these attributes
                let spritePos = {
                    x: hexPos.x,
                    y: hexPos.y
                }

                let spriteSize = {
                    width: this.hexMapData.size * 2 * spriteObj.spriteSize.width,
                    height: this.hexMapData.size * 2 * (spriteObj.spriteSize.height - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation])
                }

                spritePos.x -= this.hexMapData.size + spriteObj.spriteOffset.x * this.hexMapData.size * 2
                spritePos.y -= (this.hexMapData.size * this.hexMapData.squish) + (spriteObj.spriteOffset.y - spriteObj.deadSpace[tileUnit.frame][this.camera.rotation]) * this.hexMapData.size * 2

                if (this.collision.pointRect(ogPos.x, ogPos.y, spritePos.x, spritePos.y, spriteSize.width, spriteSize.height)) {
                    tileClicked = testTile
                    continue
                }
            }

        }

        console.log(tileClicked)

        if (!tileClicked) return

        let rotatedTile = rotatedMap.get(tileClicked.q + ',' + tileClicked.r)

        tileClicked = {
            q: rotatedTile.q,
            r: rotatedTile.r
        }

        console.log(tileClicked)


        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)

        let unit = this.hexMapData.getSelectedUnit()

        if (unit != null) {

            if (this.utils.getSelection(tile.position.q, tile.position.r) == 'unit') return

            this.utils.resetSelected()

            let moveSet = this.pathFinder.findMoveSet(unit.position, unit.movementRange)

            console.log()

            if (moveSet.some(moveObj => moveObj.tile.q == tile.position.q && moveObj.tile.r == tile.position.r)) {
                this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
                this.utils.lerpUnit(unit)
            } else {
                let newUnit = this.hexMapData.getUnit(tile.position.q, tile.position.r)
                if (newUnit == null) {
                    this.utils.setSelection(tile.position.q, tile.position.r, 'info')
                    console.log("ACT")
                }
                else {
                    this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
                    this.utils.findMoveSet()
                }
            }

            return
        }

        this.utils.resetSelected()

        if (this.hexMapData.getUnit(tileClicked.q, tileClicked.r) != null) {
            this.utils.setSelection(tile.position.q, tile.position.r, 'unit')
            this.utils.findMoveSet()
        }
        else this.utils.setSelection(tile.position.q, tile.position.r, 'info')
    }

    getCenterHexPos = () => {

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom
        
        let size = this.hexMapData.size;
        let squish = this.hexMapData.squish;

        let zoom = zoomLevel * zoomAmount

        let centerPos = {
            x: this.camera.position.x + zoom/2 + this.canvas.width / 2 - this.hexMapData.posMap.get(this.camera.rotation).x,
            y: this.camera.position.y + zoom/2 * (this.canvas.height/this.canvas.width) + this.canvas.height / 2 - this.hexMapData.posMap.get(this.camera.rotation).y
        }


        let centerHexPos;


        if (this.camera.rotation % 2 == 0) {
            centerHexPos = {
                q: (Math.sqrt(3) / 3 * centerPos.x - 1 / 3 * (centerPos.y * (1 / squish))) / size,
                r: ((centerPos.y * (1 / squish)) * (2 / 3)) / size
            }
        } else {
            centerHexPos = {
                q: ((2 / 3) * centerPos.x) / size,
                r: ((-1 / 3) * centerPos.x + Math.sqrt(3) / 3 * (centerPos.y * (1 / squish))) / size
            }
        }

        return centerHexPos;
    }

    rotateRight = () => {
        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.getCenterHexPos();

            this.camera.rotateCameraRight()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 1) {

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom/2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom/2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
                );

            }
        }
    }

    rotateLeft = () => {
        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.getCenterHexPos();

            this.camera.rotateCameraLeft()

            //Set camera position
            let squish = this.hexMapData.squish;

            if (this.camera.rotation % 2 == 0) {

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom/2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(this.camera.rotation).x - zoom/2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(this.camera.rotation).y - zoom/2 * (this.canvas.height/this.canvas.width)
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