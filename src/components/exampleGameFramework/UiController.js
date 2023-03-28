export default class UiControllerClass {

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

    //create ui controller class
    clearContextMenu = () => {
        this.uiComponents.contextMenu.show = false
        this.uiComponents.contextMenu.x = null
        this.uiComponents.contextMenu.y = null
        this.uiComponents.contextMenu.buttonList = []
    }

    setContextMenu = (x, y, buttonList) => {
        this.uiComponents.contextMenu.show = true
        this.uiComponents.contextMenu.x = x
        this.uiComponents.contextMenu.y = y
        this.uiComponents.contextMenu.buttonList = buttonList
    }

    setResourceBar = (resourceNum) => {
        this.uiComponents.resourceBar.resourceNum = resourceNum
    }

}