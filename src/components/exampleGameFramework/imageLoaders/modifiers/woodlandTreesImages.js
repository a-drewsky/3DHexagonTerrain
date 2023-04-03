import ModifierImagesBaseDataClass from './modifierImagesBaseData'

import woodland_tree_1 from '../../images/modifiers/woodland_tree_01.png'
import woodland_tree_2 from '../../images/modifiers/woodland_tree_02.png'

import medium_round_shadow_sheet from '../../images/shadows/medium_round_shadow_sheet.png'
import small_round_shadow_sheet from '../../images/shadows/small_round_shadow_sheet.png'

export default class WoodlandTreesImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super({medium_round_shadow: medium_round_shadow_sheet, small_round_shadow: small_round_shadow_sheet})

        this.rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back'
        }

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