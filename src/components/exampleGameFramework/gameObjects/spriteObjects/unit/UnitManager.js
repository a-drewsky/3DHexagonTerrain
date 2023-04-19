import UnitDataClass from "./UnitData"
import UnitRendererClass from "./UnitRenderer"

export default class UnitManagerClass {

    constructor(hexMapData, tileData, camera, images, settings, uiController, globalState) {
        this.data = new UnitDataClass(hexMapData, tileData, images, settings, uiController, globalState)
        this.renderer = new UnitRendererClass(this.data, hexMapData, tileData, camera, settings, images)
    }

    //call each units update functions
    //if unit state changes set render attribute to true
    //do the same with structures
    //After calling each units update function, check each unit if it needs to be rendered
    //do the same with structures

    //render unit images each frame of animation
    //Do not render unit from view
    //unit should only have 1 draw function similar to structures
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