import StructureDataClass from "../StructureData";

export default class PropDataClass extends StructureDataClass{

    constructor(pos, config, hexMapData, imageObject){
        super(pos, config, hexMapData, imageObject)
        this.type = 'prop'
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default
    }

}