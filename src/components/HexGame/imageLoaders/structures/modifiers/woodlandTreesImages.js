import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import woodland_tree_1 from '../../../images/modifiers/woodland_tree_01.png'
import woodland_tree_2 from '../../../images/modifiers/woodland_tree_02.png'

import { DEFAULT_ROWS } from '../../imageLoaderConstants'

export default class WoodlandTreesImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = { ...DEFAULT_ROWS }

        this.image_data = {
            woodland_tree_1:{
                sprite: woodland_tree_1,
                shadow: "medium_round_shadow"
            },
            woodland_tree_2: {
                sprite: woodland_tree_2,
                shadow: "small_round_shadow"
            },
        }

    }


}