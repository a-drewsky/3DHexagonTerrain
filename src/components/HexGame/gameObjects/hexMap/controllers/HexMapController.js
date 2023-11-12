
import HexMapControllerUtilsClass from './HexMapControllerUtils'
import CollisionClass from '../../../utilities/collision'
import HexMapControllerClickClass from './HexMapControllerClick'
import HexMapControllerHoverClass from './HexMapControllerHover'
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

        this.clickController = new HexMapControllerClickClass(hexMapData)
        this.hoverController = new HexMapControllerHoverClass(hexMapData)

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
        this.unitData.createUnit(this.cardData.cards[this.cardData.selectedCard].unitId)
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