import StructureClass from "../Structure";
import ResourceConfig from "./ResourceConfig";

export default class ResourceClass extends StructureClass {

    constructor(pos, resourceId, images) {
        if (!ResourceConfig[resourceId]) throw Error(`Invalid Resource ID: (${resourceId}). Resource config properties are: [${Object.getOwnPropertyNames(ResourceConfig).splice(3)}]`)
        super(pos, 'resource', ResourceConfig[resourceId], images)
        this.type = 'resource'
        this.destructionStructure = 'emptymine'
        this.resource = ResourceConfig[resourceId].resource

        this.stats = {
            resources: ResourceConfig[resourceId].stats.resources,
            maxResources: ResourceConfig[resourceId].stats.resources
        }
        this.state = {
            resources_lte_100: { name: 'resources_lte_100', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_75: { name: 'resources_lte_75', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_50: { name: 'resources_lte_50', rate: 'static', duration: 'continuous', type: 'static' },
            resources_lte_25: { name: 'resources_lte_25', rate: 'static', duration: 'continuous', type: 'static' },
            destroyed: { name: 'destroyed', rate: null, duration: null, type: null },
        }
        this.state.current = this.state.resources_lte_100
    }

    setState = () => {
        let resourcePercent = this.stats.resources / this.stats.maxResources * 100
        let newStateName = resourcePercent > 75 ? 'resources_lte_100'
            : resourcePercent > 50 ? 'resources_lte_75'
                : resourcePercent > 25 ? 'resources_lte_50'
                    : resourcePercent > 0 ? 'resources_lte_25'
                        : 'destroyed'
        if (newStateName == this.curState()) return
        this.state.current = this.state[newStateName]
        this.render = true
    }

    mineResources = (miningLevel) => {

        let minedResources = Math.min(this.stats.resources, miningLevel)
        this.stats.resources -= minedResources

        this.setState()
        this.render = true

        return minedResources
    }

}