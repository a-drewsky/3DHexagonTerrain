import CollisionClass from "../commonUtils/CollisionUtils"

export default class UiManagerClass {

    constructor(gameData, canvas, uiInterface) {
        this.mapData = gameData.mapData
        this.cardData = gameData.cardData
        this.unitData = gameData.unitData
        this.cameraData = gameData.cameraData
        
        this.canvas = canvas
        this.hexmapCanvas = null

        this.uiInterface = uiInterface

        this.collision = new CollisionClass()

    }

    prerender = (hexmapCanvas) => {
        this.hexmapCanvas = hexmapCanvas
    }

    update = () => {
        this.uiInterface.setResourceBar(this.mapData.resources)
        this.uiInterface.setCards(this.cardData.cards)
        this.uiInterface.selectCard(this.cardData.selectedCard)
        this.uiInterface.selectSprite(this.unitData.placementUnit || this.unitData.selectedUnit)
        this.uiInterface.setEndGameMenu(this.mapData.curState() === 'end')

        //set background
        let scale = this.canvas.width / (this.canvas.width + (this.cameraData.zoom * this.cameraData.zoomAmount))
        this.uiInterface.setBgCanvasPosition(this.cameraData.position.x * -1 * scale, this.cameraData.position.y * -1 * scale)
        this.uiInterface.setBgCanvasZoom(this.hexmapCanvas.width * scale, this.hexmapCanvas.height * scale)

    }

}