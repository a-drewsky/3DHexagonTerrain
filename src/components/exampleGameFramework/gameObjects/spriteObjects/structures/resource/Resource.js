import StructureClass from "../Structure";
import ResourceConfig from "./ResourceConfig";

export default class ResourceClass extends StructureClass {

    constructor(pos, structureName, hexMapData, images) {
        super(pos, ResourceConfig[structureName], hexMapData, images.resource)
        this.type = 'resource'
        this.destructionStructure = 'emptymine'
        this.resources = 100
        this.state = {
            resources_lte_100: { name: 'resources_lte_100', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_75: { name: 'resources_lte_75', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_50: { name: 'resources_lte_50', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_25: { name: 'resources_lte_25', rate: 'static', duration: 'continuous', type: 'static' },
            destroyed: { name: 'destroyed', rate: null, duration: null, type: null },
        }
        this.state.current = this.state.resources_lte_100
    }

    curState = () => {
        return this.state.current
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
        this.render = true
    }

    update = () => {

        let newStateName = this.resources > 75 ? 'resources_lte_100' : this.resources > 50 ? 'resources_lte_75' : this.resources > 25 ? 'resources_lte_50' : this.resources > 0 ? 'resources_lte_25' : 'destroyed'

        if (newStateName == this.curState().name) return

        this.setState(newStateName)
    }

}