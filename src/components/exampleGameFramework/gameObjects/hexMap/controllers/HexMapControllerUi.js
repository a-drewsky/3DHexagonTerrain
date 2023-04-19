export default class HexMapControllerUiClass {

    constructor(hexMapData, tileManager, spriteManager, cameraController, camera, canvas, utils, uiController) {
        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.spriteManager = spriteManager
        this.camera = camera
        this.canvas = canvas
        this.utils = utils
        this.uiController = uiController
        this.cameraController = cameraController
    }

    move = () => {
        if (this.spriteManager.units.data.selectedUnit != null) this.spriteManager.units.data.selectedUnit.setMove()
        this.hexMapData.resetSelected()
        this.uiController.clearContextMenu()
    }

    mine = () => {

        if (this.spriteManager.units.data.selectedUnit == null) return

        let selectionTarget = this.hexMapData.getSelectionPosition('target')
        console.log(selectionTarget)
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.spriteManager.units.data.selectedUnit.target = targetStructure

        if (this.hexMapData.selections.path.length == 0) {
            this.spriteManager.units.data.selectedUnit.setMine()
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.spriteManager.units.data.selectedUnit.futureState = 'mine'
            this.spriteManager.units.data.selectedUnit.setMove()
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    attack = () => {

        if (this.spriteManager.units.data.selectedUnit == null) return

        let selectionTarget = this.hexMapData.getSelectionPosition('target')
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetObject

        if (this.spriteManager.units.data.getUnit(targetTile.position.q, targetTile.position.r) != null) {
            targetObject = this.spriteManager.units.data.getUnit(targetTile.position.q, targetTile.position.r)
        } else {
            if (this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r) == null) return
            targetObject = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        }
        if (targetObject == null) return

        this.spriteManager.units.data.selectedUnit.target = targetObject

        if (this.hexMapData.selections.path.length == 0) {
            this.spriteManager.units.data.selectedUnit.setAttack()
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.spriteManager.units.data.selectedUnit.futureState = 'attack'
            this.spriteManager.units.data.selectedUnit.setMove()
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    capture = () => {

        if (this.spriteManager.units.data.selectedUnit == null) return

        let selectionTarget = this.hexMapData.getSelectionPosition('target')
        if (selectionTarget == null) return
        let targetTile = this.tileManager.data.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.data.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.spriteManager.units.data.selectedUnit.target = targetStructure

        let neighbors = this.tileManager.data.getNeighborKeys(this.spriteManager.units.data.selectedUnit.position.q, this.spriteManager.units.data.selectedUnit.position.r)

        if (neighbors.filter(tile => tile.q == targetStructure.position.q && tile.r == targetStructure.position.r).length == 1) {
            this.spriteManager.units.data.selectedUnit.captureFlag(targetTile)
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.spriteManager.units.data.selectedUnit.futureState = 'capture'
            this.spriteManager.units.data.selectedUnit.setMove()
            this.hexMapData.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    setPlaceUnit = () => {
        if (this.hexMapData.state.current != 'selectTile') return

        this.hexMapData.resetSelected()
        this.hexMapData.resetHover()
        this.hexMapData.setState('placeUnit')
    }

    cancel = () => {
        this.hexMapData.resetSelected()

        this.hexMapData.setState('selectTile')

        this.uiController.clearContextMenu()
    }
    
    rotateRight = () => {

        if (this.hexMapData.state.current == 'selectAction') return

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount
        let newRotation = this.camera.rotation

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos(newRotation);

            newRotation++
            if (newRotation >= 12) newRotation = 0 + (newRotation - 12);

            //Set camera position
            let squish = this.hexMapData.squish;

            if (newRotation % 2 == 1) {

                let vecQ = this.hexMapData.flatTopVecQ;
                let vecR = this.hexMapData.flatTopVecR;

                this.camera.setCameraPos(
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

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraController.rotateRight()
        this.hexMapData.resetHover()
        this.hexMapData.renderBackground = true
    }

    rotateLeft = () => {

        if (this.hexMapData.state.current == 'selectAction') return

        let zoomAmount = this.camera.zoomAmount
        let zoomLevel = this.camera.zoom

        let zoom = zoomLevel * zoomAmount

        let newRotation = this.camera.rotation

        for (let i = 0; i < this.camera.rotationAmount; i++) {
            let centerHexPos = this.utils.getCenterHexPos(newRotation);

            newRotation--
            if (newRotation <= -1) newRotation = 11 + (newRotation + 1);

            //Set camera position
            let squish = this.hexMapData.squish;

            if (newRotation % 2 == 0) {

                let vecQ = this.hexMapData.VecQ;
                let vecR = this.hexMapData.VecR;

                this.camera.setCameraPos(
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

                this.camera.setCameraPos(
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.tileManager.data.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.tileManager.data.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraController.rotateLeft()
        this.hexMapData.resetHover()
        this.hexMapData.renderBackground = true
    }

}