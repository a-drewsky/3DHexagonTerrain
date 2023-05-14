import StructureClass from "../Structure";
import FlagConfig from "./FlagConfig";

export default class FlagClass extends StructureClass{

    constructor(pos, structureId, hexMapData, images){
        super(pos, FlagConfig[structureId], hexMapData, images.flag)
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