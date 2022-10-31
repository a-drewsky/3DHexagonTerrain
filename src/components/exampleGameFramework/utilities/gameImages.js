import pointy_example_hex from '../images/pointy_example_hex.png'
import flat_example_hex from '../images/flat_example_hex.png'

import flat_woodlands_hex from '../images/flat_woodlands_hex.png'
import flat_desert_hex from '../images/flat_desert_hex.png'
import flat_water_hex from '../images/flat_water_hex.png'
import flat_frozenwater_hex from '../images/flat_frozenwater_hex.png'
import flat_playa_hex from '../images/flat_playa_hex.png'
import flat_tundra_hex from '../images/flat_tundra_hex.png'
import flat_savanna_hex from '../images/flat_savanna_hex.png'
import flat_sandhill_hex from '../images/flat_sandhill_hex.png'
import flat_grasshill_hex from '../images/flat_grasshill_hex.png'
import flat_snowhill_hex from '../images/flat_snowhill_hex.png'
import flat_rockhill_hex from '../images/flat_rockhill_hex.png'
import flat_savannahill_hex from '../images/flat_savannahill_hex.png'

import woodlands_tree_1 from '../images/woodland_tree_01.png'
import woodlands_tree_2 from '../images/woodland_tree_02.png'

import savanna_tree from '../images/savanna_tree.png'

import tundra_tree_1 from '../images/tundra_tree_01.png'
import tundra_tree_2 from '../images/tundra_tree_02.png'

import desert_tree_1 from '../images/desert_tree_01.png'
import desert_tree_2 from '../images/desert_tree_02.png'

import rock_1 from '../images/rock_01.png'
import rock_2 from '../images/rock_02.png'

import large_rock from '../images/large_rock.png'

import copper_mine_1 from '../images/copper_mine_1.png'
import copper_mine_2 from '../images/copper_mine_2.png'
import copper_mine_3 from '../images/copper_mine_3.png'
import copper_mine_4 from '../images/copper_mine_4.png'
import copper_mine_5 from '../images/copper_mine_5.png'

import gold_mine_1 from '../images/gold_mine_1.png'
import gold_mine_2 from '../images/gold_mine_2.png'
import gold_mine_3 from '../images/gold_mine_3.png'
import gold_mine_4 from '../images/gold_mine_4.png'
import gold_mine_5 from '../images/gold_mine_5.png'

import iron_mine_1 from '../images/iron_mine_1.png'
import iron_mine_2 from '../images/iron_mine_2.png'
import iron_mine_3 from '../images/iron_mine_3.png'
import iron_mine_4 from '../images/iron_mine_4.png'
import iron_mine_5 from '../images/iron_mine_5.png'

import ruby_mine_1 from '../images/ruby_mine_1.png'
import ruby_mine_2 from '../images/ruby_mine_2.png'
import ruby_mine_3 from '../images/ruby_mine_3.png'
import ruby_mine_4 from '../images/ruby_mine_4.png'
import ruby_mine_5 from '../images/ruby_mine_5.png'

import amethyst_mine_1 from '../images/amethyst_mine_1.png'
import amethyst_mine_2 from '../images/amethyst_mine_2.png'
import amethyst_mine_3 from '../images/amethyst_mine_3.png'
import amethyst_mine_4 from '../images/amethyst_mine_4.png'
import amethyst_mine_5 from '../images/amethyst_mine_5.png'

export default class ImagesClass {

    constructor() {
        this.images = {
            flat_example_hex: new Image(),
            flat_snowmountain_hex: new Image(),
            flat_rockmountain_hex: new Image(),
            flat_snowhill_hex: new Image(),
            flat_grasshill_hex: new Image(),
            flat_savannahill_hex: new Image(),
            flat_sandhill_hex: new Image(),
            flat_woodlands_hex: new Image(),
            flat_savanna_hex: new Image(),
            flat_tundra_hex: new Image(),
            flat_desert_hex: new Image(),
            flat_water_hex: new Image(),
            flat_frozenwater_hex: new Image(),
            flat_playa_hex: new Image(),

            pointy_example_hex: new Image(),
            pointy_snowmountain_hex: new Image(),
            pointy_rockmountain_hex: new Image(),
            pointy_snowhill_hex: new Image(),
            pointy_grasshill_hex: new Image(),
            pointy_savannahill_hex: new Image(),
            pointy_sandhill_hex: new Image(),
            pointy_woodlands_hex: new Image(),
            pointy_savanna_hex: new Image(),
            pointy_tundra_hex: new Image(),
            pointy_desert_hex: new Image(),
            pointy_water_hex: new Image(),
            pointy_frozenwater_hex: new Image(),
            pointy_playa_hex: new Image(),

            oaktree_sprite_1: new Image(),
            oaktree_sprite_2: new Image(),

            savannatree_sprite: new Image(),

            tundratree_sprite_1: new Image(),
            tundratree_sprite_2: new Image(),

            deserttree_sprite_1: new Image(),
            deserttree_sprite_2: new Image(),

            rock_sprite_1: new Image(),
            rock_sprite_2: new Image(),

            largerock_sprite: new Image(),

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

        //Assign images

        this.flat_example_hex.src = flat_example_hex;
        this.flat_snowmountain_hex.src = flat_snowhill_hex;
        this.flat_rockmountain_hex.src = flat_rockhill_hex;
        this.flat_snowhill_hex.src = flat_snowhill_hex;
        this.flat_grasshill_hex.src = flat_grasshill_hex;
        this.flat_savannahill_hex.src = flat_savannahill_hex;
        this.flat_sandhill_hex.src = flat_sandhill_hex;
        this.flat_woodlands_hex.src = flat_woodlands_hex;
        this.flat_savanna_hex.src = flat_savanna_hex;
        this.flat_tundra_hex.src = flat_tundra_hex;
        this.flat_desert_hex.src = flat_desert_hex;
        this.flat_water_hex.src = flat_water_hex;
        this.flat_frozenwater_hex.src = flat_frozenwater_hex;
        this.flat_playa_hex.src = flat_playa_hex;

        this.pointy_example_hex.src = pointy_example_hex;
        this.pointy_snowmountain_hex.src = pointy_example_hex;
        this.pointy_rockmountain_hex.src = pointy_example_hex;
        this.pointy_snowhill_hex.src = pointy_example_hex;
        this.pointy_grasshill_hex.src = pointy_example_hex;
        this.pointy_savannahill_hex.src = pointy_example_hex;
        this.pointy_sandhill_hex.src = pointy_example_hex;
        this.pointy_woodlands_hex.src = pointy_example_hex;
        this.pointy_savanna_hex.src = pointy_example_hex;
        this.pointy_tundra_hex.src = pointy_example_hex;
        this.pointy_desert_hex.src = pointy_example_hex;
        this.pointy_water_hex.src = pointy_example_hex;
        this.pointy_frozenwater_hex.src = pointy_example_hex;
        this.pointy_playa_hex.src = pointy_example_hex;


        this.oaktree_sprite_1.src = woodlands_tree_1;
        this.oaktree_sprite_2.src = woodlands_tree_2;

        this.savannatree_sprite.src = savanna_tree

        this.tundratree_sprite_1.src = tundra_tree_1
        this.tundratree_sprite_2.src = tundra_tree_2

        this.deserttree_sprite_1.src = desert_tree_1
        this.deserttree_sprite_2.src = desert_tree_2

        this.rock_sprite_1.src = rock_1
        this.rock_sprite_2.src = rock_2

        this.largerock_sprite.src = large_rock

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

        //Create Image objects

        this.tiles = {
            snowmountain: {
                flat: [this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex, this.flat_snowmountain_hex],
                pointy: [this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex, this.pointy_snowmountain_hex]
            },
            rockmountain: {
                flat: [this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex, this.flat_rockmountain_hex],
                pointy: [this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex, this.pointy_rockmountain_hex]
            },
            snowhill: {
                flat: [this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex, this.flat_snowhill_hex],
                pointy: [this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex, this.pointy_snowhill_hex]
            },
            grasshill: {
                flat: [this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex, this.flat_grasshill_hex],
                pointy: [this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex, this.pointy_grasshill_hex]
            },
            savannahill: {
                flat: [this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex, this.flat_savannahill_hex],
                pointy: [this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex, this.pointy_savannahill_hex]
            },
            sandhill: {
                flat: [this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex, this.flat_sandhill_hex],
                pointy: [this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex, this.pointy_sandhill_hex]
            },
            woodlands: {
                flat: [this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex, this.flat_woodlands_hex],
                pointy: [this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex, this.pointy_woodlands_hex]
            },
            savanna: {
                flat: [this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex, this.flat_savanna_hex],
                pointy: [this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex, this.pointy_savanna_hex]
            },
            tundra: {
                flat: [this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex, this.flat_tundra_hex],
                pointy: [this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex, this.pointy_tundra_hex]
            },
            desert: {
                flat: [this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex, this.flat_desert_hex],
                pointy: [this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex, this.pointy_desert_hex]
            },
            water: {
                flat: [this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex, this.flat_water_hex],
                pointy: [this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex, this.pointy_water_hex]
            },
            frozenwater: {
                flat: [this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex, this.flat_frozenwater_hex],
                pointy: [this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex, this.pointy_frozenwater_hex]
            },
            playa: {
                flat: [this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex, this.flat_playa_hex],
                pointy: [this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex, this.pointy_playa_hex]
            }
        }

        this.modifiers = {
            size: {
                width: 1,
                height: 2
            },
            modifierSize: {
                width: 1,
                height: 1.5
            },
            offset: {
                x: 0,
                y: 1
            },
            oaktree: {
                modifierImages: [
                    this.oaktree_sprite_1,
                    this.oaktree_sprite_2
                ]
            },
            tundratree: {
                modifierImages: [
                    this.tundratree_sprite_1,
                    this.tundratree_sprite_2
                ]
            },
            deserttree: {
                modifierImages: [
                    this.deserttree_sprite_1,
                    this.deserttree_sprite_2
                ]
            },
            rocks: {
                modifierImages: [
                    this.rock_sprite_1,
                    this.rock_sprite_2
                ]
            }
        }

        this.savannatree = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            images: [
                [this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite, this.savannatree_sprite]
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
            images: [
                [this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite, this.largerock_sprite]
            ]
        }

        this.coppermine = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            images: [
                [this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1, this.coppermine_sprite_1],
                [this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2, this.coppermine_sprite_2],
                [this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3, this.coppermine_sprite_3],
                [this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4, this.coppermine_sprite_4],
                [this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5, this.coppermine_sprite_5],
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
            images: [
                [this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1, this.goldmine_sprite_1],
                [this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2, this.goldmine_sprite_2],
                [this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3, this.goldmine_sprite_3],
                [this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4, this.goldmine_sprite_4],
                [this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5, this.goldmine_sprite_5],
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
            images: [
                [this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1, this.ironmine_sprite_1],
                [this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2, this.ironmine_sprite_2],
                [this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3, this.ironmine_sprite_3],
                [this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4, this.ironmine_sprite_4],
                [this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5, this.ironmine_sprite_5],
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
            images: [
                [this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1, this.rubymine_sprite_1],
                [this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2, this.rubymine_sprite_2],
                [this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3, this.rubymine_sprite_3],
                [this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4, this.rubymine_sprite_4],
                [this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5, this.rubymine_sprite_5],
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
            images: [
                [this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1, this.amethystmine_sprite_1],
                [this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2, this.amethystmine_sprite_2],
                [this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3, this.amethystmine_sprite_3],
                [this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4, this.amethystmine_sprite_4],
                [this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5, this.amethystmine_sprite_5],
            ]
        }

    }
}