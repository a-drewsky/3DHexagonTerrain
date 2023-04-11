import StructureClass from "../Structure"
import ModifierConfig from "./ModifierConfig"

export default class ModifierClass extends StructureClass{

    constructor(pos, structureName, hexMapData, images){
        super(pos, ModifierConfig[structureName], hexMapData, images.modifier)
        this.type = 'modifier'
        this.modifierType = ModifierConfig[structureName].modifierType
        this.state = {
            default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
        }
        this.state.current = this.state.default
    }

}