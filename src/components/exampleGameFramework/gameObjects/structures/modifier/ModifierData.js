import StructureDataClass from "../StructureData"

export default class ModifierDataClass extends StructureDataClass{

    constructor(pos, config, hexMapData, modifierImages){
        super(pos, config, hexMapData, modifierImages)
        this.type = 'modifier'
        this.modifierType = config.modifierType
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default
    }

}