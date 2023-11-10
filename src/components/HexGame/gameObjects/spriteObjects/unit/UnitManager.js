import UnitRendererClass from "./UnitRenderer"
import HexMapControllerUtilsClass from "../../hexMap/controllers/HexMapControllerUtils"

export default class UnitManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.projectileData = hexMapData.projectileData
        this.data = hexMapData.unitData
        this.renderer = new UnitRendererClass(hexMapData, images)
        this.controllerUtils = new HexMapControllerUtilsClass(hexMapData)
    }

    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()

            if (unit.state.current.duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.state.current.duration) continue

            switch (unit.curState()) {
                case 'walk':
                case 'jump':
                    unit.updatePath()
                    if (unit.curState() == 'idle') {
                        this.selectionData.setInfoSelection('unit', unit.position)
                        this.mapData.setState('chooseRotation')
                        this.controllerUtils.findActionSet()
                        this.controllerUtils.findAttackSet()
                    }
                    continue
                case 'mine':
                    this.data.unselectUnit()
                    unit.collectTargetResources()
                    unit.setIdle()
                    this.mapData.resetState()
                    this.selectionData.clearAllSelections()
                    continue
                case 'attack':
                    this.data.unselectUnit()
                    //here we will either create a projectile or an attack object
                    //attack object will have access to units
                    //projectiles will create an attack object apon termination

                    switch (unit.id) {
                        case 'mountain_ranger':
                            this.projectileData.newProjectile('arrow_projectile', unit.position, unit.target.position)
                            break
                        default:
                            unit.attackTarget()
                            if (unit.target.type != 'unit') {
                                this.mapData.resetState()
                                this.selectionData.clearAllSelections()
                            }
                    }
                    unit.setIdle()
                    continue
                case 'hit':
                    unit.setIdle()
                    if (unit.curState() != 'death') {
                        this.mapData.resetState()
                        this.selectionData.clearAllSelections()
                    }
                    continue
                case 'death':
                    this.data.deleteUnit(unit.position)
                    this.mapData.resetState()
                    this.selectionData.clearAllSelections()
                    continue
            }
        }
    }

    render = () => {
        for (let unit of this.data.unitList) {
            if (unit.render) this.renderer.render(unit)
            unit.render = false
        }
        if (this.data.placementUnit) {
            if (this.data.placementUnit.render) this.renderer.render(this.data.placementUnit)
            this.data.placementUnit.render = false
        }
    }

}