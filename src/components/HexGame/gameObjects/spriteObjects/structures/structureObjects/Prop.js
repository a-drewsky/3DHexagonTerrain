import StructureClass from "./Structure"
import PropConfig from "../../../../config/PropConfig"

const PROP_STATE = {
    default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
}

export default class PropClass extends StructureClass{

    constructor(pos, propId, images){
        if(!PropConfig[propId]) throw Error(`Invalid Prop ID: (${propId}). Prop config properties are: [${Object.getOwnPropertyNames(PropConfig).splice(3)}]`)
        super(pos, 'prop', PropConfig[propId], PROP_STATE, 'default', images.structures.prop[PropConfig[propId].sprite], images.shadows[PropConfig[propId].shadow])
        this.spriteType = 'prop'
    }

}