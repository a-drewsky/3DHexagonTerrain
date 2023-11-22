import ModifierConfig from "../../../../../config/ModifierConfig"

import StructureClass from "../Structure"

const MODIFIER_STATE = {
    default: { name: 'default', rate: 'static', duration: 'continuous', type: 'static' }
}

export default class ModifierClass extends StructureClass {

    constructor(pos, modifierId, images) {
        if (!ModifierConfig[modifierId]) throw Error(`Invalid Modifier ID: (${modifierId}). Modifier config properties are: [${Object.getOwnPropertyNames(ModifierConfig).splice(3)}]`)
        super(pos, 'modifier', ModifierConfig[modifierId], MODIFIER_STATE, 'default', images.structures.modifier, null)

        this.modifierType = ModifierConfig[modifierId].modifierType
    }

    curState = () => {
        return this.state.current.name
    }

}