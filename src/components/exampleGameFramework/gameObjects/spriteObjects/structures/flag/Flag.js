import StructureClass from "../Structure";
import FlagConfig from "./FlagConfig";

export default class FlagClass extends StructureClass{

    constructor(pos, structureName, hexMapData, images){
        super(pos, FlagConfig[structureName], hexMapData, images.flag)
        this.type = 'flag'
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