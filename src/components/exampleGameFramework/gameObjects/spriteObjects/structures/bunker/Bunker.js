import StructureClass from "../Structure";
import BunkerConfig from "./BunkerConfig";

export default class BunkerClass extends StructureClass{

    constructor(pos, structureName, hexMapData, images){
        super(pos, BunkerConfig[structureName], hexMapData, images.bunker)
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