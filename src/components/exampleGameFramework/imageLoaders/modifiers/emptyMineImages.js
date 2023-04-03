import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import empty_mine from '../../images/modifiers/empty_mine.png'

export default class EmptyMineImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super({})

        this.shadowSize = {
            width: 0,
            height: 0
        }

        this.shadowOffset = {
            x: 0,
            y: 0
        }

        this.image_data = {
            empty_mine:{
                sprite: empty_mine,
                shadow: null
            }
        }

    }


}