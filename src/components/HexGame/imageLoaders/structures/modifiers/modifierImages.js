
import empty_mine from '../../../images/modifiers/empty_mine.png'
import rubble_pile from '../../../images/modifiers/rubble_pile.png'
import desert_tree_1 from '../../../images/modifiers/desert_tree_01.png'
import desert_tree_2 from '../../../images/modifiers/desert_tree_02.png'
import rock_1 from '../../../images/modifiers/rock_01.png'
import rock_2 from '../../../images/modifiers/rock_02.png'
import tundra_tree_1 from '../../../images/modifiers/tundra_tree_01.png'
import tundra_tree_2 from '../../../images/modifiers/tundra_tree_02.png'
import woodland_tree_1 from '../../../images/modifiers/woodland_tree_01.png'
import woodland_tree_2 from '../../../images/modifiers/woodland_tree_02.png'

import { DEFAULT_ROWS } from '../../imageLoaderConstants'

import ModifierImagesBaseDataClass from './modifierImagesBaseData'

export default class ModifiersImagesClass extends ModifierImagesBaseDataClass {

    constructor() {

        super()

        this.rows = { ...DEFAULT_ROWS }

        this.image_data = {
            empty_mine: { sprite: empty_mine, shadow: null },
            rubble_pile:{ sprite: rubble_pile, shadow: null },
            rock_1:{ sprite: rock_1, shadow: "small_round_shadow" },
            rock_2: { sprite: rock_2, shadow: null },
            tundra_tree_1:{ sprite: tundra_tree_1, shadow: "medium_round_shadow" },
            tundra_tree_2: { sprite: tundra_tree_2, shadow: "medium_round_shadow" },
            woodland_tree_1:{ sprite: woodland_tree_1, shadow: "medium_round_shadow" },
            woodland_tree_2: { sprite: woodland_tree_2, shadow: "small_round_shadow" },
            cacti_1:{ sprite: desert_tree_1, shadow: "medium_round_shadow" },
            cacti_2: { sprite: desert_tree_2, shadow: "small_round_shadow" },
        }

    }

}