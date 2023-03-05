import shadow_1 from '../../images/shadows/base_shadow_1.png'
import shadow_3 from '../../images/shadows/base_shadow_3.png'
import shadow_5 from '../../images/shadows/base_shadow_5.png'
import shadow_7 from '../../images/shadows/base_shadow_7.png'
import shadow_9 from '../../images/shadows/base_shadow_9.png'
import shadow_11 from '../../images/shadows/base_shadow_11.png'

import base_sheet from '../../images/bases/mainBase/main_base_sheet.png'

export default class MainBaseImagesClass {

    constructor() {

        this.images = {

            shadow_1: new Image(),
            shadow_3: new Image(),
            shadow_5: new Image(),
            shadow_7: new Image(),
            shadow_9: new Image(),
            shadow_11: new Image()

        }

        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.shadowSize = {
            width: 2,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0.5,
            y: 0.5
        }

        this.deadSpace = {
            'health_lte_100': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_75': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_50': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_25': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32]
        }

        this.rows = {
            0: 'frontRight',
            1: 'frontLeft',
            2: 'front',
            3: 'backRight',
            4: 'backLeft',
            5: 'back'
        }

        this.sheet_data = {
            default: {
                image: base_sheet,
                spriteCount: 5,
                sprites: {
                    0: 'default_1',
                    1: 'default_2',
                    2: 'default_3',
                    3: 'default_4'
                }
            }
        }

        this.animation_data = {
            health_lte_100: [
                'default_1'
            ],
            health_lte_75: [
                'default_2'
            ],
            health_lte_50: [
                'default_3'
            ],
            health_lte_25: [
                'default_4'
            ]
        }

    }

    createSheetImages = () => {

        for (let sheetName in this.sheet_data) {

            let sprites = this.sheet_data[sheetName].sprites

            for (let col in sprites) {

                for (let row in this.rows) {

                    this.images[this.rows[row] + '_' + sprites[col]] = new Image()

                }

            }
        }
    }

    loadSheetImages = () => {

        for (let sheetName in this.sheet_data) {

            let sheet = new Image()

            sheet.onload = () => {
                let spriteCount = Object.keys(this.sheet_data[sheetName].sprites).length
                let sprites = this.sheet_data[sheetName].sprites
                let imageDims = {
                    width: sheet.width / spriteCount,
                    height: sheet.height / 6
                }

                for (let col in sprites) {

                    for (let row in this.rows) {

                        let tempCanvas = document.createElement('canvas')
                        tempCanvas.width = imageDims.width
                        tempCanvas.height = imageDims.height
                        let tempctx = tempCanvas.getContext('2d')

                        tempctx.drawImage(sheet, imageDims.width * col, imageDims.height * row, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

                        let image = tempCanvas.toDataURL('image/png');

                        this[this.rows[row] + '_' + sprites[col]].src = image

                    }

                }
            }

            sheet.src = this.sheet_data[sheetName].image

        }
    }

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                console.log(imagesLoaded, Object.keys(this.images).length)
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    this.assignImages(startGame)
                }
            }
        }

        this.loadSheetImages()


        this.shadow_1.src = shadow_1
        this.shadow_3.src = shadow_3
        this.shadow_5.src = shadow_5
        this.shadow_7.src = shadow_7
        this.shadow_9.src = shadow_9
        this.shadow_11.src = shadow_11

    }

    assignImages = (startGame) => {

        for(let animation in this.animation_data){

            let data = this.animation_data[animation]

            this[animation] = {
                images: []
            }

            for(let frame of data){
                this[animation].images.push([ null, this['backRight_' + frame], null, this['frontRight_' + frame], null, this['front_' + frame], null, this['frontLeft_' + frame], null, this['backLeft_' + frame], null, this['back_' + frame] ])
            }

        }

        this.shadowImages = [null, this.shadow_1, null, this.shadow_3, null, this.shadow_5, null, this.shadow_7, null, this.shadow_9, null, this.shadow_11]

        startGame();
    }

}