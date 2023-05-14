import StructureClass from "../Structure";
import PropConfig from "./PropConfig";

export default class PropClass extends StructureClass{

    constructor(pos, structureId, hexMapData, images){
        super(pos, PropConfig[structureId], hexMapData, images.prop)
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