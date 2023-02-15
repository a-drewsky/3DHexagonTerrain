import flag from '../images/structures/mainBase/main_base_q0r0.png'

import flag_shadow_1 from '../images/shadows/small_round_shadow_1.png'
import flag_shadow_3 from '../images/shadows/small_round_shadow_3.png'
import flag_shadow_5 from '../images/shadows/small_round_shadow_5.png'
import flag_shadow_7 from '../images/shadows/small_round_shadow_7.png'
import flag_shadow_9 from '../images/shadows/small_round_shadow_9.png'
import flag_shadow_11 from '../images/shadows/small_round_shadow_11.png'

export default class FlagImagesClass {

    constructor() {

        this.images = {
            flag: new Image(),
            
            flag_shadow_1: new Image(),
            flag_shadow_3: new Image(),
            flag_shadow_5: new Image(),
            flag_shadow_7: new Image(),
            flag_shadow_9: new Image(),
            flag_shadow_11: new Image()
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

        this.flag.src = flag

        this.flag_shadow_1.src = flag_shadow_1
        this.flag_shadow_3.src = flag_shadow_3
        this.flag_shadow_5.src = flag_shadow_5
        this.flag_shadow_7.src = flag_shadow_7
        this.flag_shadow_9.src = flag_shadow_9
        this.flag_shadow_11.src = flag_shadow_11



        //Create Image objects

        this.flag = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            shadowSize: {
                width: 1,
                height: 1.5
            },
            shadowOffset: {
                x: 0,
                y: 0.5
            },
            images: [
                [null, this.flag, null, this.flag, null, this.flag, null, this.flag, null, this.flag, null, this.flag]
            ],
            shadowImages: [
                [null, this.flag_shadow_1, null, this.flag_shadow_3, null, this.flag_shadow_5, null, this.flag_shadow_7, null, this.flag_shadow_9, null, this.flag_shadow_11]
            ],
            deadSpace: [
                [null, 3 / 32, null, 3 / 32, null, 3 / 32, null, 3 / 32, null, 3 / 32, null, 3 / 32]
            ]
        }

    }

}