import StructureClass from "../Structure"
import ResourceConfig from "./ResourceConfig"

const RESOURCE_STATE = {
    resources_lte_100: { name: 'resources_lte_100', rate: 'static', duration: 'continuous', type: 'static' },
    resources_lte_75: { name: 'resources_lte_75', rate: 'static', duration: 'continuous', type: 'static' },
    resources_lte_50: { name: 'resources_lte_50', rate: 'static', duration: 'continuous', type: 'static' },
    resources_lte_25: { name: 'resources_lte_25', rate: 'static', duration: 'continuous', type: 'static' },
    destroyed: { name: 'destroyed', rate: null, duration: null, type: null }
}

export default class ResourceClass extends StructureClass {

    constructor(pos, resourceId, images) {
        if (!ResourceConfig[resourceId]) throw Error(`Invalid Resource ID: (${resourceId}). Resource config properties are: [${Object.getOwnPropertyNames(ResourceConfig).splice(3)}]`)
        super(pos, 'resource', ResourceConfig[resourceId], RESOURCE_STATE, 'resources_lte_100', images)
        this.spriteType = 'resource'
        this.destructionStructure = 'emptymine'
        this.resource = ResourceConfig[resourceId].resource

        this.stats = {
            resources: ResourceConfig[resourceId].stats.resources,
            maxResources: ResourceConfig[resourceId].stats.resources
        }
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
    }

    updateState = () => {
        this.render = true
        let resourcePercent = this.stats.resources / this.stats.maxResources * 100
        let newStateName = resourcePercent > 75 ? 'resources_lte_100' : resourcePercent > 50 ? 'resources_lte_75' : resourcePercent > 25 ? 'resources_lte_50' : resourcePercent > 0 ? 'resources_lte_25' : 'destroyed'
        if (newStateName !== this.curState()) this.setState(newStateName)
    }

}