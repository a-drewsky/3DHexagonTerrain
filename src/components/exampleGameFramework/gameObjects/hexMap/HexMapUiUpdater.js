import CollisionClass from "../../utilities/collision"

export default class HexMapUiUpdaterClass {

    constructor(hexMapData, unitData, cameraData, canvas, uiController) {

        this.hexMapData = hexMapData
        this.unitData = unitData
        this.cameraData = cameraData
        this.canvas = canvas
        this.drawCanvas = null

        this.uiController = uiController

        this.collision = new CollisionClass()

    }

    prerender = (drawCanvas) => {
        this.drawCanvas = drawCanvas
    }

    update = () => {
        this.uiController.setResourceBar(this.hexMapData.resources)
        this.uiController.setCards(this.hexMapData.cardData.cards)
        this.uiController.selectCard(this.hexMapData.cardData.selectedCard)
        this.uiController.selectSprite(this.unitData.placementUnit || this.unitData.selectedUnit)

        let zoom = this.cameraData.zoom * this.cameraData.zoomAmount

        //set background
        let scale = this.canvas.width / (this.canvas.width + zoom)
        this.uiController.setBgCanvasPosition(this.cameraData.position.x * -1 * scale, this.cameraData.position.y * -1 * scale)
        this.uiController.setBgCanvasZoom(this.drawCanvas.width * scale, this.drawCanvas.height * scale)

    }

}