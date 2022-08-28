import woodlands_hex from './images/woodlands_hex.png'
import water_hex from './images/water_hex.png'
import desert_hex from './images/desert_hex.png'
import tundra_hex from './images/tundra_hex.png'
import frozen_water_hex from './images/frozen_water_hex.png'

export default class ImagesClass {

    constructor() {
        this.images = {
            snowmountainHex: new Image(),
            rockmountainHex: new Image(),
            rockhillHex: new Image(),
            grasshillHex: new Image(),
            sandhillHex: new Image(),
            mesaHex: new Image(),
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

        this.snowmountainHex.src = woodlands_hex;
        this.rockmountainHex.src = woodlands_hex;
        this.rockhillHex.src = woodlands_hex;
        this.grasshillHex.src = woodlands_hex;
        this.sandhillHex.src = woodlands_hex;
        this.mesaHex.src = woodlands_hex;
        this.woodlandsHex.src = woodlands_hex;
        this.savannaHex.src = woodlands_hex;
        this.tundraHex.src = tundra_hex;
        this.desertHex.src = desert_hex;
        this.waterHex.src = water_hex;
        this.frozenWaterHex.src = frozen_water_hex;
        this.playaHex.src = woodlands_hex;


    }

}