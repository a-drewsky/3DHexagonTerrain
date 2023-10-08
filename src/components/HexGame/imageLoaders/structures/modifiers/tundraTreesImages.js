import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import tundra_tree_1 from '../../../images/modifiers/tundra_tree_01.png'
import tundra_tree_2 from '../../../images/modifiers/tundra_tree_02.png'

export default class TundraTreesImagesClass extends ModifierImagesBaseDataClass {

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