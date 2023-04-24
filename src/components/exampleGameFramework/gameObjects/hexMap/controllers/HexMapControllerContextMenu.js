export default class HexMapControllerContextMenuClass {

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

    select = (input) => {
        switch (input) {
            case 'move':
                this.move()
                return
            case 'mine':
                this.mine()
                return
            case 'attack':
                this.attack()
                return
            case 'capture':
                this.capture()
                return
            case 'cancel':
                this.cancel()
                return
        }
    }

    move = () => {
        if (this.spriteManager.units.data.selectedUnit != null) this.spriteManager.units.data.selectedUnit.setMove()
        this.hexMapData.resetSelected()
        this.uiController.clearContextMenu()
    }

    mine = () => {

        if (this.spriteManager.units.data.selectedUnit == null) return

        let selectionTarget = this.hexMapData.getSelectionPosition('target')
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

    cancel = () => {
        this.hexMapData.resetSelected()

        this.hexMapData.setState('selectTile')

        this.uiController.clearContextMenu()
    }

}