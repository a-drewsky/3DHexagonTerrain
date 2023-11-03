import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import rock_1 from '../../../images/modifiers/rock_01.png'
import rock_2 from '../../../images/modifiers/rock_02.png'

import { DEFAULT_ROWS } from '../../imageLoaderConstants'

export default class SmallRocksImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = { ...DEFAULT_ROWS }

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