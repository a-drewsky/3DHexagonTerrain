import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import rubble_pile from '../../../images/modifiers/rubble_pile.png'

export default class RubblePileImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super({})

        this.image_data = {
            rubble_pile:{
                sprite: rubble_pile,
                shadow: null
            }
        }

    }


}