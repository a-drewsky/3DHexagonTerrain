import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import rock_1 from '../../../images/modifiers/rock_01.png'
import rock_2 from '../../../images/modifiers/rock_02.png'

export default class SmallRocksImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back'
        }

        this.image_data = {
            rock_1:{
                sprite: rock_1,
                shadow: "small_round_shadow"
            },
            rock_2: {
                sprite: rock_2,
                shadow: null
            },
        }

    }


}