import StructureDataClass from "../StructureData";

export default class FlagDataClass extends StructureDataClass{

    constructor(pos, config, hexMapData, imageObject){
        super(pos, config, hexMapData, imageObject)
        this.type = 'flag'
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default

    }

}