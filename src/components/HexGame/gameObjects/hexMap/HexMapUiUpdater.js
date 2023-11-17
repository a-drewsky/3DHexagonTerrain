import CollisionClass from "../../utilities/collision"

export default class HexMapUiUpdaterClass {

    constructor(hexMapData, canvas, uiController) {
        this.mapData = hexMapData.mapData
        this.cardData = hexMapData.cardData
        this.unitData = hexMapData.unitData
        this.cameraData = hexMapData.cameraData
        
        this.canvas = canvas
        this.hexmapCanvas = null

        this.uiController = uiController

        this.collision = new CollisionClass()

    }

    prerender = (hexmapCanvas) => {
        this.hexmapCanvas = hexmapCanvas
    }

    update = () => {
        this.uiController.setResourceBar(this.mapData.resources)
        this.uiController.setCards(this.cardData.cards)
        this.uiController.selectCard(this.cardData.selectedCard)
        this.uiController.selectSprite(this.unitData.placementUnit || this.unitData.selectedUnit)
        this.uiController.setEndGameMenu(this.mapData.curState() === 'end')

        //set background
        let scale = this.canvas.width / (this.canvas.width + (this.cameraData.zoom * this.cameraData.zoomAmount))
        this.uiController.setBgCanvasPosition(this.cameraData.position.x * -1 * scale, this.cameraData.position.y * -1 * scale)
        this.uiController.setBgCanvasZoom(this.hexmapCanvas.width * scale, this.hexmapCanvas.height * scale)

    }

}