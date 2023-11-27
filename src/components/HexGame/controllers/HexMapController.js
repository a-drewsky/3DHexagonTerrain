
import HexMapControllerUtilsClass from './utils/HexMapControllerUtils'
import CollisionClass from '../commonUtils/CollisionUtils'
import HexMapControllerClickClass from './HexMapControllerClick'
import HexMapControllerHoverClass from './HexMapControllerHover'
import HexMapPathFinderClass from './utils/HexMapPathFinder'
export default class HexMapControllerClass {

    constructor(hexMapData, canvas) {
        this.mapData = hexMapData.mapData
        this.cameraData = hexMapData.cameraData
        this.tileData = hexMapData.tileData
        this.selectionData = hexMapData.selectionData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData

        this.canvas = canvas

        this.collision = new CollisionClass()

        this.utils = new HexMapControllerUtilsClass(hexMapData)
        this.pathfinder = new HexMapPathFinderClass(hexMapData)

        this.hoverController = new HexMapControllerHoverClass(hexMapData)
        this.clickController = new HexMapControllerClickClass(hexMapData, this.hoverController)

    }

    mouseDown = (x, y) => {
        this.cameraData.setClickPos(x, y)
    }

    mouseUp = (x, y) => {

        this.cameraData.clearAnchorPoint()

        if (this.cameraData.clickPos !== null) {

            this.cameraData.clickPos = null
            this.cameraData.clickMovePos = null

            let tileClicked = this.utils.getSelectedTile(x, y)

            if (!tileClicked) return

            this.clickController.click(tileClicked, {x: x, y: y})

        }
    }

    mouseMove = (x, y) => {

        if (x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height) {
            this.mouseUp()
            return
        }

        if (this.cameraData.clickPos !== null) this.cameraData.setClickMovePos(x, y)
        
        if (this.cameraData.anchorPoint != null) {
            this.cameraData.setPosition(
                this.cameraData.anchorPoint.x - x + this.cameraData.mouseAnchorPoint.x,
                this.cameraData.anchorPoint.y - y + this.cameraData.mouseAnchorPoint.y
            )
        }

        this.hoverController.hover(x, y)
    }

    zoom = (deltaY) => {
        this.cameraData.clearAnchorPoint()
        this.cameraData.zoomIn(deltaY)
        this.selectionData.clearHover()
    }

    selectCard = (cardNum) => {
        if (this.mapData.curState() !== 'selectTile') return

        let curSelectedNum = this.cardData.selectedCard
        this.cardData.resetSelectedCard()
        if (curSelectedNum === cardNum) return
        
        if (this.cardData.getCard(cardNum).flipped) {
            this.cardData.flipCard()
            this.cardData.addCard()
        } else {
            this.cardData.setSelectedCard(cardNum)
        }
    }

    useCard = () => {
        if (this.mapData.curState() !== 'selectTile') return
        if (!this.cardData.canUseCard(this.mapData.resources)) return

        this.utils.setStartPlacement()

        this.cardData.useCard(this.mapData.resources)
        this.cardData.addCard()
    }

    scrapCard = () => {
        this.cardData.scrapCard(this.mapData.resources)
        this.cardData.addCard()
    }

    rotateRight = () => {

        let zoomAmount = this.cameraData.zoomAmount
        let zoomLevel = this.cameraData.zoom
        let zoom = zoomLevel * zoomAmount

        let newRotation = this.cameraData.rotation
        let centerHexPos = this.utils.getCenterHexPos(newRotation)

        newRotation++
        if (newRotation >= 6) newRotation = newRotation - 6

        centerHexPos.s = -centerHexPos.q - centerHexPos.r
        let newR = centerHexPos.r
        let newS = centerHexPos.s
        centerHexPos.q = -newR
        centerHexPos.r = -newS

        let newPosX = this.mapData.vecQ.x * centerHexPos.q + this.mapData.vecR.x * centerHexPos.r
        let newPosY = this.mapData.vecQ.y * centerHexPos.q * this.mapData.squish + this.mapData.vecR.y * centerHexPos.r * this.mapData.squish

        this.cameraData.setPosition(
            newPosX - this.canvas.width / 2 + this.tileData.posMap.get(newRotation).x - zoom / 2,
            newPosY - this.canvas.height / 2 + this.tileData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
        )

        this.cameraData.rotateRight()
        this.selectionData.clearHover()
        this.mapData.renderBackground = true
    }

    rotateLeft = () => {

        let zoomAmount = this.cameraData.zoomAmount
        let zoomLevel = this.cameraData.zoom
        let zoom = zoomLevel * zoomAmount

        let newRotation = this.cameraData.rotation
        let centerHexPos = this.utils.getCenterHexPos(newRotation)

        newRotation--
        if (newRotation < 0) newRotation = 6 + newRotation

        centerHexPos.s = -centerHexPos.r - centerHexPos.q
        let newQ = centerHexPos.q
        let newS = centerHexPos.s
        centerHexPos.r = -newQ
        centerHexPos.q = -newS

        let newPosX = this.mapData.vecQ.x * centerHexPos.q + this.mapData.vecR.x * centerHexPos.r
        let newPosY = this.mapData.vecQ.y * centerHexPos.q * this.mapData.squish + this.mapData.vecR.y * centerHexPos.r * this.mapData.squish

        this.cameraData.setPosition(
            newPosX - this.canvas.width / 2 + this.tileData.posMap.get(newRotation).x - zoom / 2,
            newPosY - this.canvas.height / 2 + this.tileData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
        )

        this.cameraData.rotateLeft()
        this.selectionData.clearHover()
        this.mapData.renderBackground = true
    }

}