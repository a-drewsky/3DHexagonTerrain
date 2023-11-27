export default class UiInterfaceClass {

    constructor(uiComponents, bgCanvas) {

        this.uiComponents = uiComponents
        this.bgCanvas = bgCanvas

    }

    setBgCanvasZoom = (width, height) => {
        this.uiComponents.bgCanvas.width = width
        this.uiComponents.bgCanvas.height = height
    }

    setBgCanvasSize = (width, height) => {
        this.bgCanvas.width = width
        this.bgCanvas.height = height
    }

    setBgCanvasImage = (canvas) => {
        let bgctx = this.bgCanvas.getContext('2d')
        bgctx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height)
        bgctx.drawImage(canvas, 0, 0, this.bgCanvas.width, this.bgCanvas.height)
    }

    setBgCanvasPosition = (x, y) => {
        this.uiComponents.bgCanvas.x = x
        this.uiComponents.bgCanvas.y = y
    }

    setPauseMenu = (state) => {
        this.uiComponents.pauseMenu.show = state
    }

    setEndGameMenu = (state) => {
        this.uiComponents.endGameMenu.show = state
    }

    setResourceBar = (resources) => {
        this.uiComponents.resources = resources
    }

    setCards = (cards) => {
        this.uiComponents.cards = cards
    }

    selectCard = (selection) => {
        this.uiComponents.selectedCard = selection
    }

    selectSprite = (unit) => {
        this.uiComponents.selectedSprite = unit
    }

}