import action from '../images/highlights/highlight_action.png'
import attack from '../images/highlights/highlight_attack.png'
import hover_select from '../images/highlights/highlight_hover_select.png'
import info from '../images/highlights/highlight_info.png'
import movement from '../images/highlights/highlight_movement.png'
import path from '../images/highlights/highlight_path.png'
import unit from '../images/highlights/highlight_unit.png'
import hover_place from '../images/highlights/highlight_hover_place.png'

export default class HighlighImagesClass {

    constructor() {

        this.images = {

            action: new Image(),
            attack: new Image(),
            info: new Image(),
            movement: new Image(),
            path: new Image(),
            unit: new Image(),
            target: new Image(),
            hover_select: new Image(),
            hover_place: new Image()

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


        this.action.src = action
        this.attack.src = attack
        this.info.src = info
        this.movement.src = movement
        this.path.src = path
        this.unit.src = unit
        this.target.src = path
        this.hover_select.src = hover_select
        this.hover_place.src = hover_place


    }

}