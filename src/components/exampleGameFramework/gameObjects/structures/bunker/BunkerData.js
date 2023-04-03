import StructureDataClass from "../StructureData";

export default class BunkerDataClass extends StructureDataClass{

    constructor(pos, config, hexMapData, imageObject){
        super(pos, config, hexMapData, imageObject)
        this.type = 'bunker'
        this.health = 100
        this.state = {
            health_lte_100: { name: 'health_lte_100', rate: 'static', duration: 'continuous', type: 'static' },
            health_lte_75: { name: 'health_lte_75', rate: 'static', duration: 'continuous', type: 'static' },
            health_lte_50: { name: 'health_lte_50', rate: 'static', duration: 'continuous', type: 'static' },
            health_lte_25: { name: 'health_lte_25', rate: 'static', duration: 'continuous', type: 'static' },
            destroyed: { name: 'destroyed', rate: null, duration: null, type: null },
        }
        this.state.current = this.state.health_lte_100
    }

}