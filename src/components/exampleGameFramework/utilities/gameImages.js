import woodlands_hex from '../images/woodlands_hex.png'
import water_hex from '../images/water_hex.png'
import desert_hex from '../images/desert_hex.png'
import tundra_hex from '../images/tundra_hex.png'
import frozen_water_hex from '../images/frozen_water_hex.png'
import savanna_hex from '../images/savanna_hex.png'
import playa_hex from '../images/playa_hex.png'
import sand_hill_hex from '../images/sand_hill_hex.png'
import grass_hill_hex from '../images/grass_hill_hex.png'
import rock_hill_hex from '../images/rock_hill_hex.png'
import snow_hill_hex from '../images/snow_hill_hex.png'

export default class ImagesClass {

    constructor() {
        this.images = {
            snowmountainHex: new Image(),
            rockmountainHex: new Image(),
            snowhillHex: new Image(),
            grasshillHex: new Image(),
            sandhillHex: new Image(),
            woodlandsHex: new Image(),
            savannaHex: new Image(),
            tundraHex: new Image(),
            desertHex: new Image(),
            waterHex:new Image(),
            frozenWaterHex: new Image(),
            playaHex: new Image()
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

        this.snowmountainHex.src = snow_hill_hex;
        this.rockmountainHex.src = rock_hill_hex;
        this.snowhillHex.src = snow_hill_hex;
        this.grasshillHex.src = grass_hill_hex;
        this.sandhillHex.src = sand_hill_hex;
        this.woodlandsHex.src = woodlands_hex;
        this.savannaHex.src = savanna_hex;
        this.tundraHex.src = tundra_hex;
        this.desertHex.src = desert_hex;
        this.waterHex.src = water_hex;
        this.frozenWaterHex.src = frozen_water_hex;
        this.playaHex.src = playa_hex;


    }

}