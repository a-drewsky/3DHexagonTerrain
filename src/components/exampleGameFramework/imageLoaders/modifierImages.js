import woodlands_tree_1 from '../images/modifiers/woodland_tree_01.png'
import woodlands_tree_2 from '../images/modifiers/woodland_tree_02.png'
import tundra_tree_1 from '../images/modifiers/tundra_tree_01.png'
import tundra_tree_2 from '../images/modifiers/tundra_tree_02.png'
import desert_tree_1 from '../images/modifiers/desert_tree_01.png'
import desert_tree_2 from '../images/modifiers/desert_tree_02.png'

import rock_1 from '../images/modifiers/rock_01.png'
import rock_2 from '../images/modifiers/rock_02.png'

import modifier_shadow_large_1 from '../images/modifiers/shadows/modifier_shadow_large_1.png'
import modifier_shadow_large_3 from '../images/modifiers/shadows/modifier_shadow_large_3.png'
import modifier_shadow_large_5 from '../images/modifiers/shadows/modifier_shadow_large_5.png'
import modifier_shadow_large_7 from '../images/modifiers/shadows/modifier_shadow_large_7.png'
import modifier_shadow_large_9 from '../images/modifiers/shadows/modifier_shadow_large_9.png'
import modifier_shadow_large_11 from '../images/modifiers/shadows/modifier_shadow_large_11.png'

import modifier_shadow_small_1 from '../images/modifiers/shadows/modifier_shadow_small_1.png'
import modifier_shadow_small_3 from '../images/modifiers/shadows/modifier_shadow_small_3.png'
import modifier_shadow_small_5 from '../images/modifiers/shadows/modifier_shadow_small_5.png'
import modifier_shadow_small_7 from '../images/modifiers/shadows/modifier_shadow_small_7.png'
import modifier_shadow_small_9 from '../images/modifiers/shadows/modifier_shadow_small_9.png'
import modifier_shadow_small_11 from '../images/modifiers/shadows/modifier_shadow_small_11.png'

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


            modifier_shadow_large_1: new Image(),
            modifier_shadow_large_3: new Image(),
            modifier_shadow_large_5: new Image(),
            modifier_shadow_large_7: new Image(),
            modifier_shadow_large_9: new Image(),
            modifier_shadow_large_11: new Image(),

            modifier_shadow_small_1: new Image(),
            modifier_shadow_small_3: new Image(),
            modifier_shadow_small_5: new Image(),
            modifier_shadow_small_7: new Image(),
            modifier_shadow_small_9: new Image(),
            modifier_shadow_small_11: new Image(),

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


        this.modifier_shadow_large_1.src = modifier_shadow_large_1
        this.modifier_shadow_large_3.src = modifier_shadow_large_3
        this.modifier_shadow_large_5.src = modifier_shadow_large_5
        this.modifier_shadow_large_7.src = modifier_shadow_large_7
        this.modifier_shadow_large_9.src = modifier_shadow_large_9
        this.modifier_shadow_large_11.src = modifier_shadow_large_11

        this.modifier_shadow_small_1.src = modifier_shadow_small_1
        this.modifier_shadow_small_3.src = modifier_shadow_small_3
        this.modifier_shadow_small_5.src = modifier_shadow_small_5
        this.modifier_shadow_small_7.src = modifier_shadow_small_7
        this.modifier_shadow_small_9.src = modifier_shadow_small_9
        this.modifier_shadow_small_11.src = modifier_shadow_small_11


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
                    [null, this.modifier_shadow_large_1, null, this.modifier_shadow_large_3, null, this.modifier_shadow_large_5, null, this.modifier_shadow_large_7, null, this.modifier_shadow_large_9, null, this.modifier_shadow_large_11],
                    [null, this.modifier_shadow_small_1, null, this.modifier_shadow_small_3, null, this.modifier_shadow_small_5, null, this.modifier_shadow_small_7, null, this.modifier_shadow_small_9, null, this.modifier_shadow_small_11]
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
                    [null, this.modifier_shadow_large_1, null, this.modifier_shadow_large_3, null, this.modifier_shadow_large_5, null, this.modifier_shadow_large_7, null, this.modifier_shadow_large_9, null, this.modifier_shadow_large_11],
                    [null, this.modifier_shadow_large_1, null, this.modifier_shadow_large_3, null, this.modifier_shadow_large_5, null, this.modifier_shadow_large_7, null, this.modifier_shadow_large_9, null, this.modifier_shadow_large_11]
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
                    [null, this.modifier_shadow_large_1, null, this.modifier_shadow_large_3, null, this.modifier_shadow_large_5, null, this.modifier_shadow_large_7, null, this.modifier_shadow_large_9, null, this.modifier_shadow_large_11],
                    [null, this.modifier_shadow_small_1, null, this.modifier_shadow_small_3, null, this.modifier_shadow_small_5, null, this.modifier_shadow_small_7, null, this.modifier_shadow_small_9, null, this.modifier_shadow_small_11]
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
                    [null, this.modifier_shadow_small_1, null, this.modifier_shadow_small_3, null, this.modifier_shadow_small_5, null, this.modifier_shadow_small_7, null, this.modifier_shadow_small_9, null, this.modifier_shadow_small_11],
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