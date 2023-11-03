import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import desert_tree_1 from '../../../images/modifiers/desert_tree_01.png'
import desert_tree_2 from '../../../images/modifiers/desert_tree_02.png'

import { DEFAULT_ROWS } from '../../imageLoaderConstants'

export default class DesertTreesImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = { ...DEFAULT_ROWS }

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