import StructureClass from "../Structure";
import FlagConfig from "./FlagConfig";

export default class FlagClass extends StructureClass{

    constructor(pos, flagId, images){
        if(!FlagConfig[flagId]) throw Error(`Invalid Flag ID: (${flagId}). Flag config properties are: [${Object.getOwnPropertyNames(FlagConfig).splice(3)}]`)
        super(pos, 'flag', FlagConfig[flagId], images)
        this.type = 'flag'
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default

        this.captured = false
    }

    setCaptured = () => {
        this.captured = true
    }

}