import StructureClass from "../Structure";
import PropConfig from "./PropConfig";

export default class PropClass extends StructureClass{

    constructor(pos, propId, hexMapData, images){
        if(!PropConfig[propId]) throw Error(`Invalid Prop ID: (${propId}). Prop config properties are: [${Object.getOwnPropertyNames(PropConfig).splice(3)}]`)
        super(pos, PropConfig[propId], hexMapData, images.prop)
        this.type = 'prop'
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default
    }

    setState = (stateName) => {
        this.state.current = this.state[stateName]
    }

    update = () => {

    }

}