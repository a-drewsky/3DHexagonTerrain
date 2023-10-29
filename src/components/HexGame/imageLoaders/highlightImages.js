import action from '../images/highlights/highlight_action.png'
import action_target from '../images/highlights/highlight_action_target.png'
import attack from '../images/highlights/highlight_attack.png'
import attack_target from '../images/highlights/highlight_attack_target.png'
import hover_select from '../images/highlights/highlight_hover_select.png'
import tile from '../images/highlights/highlight_info.png'
import movement from '../images/highlights/highlight_movement.png'
import path from '../images/highlights/highlight_path.png'
import unit from '../images/highlights/highlight_unit.png'
import hover_place from '../images/highlights/highlight_hover_place.png'
import rotate from '../images/highlights/highlight_rotate.png'
import placement from '../images/highlights/highlight_placement.png'

export default class HighlighImagesClass {

    constructor() {

        this.images = {

            tile_info: new Image(),
            unit: new Image(),
            rotate: new Image(),
            hover_select: new Image(),
            hover_place: new Image(),
            placement: new Image(),
            path: new Image(),
            pathing_action: new Image(),
            pathing_attack: new Image(),
            pathing_movement: new Image(),
            target_action: new Image(),
            target_attack: new Image(),
            target_move: new Image(),

        }

    }

    loadImages = (startGame) => {

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    startGame();
                    delete this.loadImages
                }
            }
        }


        this.tile_info.src = tile
        this.unit.src = unit
        this.rotate.src = rotate
        this.hover_select.src = hover_select
        this.hover_place.src = hover_place
        this.placement.src = placement
        this.path.src = path
        this.pathing_action.src = action
        this.pathing_attack.src = attack
        this.pathing_movement.src = movement
        this.target_action.src = action_target
        this.target_attack.src = attack_target
        this.target_move.src = path


    }

}