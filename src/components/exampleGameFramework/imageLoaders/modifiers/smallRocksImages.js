import ModifierImageLoaderClass from './modifierImageLoader'

import rock_1 from '../../images/modifiers/rock_01.png'
import rock_2 from '../../images/modifiers/rock_02.png'

import small_round_shadow_sheet from '../../images/shadows/small_round_shadow_sheet.png'

export default class SmallRocksImagesClass extends ModifierImageLoaderClass {

    constructor() {

        super({small_round_shadow: small_round_shadow_sheet})

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