export default class HexMapControllerUiClass {

    constructor(hexMapData, spriteManager, cameraController, camera, canvas, utils, uiController) {
        this.hexMapData = hexMapData
        this.spriteManager = spriteManager
        this.camera = camera
        this.canvas = canvas
        this.utils = utils
        this.uiController = uiController
        this.cameraController = cameraController
    }

    move = () => {
        console.log(this.spriteManager.units.selectedUnit)
        if (this.spriteManager.units.selectedUnit != null) this.utils.lerpUnit(this.spriteManager.units.selectedUnit)
        this.hexMapData.selections.resetSelected()
        this.uiController.clearContextMenu()
    }

    mine = () => {

        if (this.spriteManager.units.selectedUnit == null) return

        let selectionTarget = this.hexMapData.selections.getPosition('target')
        console.log(selectionTarget)
        if (selectionTarget == null) return
        let targetTile = this.hexMapData.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.spriteManager.units.selectedUnit.data.target = targetStructure

        if (this.hexMapData.selections.path.length == 0) {
            this.utils.mineOre(this.spriteManager.units.selectedUnit, targetTile)
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.spriteManager.units.selectedUnit, targetTile, 'mine')
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    attack = () => {

        if (this.spriteManager.units.selectedUnit == null) return

        let selectionTarget = this.hexMapData.selections.getPosition('target')
        if (selectionTarget == null) return
        let targetTile = this.hexMapData.getEntry(selectionTarget.q, selectionTarget.r)

        let targetObject

        if (this.spriteManager.units.getUnit(targetTile.position.q, targetTile.position.r) != null) {
            targetObject = this.spriteManager.units.getUnit(targetTile.position.q, targetTile.position.r)
        } else {
            if (this.spriteManager.structures.getStructure(targetTile.position.q, targetTile.position.r) == null) return
            targetObject = this.spriteManager.structures.getStructure(targetTile.position.q, targetTile.position.r)
        }
        if (targetObject == null) return

        this.spriteManager.units.selectedUnit.data.target = targetObject

        if (this.hexMapData.selections.path.length == 0) {
            this.utils.attackUnit(this.spriteManager.units.selectedUnit)
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.spriteManager.units.selectedUnit, targetTile, 'attack')
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    capture = () => {

        if (this.spriteManager.units.selectedUnit == null) return

        let selectionTarget = this.hexMapData.selections.getPosition('target')
        if (selectionTarget == null) return
        let targetTile = this.hexMapData.getEntry(selectionTarget.q, selectionTarget.r)

        let targetStructure = this.spriteManager.structures.getStructure(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.spriteManager.units.selectedUnit.data.target = targetStructure

        let neighbors = this.hexMapData.getNeighborKeys(this.spriteManager.units.selectedUnit.data.position.q, this.spriteManager.units.selectedUnit.data.position.r)

        if (neighbors.filter(tile => tile.q == targetStructure.data.position.q && tile.r == targetStructure.data.position.r).length == 1) {
            this.utils.captureFlag(this.spriteManager.units.selectedUnit, targetTile)
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.spriteManager.units.selectedUnit, targetTile, 'capture')
            this.hexMapData.selections.resetSelected()
            this.uiController.clearContextMenu()
        }
    }

    setPlaceUnit = () => {
        if (this.hexMapData.state.current != 'selectTile') return

        this.hexMapData.selections.resetSelected()
        this.hexMapData.selections.resetHover()
        this.hexMapData.state.current = this.hexMapData.state.placeUnit
    }

    cancel = () => {
        this.hexMapData.selections.resetSelected()

        this.hexMapData.state.current = this.hexMapData.state.selectTile

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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraController.rotateRight()
        this.hexMapData.selections.resetHover()
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
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
                    vecQ.x * centerHexPos.q + vecR.x * centerHexPos.r - this.canvas.width / 2 + this.hexMapData.posMap.get(newRotation).x - zoom / 2,
                    vecQ.y * centerHexPos.q * squish + vecR.y * centerHexPos.r * squish - this.canvas.height / 2 + this.hexMapData.posMap.get(newRotation).y - zoom / 2 * (this.canvas.height / this.canvas.width)
                );

            }
        }

        this.cameraController.rotateLeft()
        this.hexMapData.selections.resetHover()
        this.hexMapData.renderBackground = true
    }

}