import StructureDataClass from "../StructureData";

export default class ResourceDataClass extends StructureDataClass{

    constructor(pos, config, hexMapData, imageObject){
        super(pos, config, hexMapData, imageObject)
        this.type = 'resource'
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

}