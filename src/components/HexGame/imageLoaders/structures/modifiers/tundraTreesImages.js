import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import tundra_tree_1 from '../../../images/modifiers/tundra_tree_01.png'
import tundra_tree_2 from '../../../images/modifiers/tundra_tree_02.png'

import { DEFAULT_ROWS } from '../../imageLoaderConstants'

export default class TundraTreesImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = { ...DEFAULT_ROWS }

        this.image_data = {
            tundra_tree_1:{
                sprite: tundra_tree_1,
                shadow: "medium_round_shadow"
            },
            tundra_tree_2: {
                sprite: tundra_tree_2,
                shadow: "medium_round_shadow"
            },
        }

    }


}