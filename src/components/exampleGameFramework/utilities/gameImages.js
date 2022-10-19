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

import woodlands_tree from '../images/woodland_tree.png'

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
            flat_woodlands_trees_hex: new Image(),
            flat_savanna_hex: new Image(),
            flat_tundra_hex: new Image(),
            flat_desert_hex: new Image(),
            flat_water_hex: new Image(),
            flat_frozenWater_hex: new Image(),
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
            pointy_frozenWater_hex: new Image(),
            pointy_playa_hex: new Image(),

            oaktree_sprite_1: new Image()
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
        this.flat_woodlands_trees_hex.src = flat_woodlands_hex;
        this.flat_savanna_hex.src = flat_savanna_hex;
        this.flat_tundra_hex.src = flat_tundra_hex;
        this.flat_desert_hex.src = flat_desert_hex;
        this.flat_water_hex.src = flat_water_hex;
        this.flat_frozenWater_hex.src = flat_frozenwater_hex;
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
        this.pointy_frozenWater_hex.src = pointy_example_hex;
        this.pointy_playa_hex.src = pointy_example_hex;


        this.oaktree_sprite_1.src = woodlands_tree;


        //Create Image objects

        this.oaktree_sprite = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            treeImages: [
                this.oaktree_sprite_1
            ],
            images: []
        }

    }
}