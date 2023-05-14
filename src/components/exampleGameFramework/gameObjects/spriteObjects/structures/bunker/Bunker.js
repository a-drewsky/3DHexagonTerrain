import StructureClass from "../Structure";
import BunkerConfig from "./BunkerConfig";

export default class BunkerClass extends StructureClass{

    constructor(pos, structureId, hexMapData, images){
        super(pos, BunkerConfig[structureId], hexMapData, images.bunker)
        this.type = 'bunker'
        this.destructionStructure = 'rubblepile'
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

    curState = () => {
        return this.state.current
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
        this.render = true
    }

    update = () => {

        let newStateName = this.health > 75 ? 'health_lte_100' : this.health > 50 ? 'health_lte_75' : this.health > 25 ? 'health_lte_50' : this.health > 0 ? 'health_lte_25' : 'destroyed'

        if (newStateName == this.curState().name) return
        
        this.setState(newStateName)
    }

    recieveAttack = (damage) => {
        this.health -= damage
        this.hexMapData.resetState()
    }

}