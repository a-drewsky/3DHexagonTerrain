import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import desert_tree_1 from '../../../images/modifiers/desert_tree_01.png'
import desert_tree_2 from '../../../images/modifiers/desert_tree_02.png'

export default class DesertTreesImagesClass extends ModifierImagesBaseDataClass {

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
            desert_tree_1:{
                sprite: desert_tree_1,
                shadow: "medium_round_shadow"
            },
            desert_tree_2: {
                sprite: desert_tree_2,
                shadow: "small_round_shadow"
            },
        }

    }


}