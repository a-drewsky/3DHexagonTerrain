import UnitRendererClass from "./UnitRenderer"

export default class UnitManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.projectileData = hexMapData.projectileData
        this.data = hexMapData.unitData
        this.renderer = new UnitRendererClass(hexMapData, images)
    }

    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()
            if (unit.state.current.type == 'action') unit.render = true

            if (unit.state.current.duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.state.current.duration) return

            switch (unit.state.current.name) {
                case 'walk':
                case 'jump':
                    unit.updatePath()
                    return
                case 'mine':
                    this.data.unselectUnit()
                    unit.collectTargetResources()
                    unit.setIdle()
                    this.mapData.resetState()
                    this.selectionData.clearAllSelections()
                    return
                case 'attack':
                    this.data.unselectUnit()
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
                    return
                case 'hit':
                    unit.setIdle()
                    if (unit.state.current.name != 'death') {
                        this.mapData.resetState()
                        this.selectionData.clearAllSelections()
                    }
                    return
                case 'death':
                    this.data.deleteUnit(unit.position.q, unit.position.r)
                    this.mapData.resetState()
                    this.selectionData.clearAllSelections()
                    return
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