export default class HexMapControllerUiClass {

    constructor(hexMapData, cameraController, camera, canvas, utils) {
        this.hexMapData = hexMapData
        this.camera = camera
        this.canvas = canvas
        this.utils = utils
        this.cameraController = cameraController
    }

    move = () => {
        if (this.hexMapData.selectedUnit != null) this.utils.lerpUnit(this.hexMapData.selectedUnit)
        this.utils.resetSelected()
        this.utils.clearContextMenu()
    }

    mine = () => {

        if (this.hexMapData.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetStructure = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.hexMapData.selectedUnit.target = targetStructure

        if (this.hexMapData.selections.path.length == 0) {
            this.utils.mineOre(this.hexMapData.selectedUnit, targetTile)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.hexMapData.selectedUnit, targetTile, 'mine')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    attack = () => {

        if (this.hexMapData.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetObject

        if (this.hexMapData.getUnit(targetTile.position.q, targetTile.position.r) != null) {
            targetObject = this.hexMapData.getUnit(targetTile.position.q, targetTile.position.r)
        } else {
            if (this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r) == null) return
            targetObject = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        }
        if (targetObject == null) return

        this.hexMapData.selectedUnit.target = targetObject

        if (this.hexMapData.selections.path.length == 0) {
            this.utils.attackUnit(this.hexMapData.selectedUnit)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.hexMapData.selectedUnit, targetTile, 'attack')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    capture = () => {

        if (this.hexMapData.selectedUnit == null) return

        let targetTile = this.hexMapData.getSelectedTargetTile()
        if (targetTile == null) return

        let targetStructure = this.hexMapData.getTerrain(targetTile.position.q, targetTile.position.r)
        if (targetStructure == null) return

        this.hexMapData.selectedUnit.target = targetStructure

        let neighbors = this.hexMapData.getNeighborKeys(this.hexMapData.selectedUnit.position.q, this.hexMapData.selectedUnit.position.r)

        if (neighbors.filter(tile => tile.q == targetStructure.position.q && tile.r == targetStructure.position.r).length == 1) {
            this.utils.captureFlag(this.hexMapData.selectedUnit, targetTile)
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        } else {
            this.utils.lerpToTarget(this.hexMapData.selectedUnit, targetTile, 'capture')
            this.utils.resetSelected()
            this.utils.clearContextMenu()
        }
    }

    setPlaceUnit = () => {
        if (this.hexMapData.state.current != 'selectTile') return

        this.utils.resetSelected()
        this.utils.resetHover()
        this.hexMapData.state.current = this.hexMapData.state.placeUnit
    }

    cancel = () => {
        this.utils.resetSelected()

        this.hexMapData.state.current = this.hexMapData.state.selectTile

        this.utils.clearContextMenu()
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
    }

}