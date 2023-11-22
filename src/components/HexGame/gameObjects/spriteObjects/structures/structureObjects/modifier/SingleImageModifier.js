
import ModifierConfig from "../../../../../config/ModifierConfig"

import ModifierClass from "./Modifier"

export default class SingleImageModifierClass extends ModifierClass {
    constructor(pos, modifierId, images) {
        if (!ModifierConfig[modifierId]) throw Error(`Invalid Modifier ID: (${modifierId}). Modifier config properties are: [${Object.getOwnPropertyNames(ModifierConfig).splice(3)}]`)
        super(pos, modifierId, images)

        this.sprite = ModifierConfig[modifierId].sprite

    }
}