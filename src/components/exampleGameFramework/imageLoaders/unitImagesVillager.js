import front_idle_1 from '../images/units/villagerUnit/front/villager_unit_f_1.png'
import front_walk_1 from '../images/units/villagerUnit/front/villager_unit_f_2.png'
import front_walk_2 from '../images/units/villagerUnit/front/villager_unit_f_3.png'
import front_jump_1 from '../images/units/villagerUnit/front/villager_unit_f_4.png'
import front_jump_2 from '../images/units/villagerUnit/front/villager_unit_f_5.png'

import frontLeft_idle_1 from '../images/units/villagerUnit/frontLeft/villager_unit_fl_1.png'
import frontLeft_walk_1 from '../images/units/villagerUnit/frontLeft/villager_unit_fl_2.png'
import frontLeft_walk_2 from '../images/units/villagerUnit/frontLeft/villager_unit_fl_3.png'
import frontLeft_jump_1 from '../images/units/villagerUnit/frontLeft/villager_unit_fl_4.png'
import frontLeft_jump_2 from '../images/units/villagerUnit/frontLeft/villager_unit_fl_5.png'

import frontRight_idle_1 from '../images/units/villagerUnit/frontRight/villager_unit_fr_1.png'
import frontRight_walk_1 from '../images/units/villagerUnit/frontRight/villager_unit_fr_2.png'
import frontRight_walk_2 from '../images/units/villagerUnit/frontRight/villager_unit_fr_3.png'
import frontRight_jump_1 from '../images/units/villagerUnit/frontRight/villager_unit_fr_4.png'
import frontRight_jump_2 from '../images/units/villagerUnit/frontRight/villager_unit_fr_5.png'

import back_idle_1 from '../images/units/villagerUnit/back/villager_unit_b_1.png'
import back_walk_1 from '../images/units/villagerUnit/back/villager_unit_b_2.png'
import back_walk_2 from '../images/units/villagerUnit/back/villager_unit_b_3.png'
import back_jump_1 from '../images/units/villagerUnit/back/villager_unit_b_4.png'
import back_jump_2 from '../images/units/villagerUnit/back/villager_unit_b_5.png'

import backLeft_idle_1 from '../images/units/villagerUnit/backLeft/villager_unit_bl_1.png'
import backLeft_walk_1 from '../images/units/villagerUnit/backLeft/villager_unit_bl_2.png'
import backLeft_walk_2 from '../images/units/villagerUnit/backLeft/villager_unit_bl_3.png'
import backLeft_jump_1 from '../images/units/villagerUnit/backLeft/villager_unit_bl_4.png'
import backLeft_jump_2 from '../images/units/villagerUnit/backLeft/villager_unit_bl_5.png'

import backRight_idle_1 from '../images/units/villagerUnit/backRight/villager_unit_br_1.png'
import backRight_walk_1 from '../images/units/villagerUnit/backRight/villager_unit_br_2.png'
import backRight_walk_2 from '../images/units/villagerUnit/backRight/villager_unit_br_3.png'
import backRight_jump_1 from '../images/units/villagerUnit/backRight/villager_unit_br_4.png'
import backRight_jump_2 from '../images/units/villagerUnit/backRight/villager_unit_br_5.png'

import shadow_1 from '../images/modifiers/shadows/modifier_shadow_large_1.png'
import shadow_3 from '../images/modifiers/shadows/modifier_shadow_large_3.png'
import shadow_5 from '../images/modifiers/shadows/modifier_shadow_large_5.png'
import shadow_7 from '../images/modifiers/shadows/modifier_shadow_large_7.png'
import shadow_9 from '../images/modifiers/shadows/modifier_shadow_large_9.png'
import shadow_11 from '../images/modifiers/shadows/modifier_shadow_large_11.png'

export default class UnitImagesVillagerClass {

    constructor() {

        this.images = {

            front_idle_1: new Image(),
            front_walk_1: new Image(),
            front_walk_2: new Image(),
            front_jump_1: new Image(),
            front_jump_2: new Image(),

            frontLeft_idle_1: new Image(),
            frontLeft_walk_1: new Image(),
            frontLeft_walk_2: new Image(),
            frontLeft_jump_1: new Image(),
            frontLeft_jump_2: new Image(),

            frontRight_idle_1: new Image(),
            frontRight_walk_1: new Image(),
            frontRight_walk_2: new Image(),
            frontRight_jump_1: new Image(),
            frontRight_jump_2: new Image(),

            back_idle_1: new Image(),
            back_walk_1: new Image(),
            back_walk_2: new Image(),
            back_jump_1: new Image(),
            back_jump_2: new Image(),

            backLeft_idle_1: new Image(),
            backLeft_walk_1: new Image(),
            backLeft_walk_2: new Image(),
            backLeft_jump_1: new Image(),
            backLeft_jump_2: new Image(),

            backRight_idle_1: new Image(),
            backRight_walk_1: new Image(),
            backRight_walk_2: new Image(),
            backRight_jump_1: new Image(),
            backRight_jump_2: new Image(),

            shadow_1: new Image(),
            shadow_3: new Image(),
            shadow_5: new Image(),
            shadow_7: new Image(),
            shadow_9: new Image(),
            shadow_11: new Image()

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


        this.front_idle_1.src = front_idle_1
        this.front_walk_1.src = front_walk_1
        this.front_walk_2.src = front_walk_2
        this.front_jump_1.src = front_jump_1
        this.front_jump_2.src = front_jump_2

        this.frontLeft_idle_1.src = frontLeft_idle_1
        this.frontLeft_walk_1.src = frontLeft_walk_1
        this.frontLeft_walk_2.src = frontLeft_walk_2
        this.frontLeft_jump_1.src = frontLeft_jump_1
        this.frontLeft_jump_2.src = frontLeft_jump_2

        this.frontRight_idle_1.src = frontRight_idle_1
        this.frontRight_walk_1.src = frontRight_walk_1
        this.frontRight_walk_2.src = frontRight_walk_2
        this.frontRight_jump_1.src = frontRight_jump_1
        this.frontRight_jump_2.src = frontRight_jump_2

        this.back_idle_1.src = back_idle_1
        this.back_walk_1.src = back_walk_1
        this.back_walk_2.src = back_walk_2
        this.back_jump_1.src = back_jump_1
        this.back_jump_2.src = back_jump_2

        this.backLeft_idle_1.src = backLeft_idle_1
        this.backLeft_walk_1.src = backLeft_walk_1
        this.backLeft_walk_2.src = backLeft_walk_2
        this.backLeft_jump_1.src = backLeft_jump_1
        this.backLeft_jump_2.src = backLeft_jump_2

        this.backRight_idle_1.src = backRight_idle_1
        this.backRight_walk_1.src = backRight_walk_1
        this.backRight_walk_2.src = backRight_walk_2
        this.backRight_jump_1.src = backRight_jump_1
        this.backRight_jump_2.src = backRight_jump_2

        this.shadow_1.src = shadow_1
        this.shadow_3.src = shadow_3
        this.shadow_5.src = shadow_5
        this.shadow_7.src = shadow_7
        this.shadow_9.src = shadow_9
        this.shadow_11.src = shadow_11


        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.shadowSize = {
            width: 1,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0,
            y: 0.5
        }

        this.deadSpace = [
            [null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32]
        ]

        this.idle = {
            images: [
                [null, this.backRight_idle_1, null, this.frontRight_idle_1, null, this.front_idle_1, null, this.frontLeft_idle_1, null, this.backLeft_idle_1, null, this.back_idle_1]
            ]
        }

        this.walk = {
            images: [
                [null, this.backRight_walk_1, null, this.frontRight_walk_1, null, this.front_walk_1, null, this.frontLeft_walk_1, null, this.backLeft_walk_1, null, this.back_walk_1],
                [null, this.backRight_walk_2, null, this.frontRight_walk_2, null, this.front_walk_2, null, this.frontLeft_walk_2, null, this.backLeft_walk_2, null, this.back_walk_2]
            ]
        }

        this.jumpUp = {
            images: [
                [null, this.backRight_jump_1, null, this.frontRight_jump_1, null, this.front_jump_1, null, this.frontLeft_jump_1, null, this.backLeft_jump_1, null, this.back_jump_1]
            ]
        }

        this.jumpDown = {
            images: [
                [null, this.backRight_jump_2, null, this.frontRight_jump_2, null, this.front_jump_2, null, this.frontLeft_jump_2, null, this.backLeft_jump_2, null, this.back_jump_2]
            ]
        }

        this.shadowImages = [null, this.shadow_1, null, this.shadow_3, null, this.shadow_5, null, this.shadow_7, null, this.shadow_9, null, this.shadow_11]


    }

}