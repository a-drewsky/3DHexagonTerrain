import UnitRendererClass from "./UnitRenderer"

export default class UnitManagerClass {

    constructor(hexMapData, tileData, unitData, cameraData, images) {
        this.hexMapData = hexMapData
        this.data = unitData
        this.renderer = new UnitRendererClass(this.data, hexMapData, tileData, cameraData, images)
    }
    
    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()
            if(unit.state.current.type == 'action' || unit.state.current.type == 'moving') unit.render = true

            if (unit.state.current.duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.state.current.duration) return

            switch (unit.state.current.name) {
                case 'walk':
                case 'jump':
                    unit.updatePath()
                    return
                case 'mine':
                    unit.collectTargetResources()
                    unit.setIdle()
                    this.hexMapData.resetState()
                    return
                case 'attack':
                    unit.attackTarget()
                    unit.setIdle()
                    return
                case 'hit':
                    unit.setIdle()
                    if(unit.state.current.name != 'death') this.hexMapData.resetState()
                    return
                case 'death':
                    this.data.deleteUnit(unit.position.q, unit.position.r)
                    this.hexMapData.resetState()
                    return
            }
        }
    }

    render = () => {
        for (let unit of this.data.unitList) {
            if (unit.render) this.renderer.render(unit)
            unit.render = false
        }
    }

}