import action from '../../images/highlights/highlight_action.png'
import action_target from '../../images/highlights/highlight_action_target.png'
import action_move from '../../images/highlights/highlight_action_move.png'
import attack from '../../images/highlights/highlight_attack.png'
import attack_target from '../../images/highlights/highlight_attack_target.png'
import attack_move from '../../images/highlights/highlight_attack_move.png'
import hover_select from '../../images/highlights/highlight_hover_select.png'
import tile from '../../images/highlights/highlight_info.png'
import movement from '../../images/highlights/highlight_movement.png'
import path from '../../images/highlights/highlight_path.png'
import unit from '../../images/highlights/highlight_unit.png'
import hover_place from '../../images/highlights/highlight_hover_place.png'
import rotate from '../../images/highlights/highlight_rotate.png'
import placement from '../../images/highlights/highlight_placement.png'

import TileImageLoaderClass from '../imageLoaderBaseClass/tileImageLoader'

export default class HighlighImagesClass extends TileImageLoaderClass {

    constructor() {

        super()

        this.image_data = {

            tile_info: tile,
            unit: unit,
            rotate: rotate,
            hover_select: hover_select,
            hover_place: hover_place,
            placement: placement,
            path: path,
            pathing_action: action,
            pathing_action_move: action_move,
            pathing_attack: attack,
            pathing_attack_move: attack_move,
            pathing_movement: movement,
            target_action: action_target,
            target_attack: attack_target,
            target_move: path

        }

    }

}