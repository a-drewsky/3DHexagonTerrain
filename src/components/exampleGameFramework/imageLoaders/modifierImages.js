import woodlands_tree_1 from '../images/modifiers/woodland_tree_01.png'
import woodlands_tree_2 from '../images/modifiers/woodland_tree_02.png'
import tundra_tree_1 from '../images/modifiers/tundra_tree_01.png'
import tundra_tree_2 from '../images/modifiers/tundra_tree_02.png'
import desert_tree_1 from '../images/modifiers/desert_tree_01.png'
import desert_tree_2 from '../images/modifiers/desert_tree_02.png'

import rock_1 from '../images/modifiers/rock_01.png'
import rock_2 from '../images/modifiers/rock_02.png'

import medium_round_shadow_1 from '../images/shadows/medium_round_shadow_1.png'
import medium_round_shadow_3 from '../images/shadows/medium_round_shadow_3.png'
import medium_round_shadow_5 from '../images/shadows/medium_round_shadow_5.png'
import medium_round_shadow_7 from '../images/shadows/medium_round_shadow_7.png'
import medium_round_shadow_9 from '../images/shadows/medium_round_shadow_9.png'
import medium_round_shadow_11 from '../images/shadows/medium_round_shadow_11.png'

import small_round_shadow_1 from '../images/shadows/small_round_shadow_1.png'
import small_round_shadow_3 from '../images/shadows/small_round_shadow_3.png'
import small_round_shadow_5 from '../images/shadows/small_round_shadow_5.png'
import small_round_shadow_7 from '../images/shadows/small_round_shadow_7.png'
import small_round_shadow_9 from '../images/shadows/small_round_shadow_9.png'
import small_round_shadow_11 from '../images/shadows/small_round_shadow_11.png'

export default class ModifierImagesClass {

    constructor() {

        this.images = {

            oaktree_sprite_1: new Image(),
            oaktree_sprite_2: new Image(),

            tundratree_sprite_1: new Image(),
            tundratree_sprite_2: new Image(),

            deserttree_sprite_1: new Image(),
            deserttree_sprite_2: new Image(),

            rock_sprite_1: new Image(),
            rock_sprite_2: new Image(),


            medium_round_shadow_1: new Image(),
            medium_round_shadow_3: new Image(),
            medium_round_shadow_5: new Image(),
            medium_round_shadow_7: new Image(),
            medium_round_shadow_9: new Image(),
            medium_round_shadow_11: new Image(),

            small_round_shadow_1: new Image(),
            small_round_shadow_3: new Image(),
            small_round_shadow_5: new Image(),
            small_round_shadow_7: new Image(),
            small_round_shadow_9: new Image(),
            small_round_shadow_11: new Image(),

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
                }
            }
        }


        this.oaktree_sprite_1.src = woodlands_tree_1;
        this.oaktree_sprite_2.src = woodlands_tree_2;

        this.tundratree_sprite_1.src = tundra_tree_1
        this.tundratree_sprite_2.src = tundra_tree_2

        this.deserttree_sprite_1.src = desert_tree_1
        this.deserttree_sprite_2.src = desert_tree_2

        this.rock_sprite_1.src = rock_1
        this.rock_sprite_2.src = rock_2


        this.medium_round_shadow_1.src = medium_round_shadow_1
        this.medium_round_shadow_3.src = medium_round_shadow_3
        this.medium_round_shadow_5.src = medium_round_shadow_5
        this.medium_round_shadow_7.src = medium_round_shadow_7
        this.medium_round_shadow_9.src = medium_round_shadow_9
        this.medium_round_shadow_11.src = medium_round_shadow_11

        this.small_round_shadow_1.src = small_round_shadow_1
        this.small_round_shadow_3.src = small_round_shadow_3
        this.small_round_shadow_5.src = small_round_shadow_5
        this.small_round_shadow_7.src = small_round_shadow_7
        this.small_round_shadow_9.src = small_round_shadow_9
        this.small_round_shadow_11.src = small_round_shadow_11


        this.size = {
            width: 1,
            height: 2
        }
        this.offset = {
            x: 0,
            y: 1
        }
        this.modifierSize = {
            width: 1,
            height: 1.5
        }
        this.shadowSpriteSize = {
            width: 1,
            height: 1.5
        }
        this.oaktree = {
            modifierImages: [
                this.oaktree_sprite_1,
                this.oaktree_sprite_2
            ],
            shadowImages: [
                [null, this.medium_round_shadow_1, null, this.medium_round_shadow_3, null, this.medium_round_shadow_5, null, this.medium_round_shadow_7, null, this.medium_round_shadow_9, null, this.medium_round_shadow_11],
                [null, this.small_round_shadow_1, null, this.small_round_shadow_3, null, this.small_round_shadow_5, null, this.small_round_shadow_7, null, this.small_round_shadow_9, null, this.small_round_shadow_11]
            ],
            shadowSize: {
                width: 2,
                height: 2
            },
            shadowOffset: {
                x: 0.5,
                y: 1
            }
        }
        this.tundratree = {
            modifierImages: [
                this.tundratree_sprite_1,
                this.tundratree_sprite_2
            ],
            shadowImages: [
                [null, this.medium_round_shadow_1, null, this.medium_round_shadow_3, null, this.medium_round_shadow_5, null, this.medium_round_shadow_7, null, this.medium_round_shadow_9, null, this.medium_round_shadow_11],
                [null, this.medium_round_shadow_1, null, this.medium_round_shadow_3, null, this.medium_round_shadow_5, null, this.medium_round_shadow_7, null, this.medium_round_shadow_9, null, this.medium_round_shadow_11]
            ],
            shadowSize: {
                width: 2,
                height: 2
            },
            shadowOffset: {
                x: 0.5,
                y: 1
            }
        }
        this.deserttree = {
            modifierImages: [
                this.deserttree_sprite_1,
                this.deserttree_sprite_2
            ],
            shadowImages: [
                [null, this.medium_round_shadow_1, null, this.medium_round_shadow_3, null, this.medium_round_shadow_5, null, this.medium_round_shadow_7, null, this.medium_round_shadow_9, null, this.medium_round_shadow_11],
                [null, this.small_round_shadow_1, null, this.small_round_shadow_3, null, this.small_round_shadow_5, null, this.small_round_shadow_7, null, this.small_round_shadow_9, null, this.small_round_shadow_11]
            ],
            shadowSize: {
                width: 2,
                height: 2
            },
            shadowOffset: {
                x: 0.5,
                y: 1
            }
        }
        this.rocks = {
            modifierImages: [
                this.rock_sprite_1,
                this.rock_sprite_2
            ],
            shadowImages: [
                [null, this.small_round_shadow_1, null, this.small_round_shadow_3, null, this.small_round_shadow_5, null, this.small_round_shadow_7, null, this.small_round_shadow_9, null, this.small_round_shadow_11],
                [null, null, null, null, null, null, null, null, null, null, null, null]
            ],
            shadowSize: {
                width: 2,
                height: 2
            },
            shadowOffset: {
                x: 0.5,
                y: 1
            }
        }
    }


}