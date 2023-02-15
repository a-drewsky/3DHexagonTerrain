import savanna_tree from '../images/structures/savanna_tree.png'
import large_rock from '../images/structures/large_rock.png'


import large_rock_shadow_1 from '../images/shadows/large_round_shadow_1.png'
import large_rock_shadow_3 from '../images/shadows/large_round_shadow_3.png'
import large_rock_shadow_5 from '../images/shadows/large_round_shadow_5.png'
import large_rock_shadow_7 from '../images/shadows/large_round_shadow_7.png'
import large_rock_shadow_9 from '../images/shadows/large_round_shadow_9.png'
import large_rock_shadow_11 from '../images/shadows/large_round_shadow_11.png'

import savanna_tree_shadow_1 from '../images/shadows/savanna_tree_shadow_1.png'
import savanna_tree_shadow_3 from '../images/shadows/savanna_tree_shadow_3.png'
import savanna_tree_shadow_5 from '../images/shadows/savanna_tree_shadow_5.png'
import savanna_tree_shadow_7 from '../images/shadows/savanna_tree_shadow_7.png'
import savanna_tree_shadow_9 from '../images/shadows/savanna_tree_shadow_9.png'
import savanna_tree_shadow_11 from '../images/shadows/savanna_tree_shadow_11.png'


export default class PropImagesClass {

    constructor() {

        this.images = {
            savannatree_sprite: new Image(),

            largerock_sprite: new Image(),

            large_rock_shadow_1: new Image(),
            large_rock_shadow_3: new Image(),
            large_rock_shadow_5: new Image(),
            large_rock_shadow_7: new Image(),
            large_rock_shadow_9: new Image(),
            large_rock_shadow_11: new Image(),

            savanna_tree_shadow_1: new Image(),
            savanna_tree_shadow_3: new Image(),
            savanna_tree_shadow_5: new Image(),
            savanna_tree_shadow_7: new Image(),
            savanna_tree_shadow_9: new Image(),
            savanna_tree_shadow_11: new Image()
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

        this.savannatree_sprite.src = savanna_tree
        this.largerock_sprite.src = large_rock

        this.large_rock_shadow_1.src = large_rock_shadow_1
        this.large_rock_shadow_3.src = large_rock_shadow_3
        this.large_rock_shadow_5.src = large_rock_shadow_5
        this.large_rock_shadow_7.src = large_rock_shadow_7
        this.large_rock_shadow_9.src = large_rock_shadow_9
        this.large_rock_shadow_11.src = large_rock_shadow_11

        this.savanna_tree_shadow_1.src = savanna_tree_shadow_1
        this.savanna_tree_shadow_3.src = savanna_tree_shadow_3
        this.savanna_tree_shadow_5.src = savanna_tree_shadow_5
        this.savanna_tree_shadow_7.src = savanna_tree_shadow_7
        this.savanna_tree_shadow_9.src = savanna_tree_shadow_9
        this.savanna_tree_shadow_11.src = savanna_tree_shadow_11



        //Create Image objects

        this.savannatree = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            shadowSize: {
                width: 2,
                height: 1.5
            },
            shadowOffset: {
                x: 0.5,
                y: 0.5
            },
            images: [
                [this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite]
            ],
            shadowImages: [
                [null, this.savanna_tree_shadow_1, null, this.savanna_tree_shadow_3, null, this.savanna_tree_shadow_5, null, this.savanna_tree_shadow_7, null, this.savanna_tree_shadow_9, null, this.savanna_tree_shadow_11]
            ],
            deadSpace: [
                [null, 2 / 32, null, 2 / 32, null, 2 / 32, null, 2 / 32, null, 2 / 32, null, 2 / 32]
            ]
        }

        this.largerock = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            shadowSize: {
                width: 2,
                height: 1.5
            },
            shadowOffset: {
                x: 0.5,
                y: 0.5
            },
            images: [
                [this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite]
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32]
            ]
        }

    }

}