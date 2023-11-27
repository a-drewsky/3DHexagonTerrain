import StructureClass from "./Structure"
import FlagConfig from "../../config/FlagConfig"

const FLAG_STATE = {
    default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' },
    captured: { name: 'captured', rate: 'static', duration: 'continuous', type: 'static' }
}

export default class FlagClass extends StructureClass{

    constructor(pos, flagId, images){
        if(!FlagConfig[flagId]) throw Error(`Invalid Flag ID: (${flagId}). Flag config properties are: [${Object.getOwnPropertyNames(FlagConfig).splice(3)}]`)
        super(pos, 'flag', FlagConfig[flagId], FLAG_STATE, 'default', images.structures.flag[FlagConfig[flagId].sprite], images.shadows[FlagConfig[flagId].shadow])
        this.spriteType = 'flag'
    }

    setCaptured = () => {
        this.state.current = this.state.captured
    }

    isCaptured = () => {
        return this.state.current.name === 'captured'
    }

}