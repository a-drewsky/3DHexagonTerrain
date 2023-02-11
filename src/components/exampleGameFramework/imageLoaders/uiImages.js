import healthbar_1 from '../images/ui/healthbar/healthbar_1.png'
import healthbar_2 from '../images/ui/healthbar/healthbar_2.png'
import healthbar_3 from '../images/ui/healthbar/healthbar_3.png'
import healthbar_4 from '../images/ui/healthbar/healthbar_4.png'
import healthbar_5 from '../images/ui/healthbar/healthbar_5.png'
import healthbar_6 from '../images/ui/healthbar/healthbar_6.png'
import healthbar_7 from '../images/ui/healthbar/healthbar_7.png'
import healthbar_8 from '../images/ui/healthbar/healthbar_8.png'
import healthbar_9 from '../images/ui/healthbar/healthbar_9.png'
import healthbar_10 from '../images/ui/healthbar/healthbar_10.png'
import healthbar_11 from '../images/ui/healthbar/healthbar_11.png'

import resourcebar_1 from '../images/ui/resourcebar/resourcebar_1.png'
import resourcebar_2 from '../images/ui/resourcebar/resourcebar_2.png'
import resourcebar_3 from '../images/ui/resourcebar/resourcebar_3.png'
import resourcebar_4 from '../images/ui/resourcebar/resourcebar_4.png'
import resourcebar_5 from '../images/ui/resourcebar/resourcebar_5.png'
import resourcebar_6 from '../images/ui/resourcebar/resourcebar_6.png'
import resourcebar_7 from '../images/ui/resourcebar/resourcebar_7.png'
import resourcebar_8 from '../images/ui/resourcebar/resourcebar_8.png'
import resourcebar_9 from '../images/ui/resourcebar/resourcebar_9.png'
import resourcebar_10 from '../images/ui/resourcebar/resourcebar_10.png'
import resourcebar_11 from '../images/ui/resourcebar/resourcebar_11.png'

export default class UiImagesClass {

    constructor() {

        this.images = {

            healthbar_1: new Image(),
            healthbar_2: new Image(),
            healthbar_3: new Image(),
            healthbar_4: new Image(),
            healthbar_5: new Image(),
            healthbar_6: new Image(),
            healthbar_7: new Image(),
            healthbar_8: new Image(),
            healthbar_9: new Image(),
            healthbar_10: new Image(),
            healthbar_11: new Image(),

            resourcebar_1: new Image(),
            resourcebar_2: new Image(),
            resourcebar_3: new Image(),
            resourcebar_4: new Image(),
            resourcebar_5: new Image(),
            resourcebar_6: new Image(),
            resourcebar_7: new Image(),
            resourcebar_8: new Image(),
            resourcebar_9: new Image(),
            resourcebar_10: new Image(),
            resourcebar_11: new Image()

        }

    }

    loadImages = (startGame) => {


        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                
                console.log(imagesLoaded)
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    startGame();
                    delete this.loadImages
                }
            }
        }


        this.healthbar_1.src = healthbar_1
        this.healthbar_2.src = healthbar_2
        this.healthbar_3.src = healthbar_3
        this.healthbar_4.src = healthbar_4
        this.healthbar_5.src = healthbar_5
        this.healthbar_6.src = healthbar_6
        this.healthbar_7.src = healthbar_7
        this.healthbar_8.src = healthbar_8
        this.healthbar_9.src = healthbar_9
        this.healthbar_10.src = healthbar_10
        this.healthbar_11.src = healthbar_11

        this.resourcebar_1.src = resourcebar_1
        this.resourcebar_2.src = resourcebar_2
        this.resourcebar_3.src = resourcebar_3
        this.resourcebar_4.src = resourcebar_4
        this.resourcebar_5.src = resourcebar_5
        this.resourcebar_6.src = resourcebar_6
        this.resourcebar_7.src = resourcebar_7
        this.resourcebar_8.src = resourcebar_8
        this.resourcebar_9.src = resourcebar_9
        this.resourcebar_10.src = resourcebar_10
        this.resourcebar_11.src = resourcebar_11

        this.healthbar = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            images: [ this.healthbar_1, this.healthbar_2, this.healthbar_3, this.healthbar_4, this.healthbar_5, this.healthbar_6, this.healthbar_7, this.healthbar_8, this.healthbar_9, this.healthbar_10, this.healthbar_11 ]
        }

        this.resourcebar = {
            spriteSize: {
                width: 1,
                height: 1.5
            },
            spriteOffset: {
                x: 0,
                y: 0.5
            },
            images: [ this.resourcebar_1, this.resourcebar_2, this.resourcebar_3, this.resourcebar_4, this.resourcebar_5, this.resourcebar_6, this.resourcebar_7, this.resourcebar_8, this.resourcebar_9, this.resourcebar_10, this.resourcebar_11 ]
        }


    }

}