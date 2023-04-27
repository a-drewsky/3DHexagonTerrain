import UnitRendererClass from "./UnitRenderer"

export default class UnitManagerClass {

    constructor(hexMapData, tileData, unitData, camera, images, settings) {
        this.data = unitData
        this.renderer = new UnitRendererClass(this.data, hexMapData, tileData, camera, settings, images)
    }
    
    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()

            if (unit.state.current.duration != 'continuous' && unit.animationCurTime - unit.animationStartTime < unit.state.current.duration) return

            switch (unit.state.current.name) {
                case 'walk':
                case 'jump':
                    unit.updatePath()
                    return
                case 'mine':
                    unit.collectTargetResources()
                    unit.setIdle()
                    return
                case 'attack':
                    unit.attackTarget()
                    unit.setIdle()
                    return
                case 'hit':
                    unit.setIdle()
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