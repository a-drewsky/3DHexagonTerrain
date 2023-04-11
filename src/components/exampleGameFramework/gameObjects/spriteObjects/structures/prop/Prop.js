import StructureClass from "../Structure";
import PropConfig from "./PropConfig";

export default class PropClass extends StructureClass{

    constructor(pos, structureName, hexMapData, images){
        super(pos, PropConfig[structureName], hexMapData, images.prop)
        this.type = 'prop'
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default
    }

}