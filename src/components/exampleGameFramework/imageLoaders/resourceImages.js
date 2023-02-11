import copper_mine_1 from '../images/structures/mines/copper_mine_1.png'
import copper_mine_2 from '../images/structures/mines/copper_mine_2.png'
import copper_mine_3 from '../images/structures/mines/copper_mine_3.png'
import copper_mine_4 from '../images/structures/mines/copper_mine_4.png'
import copper_mine_5 from '../images/structures/mines/copper_mine_5.png'

import gold_mine_1 from '../images/structures/mines/gold_mine_1.png'
import gold_mine_2 from '../images/structures/mines/gold_mine_2.png'
import gold_mine_3 from '../images/structures/mines/gold_mine_3.png'
import gold_mine_4 from '../images/structures/mines/gold_mine_4.png'
import gold_mine_5 from '../images/structures/mines/gold_mine_5.png'

import iron_mine_1 from '../images/structures/mines/iron_mine_1.png'
import iron_mine_2 from '../images/structures/mines/iron_mine_2.png'
import iron_mine_3 from '../images/structures/mines/iron_mine_3.png'
import iron_mine_4 from '../images/structures/mines/iron_mine_4.png'
import iron_mine_5 from '../images/structures/mines/iron_mine_5.png'

import ruby_mine_1 from '../images/structures/mines/ruby_mine_1.png'
import ruby_mine_2 from '../images/structures/mines/ruby_mine_2.png'
import ruby_mine_3 from '../images/structures/mines/ruby_mine_3.png'
import ruby_mine_4 from '../images/structures/mines/ruby_mine_4.png'
import ruby_mine_5 from '../images/structures/mines/ruby_mine_5.png'

import amethyst_mine_1 from '../images/structures/mines/amethyst_mine_1.png'
import amethyst_mine_2 from '../images/structures/mines/amethyst_mine_2.png'
import amethyst_mine_3 from '../images/structures/mines/amethyst_mine_3.png'
import amethyst_mine_4 from '../images/structures/mines/amethyst_mine_4.png'
import amethyst_mine_5 from '../images/structures/mines/amethyst_mine_5.png'


import large_rock_shadow_1 from '../images/shadows/large_round_shadow_1.png'
import large_rock_shadow_3 from '../images/shadows/large_round_shadow_3.png'
import large_rock_shadow_5 from '../images/shadows/large_round_shadow_5.png'
import large_rock_shadow_7 from '../images/shadows/large_round_shadow_7.png'
import large_rock_shadow_9 from '../images/shadows/large_round_shadow_9.png'
import large_rock_shadow_11 from '../images/shadows/large_round_shadow_11.png'

export default class StructureImagesClass {

    constructor() {

        this.images = {
            coppermine_sprite_1: new Image(),
            coppermine_sprite_2: new Image(),
            coppermine_sprite_3: new Image(),
            coppermine_sprite_4: new Image(),
            coppermine_sprite_5: new Image(),

            goldmine_sprite_1: new Image(),
            goldmine_sprite_2: new Image(),
            goldmine_sprite_3: new Image(),
            goldmine_sprite_4: new Image(),
            goldmine_sprite_5: new Image(),

            ironmine_sprite_1: new Image(),
            ironmine_sprite_2: new Image(),
            ironmine_sprite_3: new Image(),
            ironmine_sprite_4: new Image(),
            ironmine_sprite_5: new Image(),

            rubymine_sprite_1: new Image(),
            rubymine_sprite_2: new Image(),
            rubymine_sprite_3: new Image(),
            rubymine_sprite_4: new Image(),
            rubymine_sprite_5: new Image(),

            amethystmine_sprite_1: new Image(),
            amethystmine_sprite_2: new Image(),
            amethystmine_sprite_3: new Image(),
            amethystmine_sprite_4: new Image(),
            amethystmine_sprite_5: new Image(),

            large_rock_shadow_1: new Image(),
            large_rock_shadow_3: new Image(),
            large_rock_shadow_5: new Image(),
            large_rock_shadow_7: new Image(),
            large_rock_shadow_9: new Image(),
            large_rock_shadow_11: new Image()
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

        this.coppermine_sprite_1.src = copper_mine_1
        this.coppermine_sprite_2.src = copper_mine_2
        this.coppermine_sprite_3.src = copper_mine_3
        this.coppermine_sprite_4.src = copper_mine_4
        this.coppermine_sprite_5.src = copper_mine_5

        this.goldmine_sprite_1.src = gold_mine_1
        this.goldmine_sprite_2.src = gold_mine_2
        this.goldmine_sprite_3.src = gold_mine_3
        this.goldmine_sprite_4.src = gold_mine_4
        this.goldmine_sprite_5.src = gold_mine_5

        this.ironmine_sprite_1.src = iron_mine_1
        this.ironmine_sprite_2.src = iron_mine_2
        this.ironmine_sprite_3.src = iron_mine_3
        this.ironmine_sprite_4.src = iron_mine_4
        this.ironmine_sprite_5.src = iron_mine_5

        this.rubymine_sprite_1.src = ruby_mine_1
        this.rubymine_sprite_2.src = ruby_mine_2
        this.rubymine_sprite_3.src = ruby_mine_3
        this.rubymine_sprite_4.src = ruby_mine_4
        this.rubymine_sprite_5.src = ruby_mine_5

        this.amethystmine_sprite_1.src = amethyst_mine_1
        this.amethystmine_sprite_2.src = amethyst_mine_2
        this.amethystmine_sprite_3.src = amethyst_mine_3
        this.amethystmine_sprite_4.src = amethyst_mine_4
        this.amethystmine_sprite_5.src = amethyst_mine_5

        this.large_rock_shadow_1.src = large_rock_shadow_1
        this.large_rock_shadow_3.src = large_rock_shadow_3
        this.large_rock_shadow_5.src = large_rock_shadow_5
        this.large_rock_shadow_7.src = large_rock_shadow_7
        this.large_rock_shadow_9.src = large_rock_shadow_9
        this.large_rock_shadow_11.src = large_rock_shadow_11



        //Create Image objects

        this.coppermine = {
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
                [null, this.coppermine_sprite_1, null, this.coppermine_sprite_1, null, this.coppermine_sprite_1, null, this.coppermine_sprite_1, null, this.coppermine_sprite_1, null, this.coppermine_sprite_1],
                [null, this.coppermine_sprite_2, null, this.coppermine_sprite_2, null, this.coppermine_sprite_2, null, this.coppermine_sprite_2, null, this.coppermine_sprite_2, null, this.coppermine_sprite_2],
                [null, this.coppermine_sprite_3, null, this.coppermine_sprite_3, null, this.coppermine_sprite_3, null, this.coppermine_sprite_3, null, this.coppermine_sprite_3, null, this.coppermine_sprite_3],
                [null, this.coppermine_sprite_4, null, this.coppermine_sprite_4, null, this.coppermine_sprite_4, null, this.coppermine_sprite_4, null, this.coppermine_sprite_4, null, this.coppermine_sprite_4],
                [null, this.coppermine_sprite_5, null, this.coppermine_sprite_5, null, this.coppermine_sprite_5, null, this.coppermine_sprite_5, null, this.coppermine_sprite_5, null, this.coppermine_sprite_5]
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32],
                [null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
            ]

        }

        this.goldmine = {
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
                [this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1],
                [this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2],
                [this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3],
                [this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4],
                [this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5],
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32],
                [null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
            ]
        }

        this.ironmine = {
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
                [this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1],
                [this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2],
                [this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3],
                [this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4],
                [this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5],
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32],
                [null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
            ]
        }

        this.rubymine = {
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
                [this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1],
                [this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2],
                [this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3],
                [this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4],
                [this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5],
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32],
                [null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
            ]
        }

        this.amethystmine = {
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
                [this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1],
                [this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2],
                [this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3],
                [this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4],
                [this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5],
            ],
            shadowImages: [
                [null, this.large_rock_shadow_1, null, this.large_rock_shadow_3, null, this.large_rock_shadow_5, null, this.large_rock_shadow_7, null, this.large_rock_shadow_9, null, this.large_rock_shadow_11]
            ],
            deadSpace: [
                [null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32, null, 11 / 32],
                [null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32, null, 13 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
                [null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32, null, 18 / 32],
            ]
        }

    }

}