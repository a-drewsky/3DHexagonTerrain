import StructureClass from "./Structure"
import BunkerConfig from "../../config/BunkerConfig"

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
        super(pos, 'bunker', BunkerConfig[bunkerId], BUNKER_STATE, 'health_lte_100', images.structures.bunker[BunkerConfig[bunkerId].sprite], images.shadows[BunkerConfig[bunkerId].shadow])
        this.spriteType = 'bunker'
        this.destructionStructure = 'rubblepile'

        this.stats = { ...BunkerConfig[bunkerId].stats }

        this.health = this.stats['max_health']
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
    }

    updateState = () => {
        this.render = true
        let newStateName = this.health > 75 ? 'health_lte_100' : this.health > 50 ? 'health_lte_75' : this.health > 25 ? 'health_lte_50' : this.health > 0 ? 'health_lte_25' : 'destroyed'
        if (newStateName !== this.curState()) this.setState(newStateName)
    }

}