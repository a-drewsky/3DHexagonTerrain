import StructureClass from "../Structure"
import BunkerConfig from "./BunkerConfig"

const BUNKER_STATE = {
    health_lte_100: { name: 'health_lte_100', rate: 'static', duration: 'continuous', type: 'static' },
    health_lte_75: { name: 'health_lte_75', rate: 'static', duration: 'continuous', type: 'static' },
    health_lte_50: { name: 'health_lte_50', rate: 'static', duration: 'continuous', type: 'static' },
    health_lte_25: { name: 'health_lte_25', rate: 'static', duration: 'continuous', type: 'static' },
    destroyed: { name: 'destroyed', rate: null, duration: null, type: null },
}

export default class BunkerClass extends StructureClass{

    constructor(pos, bunkerId, images){
        if(!BunkerConfig[bunkerId]) throw Error(`Invalid Bunker ID: (${bunkerId}). Bunker config properties are: [${Object.getOwnPropertyNames(BunkerConfig).splice(3)}]`)
        super(pos, 'bunker', BunkerConfig[bunkerId], BUNKER_STATE, 'health_lte_100', images)
        this.spriteType = 'bunker'
        this.destructionStructure = 'rubblepile'

        this.stats = {
            health: BunkerConfig[bunkerId].stats.health
        }
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
    }

    updateState = () => {
        this.render = true
        let newStateName = this.stats.health > 75 ? 'health_lte_100' : this.stats.health > 50 ? 'health_lte_75' : this.stats.health > 25 ? 'health_lte_50' : this.stats.health > 0 ? 'health_lte_25' : 'destroyed'
        if (newStateName !== this.curState()) this.setState(newStateName)
    }

}